import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { db } from "../db/client";

const router = Router();

router.get("/usage", requireAuth, async (req, res) => {
    const customerId = req.user!.customer_id;

    try {
        const usageRes = await db.query(
            `
            SELECT COUNT(*)::int AS count
            FROM runs
            WHERE customer_id = $1
            AND started_at >= date_trunc('month', now()) 
            `,
            [req.user!.customer_id]
        );

        const used = usageRes.rows[0].count;

        const planRes = await db.query(
            `
            SELECT plan, run_limit
            FROM customers
            WHERE id = $1
            `,
            [customerId]
        );

        res.json({
            plan: planRes.rows[0].plan,
            used,
            limit: planRes.rows[0].run_limit
        });
    } catch (error) {
        console.error("Error fetching usage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
