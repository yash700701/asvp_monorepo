import express, { Router } from "express";
import crypto from "crypto";
import { db } from "../db/client";
import { PLANS } from "../billing/plans";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const router = Router();

/**
 * POST /billing/webhook
 * Razorpay webhook endpoint
 */
router.post(
    "/webhook",
    // IMPORTANT: raw body for signature verification
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const signature = req.headers["x-razorpay-signature"] as string;
        const rawBody = req.body as Buffer;

        if (!secret || !signature || !Buffer.isBuffer(rawBody)) {
            return res.status(400).json({ error: "Invalid webhook payload" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        const event = JSON.parse(rawBody.toString());

        if (event.event === "payment_link.paid") {
            const paymentLink = event.payload.payment_link.entity;
            const payment = event.payload.payment?.entity;
            const notes = paymentLink.notes || payment?.notes || {};
            let customerId = notes.customer_id;
            let planKey = notes.plan as keyof typeof PLANS | undefined;

            if ((!customerId || !planKey) && typeof paymentLink.reference_id === "string") {
                const [referenceCustomerId, referencePlan] = paymentLink.reference_id.split("-");
                if (!customerId && referenceCustomerId) {
                    customerId = referenceCustomerId;
                }
                if (!planKey && referencePlan && referencePlan in PLANS) {
                    planKey = referencePlan as keyof typeof PLANS;
                }
            }

            if (!planKey || !(planKey in PLANS) || planKey === "free") {
                console.warn("payment_link.paid without usable plan", {
                    payment_link_id: paymentLink.id,
                    reference_id: paymentLink.reference_id,
                    notes,
                });
                return res.json({ ok: true });
            }

            // Match the pending customer row by payment link id first because that is
            // guaranteed to be persisted before the user leaves checkout.
            let updateResult = await db.query(
                `
                UPDATE customers
                SET
                    plan = $1,
                    run_limit = $2,
                    billing_status = 'active',
                    plan_started_at = now(),
                    plan_expires_at = now() + interval '30 days',
                    razorpay_payment_link_id = $3,
                    razorpay_payment_id = $4
                WHERE razorpay_payment_link_id = $3
                RETURNING id
                `,
                [
                    planKey,
                    PLANS[planKey].run_limit,
                    paymentLink.id,
                    payment?.id ?? null,
                ]
            );

            if (updateResult.rowCount === 0 && customerId) {
                updateResult = await db.query(
                    `
                    UPDATE customers
                    SET
                        plan = $1,
                        run_limit = $2,
                        billing_status = 'active',
                        plan_started_at = now(),
                        plan_expires_at = now() + interval '30 days',
                        razorpay_payment_link_id = $3,
                        razorpay_payment_id = $4
                    WHERE id = $5
                    RETURNING id
                    `,
                    [
                        planKey,
                        PLANS[planKey].run_limit,
                        paymentLink.id,
                        payment?.id ?? null,
                        customerId,
                    ]
                );
            }

            if (updateResult.rowCount === 0) {
                console.warn("payment_link.paid did not match any customer", {
                    payment_link_id: paymentLink.id,
                    customer_id: customerId,
                    plan: planKey,
                });
            } else {
                console.log("payment_link.paid applied", {
                    payment_link_id: paymentLink.id,
                    customer_id: customerId,
                    plan: planKey,
                });
            }
        }

        if (event.event === "payment_link.cancelled" || event.event === "payment_link.expired") {
            const paymentLink = event.payload.payment_link.entity;

            await db.query(
                `
                UPDATE customers
                SET
                    billing_status = CASE
                        WHEN plan_expires_at IS NOT NULL AND plan_expires_at > now() THEN billing_status
                        ELSE 'inactive'
                    END,
                    razorpay_payment_link_id = NULL
                WHERE razorpay_payment_link_id = $1
                `,
                [paymentLink.id]
            );
        }

        res.json({ received: true });
    }
);

export default router;
