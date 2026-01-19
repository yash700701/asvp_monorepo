import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { db } from "../db/client";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
    const { message, page } = req.body;

    await db.query(
        `
        INSERT INTO feedback (
        customer_id, user_id, page, message
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
            req.user!.customer_id,
            req.user!.user_id,
            page,
            message
        ]
    );

    res.json({ success: true });
});

export default router;
