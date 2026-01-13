import { Router } from "express";
import { db } from "../db/client";

const router = Router();

router.get("/", async (req, res) => {
    const result = await db.query(
        `
        SELECT *
        FROM recommendations
        WHERE customer_id = $1
        AND resolved_at IS NULL
        ORDER BY priority DESC, created_at DESC
        `,
        [req.user!.customer_id]
    );

    res.json(result.rows);
});

export default router;
