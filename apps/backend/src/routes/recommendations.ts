import { Router } from "express";
import { db } from "../db/client";
import { DEFAULT_CUSTOMER_ID } from "../config/customer";

const router = Router();

router.get("/", async (_req, res) => {
    const result = await db.query(
        `
        SELECT *
        FROM recommendations
        WHERE customer_id = $1
        AND resolved_at IS NULL
        ORDER BY priority DESC, created_at DESC
        `,
        [DEFAULT_CUSTOMER_ID]
    );

    res.json(result.rows);
});

export default router;
