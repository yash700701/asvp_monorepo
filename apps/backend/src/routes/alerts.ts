import { Router } from "express";
import { db } from "../db/client";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    const result = await db.query(
        `
        SELECT *
        FROM alerts
        WHERE customer_id = $1
        ORDER BY created_at DESC
        `,
        [req.user!.customer_id]
    );

    res.json(result.rows);
});

router.post("/:id/ack", requireAuth, async (req, res) => {
    const { id } = req.params;

    await db.query(
        `
        UPDATE alerts
        SET acknowledged_at = now()
        WHERE id = $1
        `,
        [id]
    );

    res.json({ message: "Alert acknowledged" });
});

export default router;
