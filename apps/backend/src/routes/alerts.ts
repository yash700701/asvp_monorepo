import { Router } from "express";
import { db } from "../db/client";
import { DEFAULT_CUSTOMER_ID } from "../config/customer";

const router = Router();

router.get("/", async (_req, res) => {
    const result = await db.query(
        `
        SELECT *
        FROM alerts
        WHERE customer_id = $1
        ORDER BY created_at DESC
        `,
        [DEFAULT_CUSTOMER_ID]
    );

    res.json(result.rows);
});

router.post("/:id/ack", async (req, res) => {
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
