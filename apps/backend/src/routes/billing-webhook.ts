import { Router } from "express";
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
    require("body-parser").raw({ type: "application/json" }),
    async (req, res) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const signature = req.headers["x-razorpay-signature"] as string;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(req.body)
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        const event = JSON.parse(req.body.toString());

        /* ================= subscription activated ================= */
        if (event.event === "subscription.activated") {
            const subscription = event.payload.subscription.entity;

            const subscriptionId = subscription.id;
            const planId = subscription.plan_id;

            // Find plan key from PLANS
            const planKey = Object.entries(PLANS).find(
                ([_, p]) =>
                    "razorpay_plan_id" in p &&
                    p.razorpay_plan_id === planId
            )?.[0];


            if (!planKey) {
                console.warn("Unknown plan_id:", planId);
                return res.json({ ok: true });
            }

            await db.query(
                `
                UPDATE customers
                SET
                plan = $1,
                plan_started_at = now()
                WHERE razorpay_subscription_id = $2
                `,
                [planKey, subscriptionId]
            );
        }

        /* ================= subscription cancelled ================= */
        if (event.event === "subscription.cancelled") {
            const subscriptionId =
                event.payload.subscription.entity.id;

            await db.query(
                `
                UPDATE customers
                SET
                plan = 'free',
                razorpay_subscription_id = NULL
                WHERE razorpay_subscription_id = $1
                `,
                [subscriptionId]
            );
        }

        res.json({ received: true });
    }
);

export default router;
