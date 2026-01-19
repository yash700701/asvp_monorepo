import axios from "axios";
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { razorpay } from "../billing/razorpay";
import { db } from "../db/client";
import { PLANS, PlanKey } from "../billing/plans";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const router = Router();

router.post("/subscribe", requireAuth, async (req, res) => {
    const { plan } = req.body as { plan?: PlanKey };
    const customerId = req.user!.customer_id;

    if (!plan || !(plan in PLANS) || plan === "free") {
        return res.status(400).json({ error: "Invalid plan" });
    }

    const planConfig = PLANS[plan];

    if (!planConfig.razorpay_plan_id) {
        return res.status(400).json({ error: "Invalid plan" });
    }

    /* ---------------- Create subscription ---------------- */
    const subscription = await razorpay.subscriptions.create({
        plan_id: planConfig.razorpay_plan_id,
        total_count: 12,
        customer_notify: 1,
    });

    /* ---------------- Create subscription link (RAW REST) ---------------- */
    const linkRes = await axios.post(
        "https://api.razorpay.com/v1/subscription_links",
        {
            subscription_id: subscription.id,
            customer: {
                email: req.user!.email,
            },
            notify: {
                email: true,
            },
            callback_url: `${process.env.FRONTEND_URL}/billing/success`,
            callback_method: "get",
        },
        {
            auth: {
                username: process.env.RAZORPAY_KEY_ID!,
                password: process.env.RAZORPAY_KEY_SECRET!,
            },
        }
    );

    /* ---------------- Persist ---------------- */
    await db.query(
        `
        UPDATE customers
        SET razorpay_subscription_id = $1
        WHERE id = $2
        `,
        [subscription.id, customerId]
    );

    res.json({
        subscription_id: subscription.id,
        payment_url: linkRes.data.short_url,
    });
});

export default router;
