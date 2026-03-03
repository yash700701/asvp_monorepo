import { Router } from "express";
import { db } from "../db/client";

const router = Router();

router.get("/visibility-overview", async (req, res) => {
    try {
        const { brandId } = req.query;
        const customerId = req.user?.customer_id;

        if (!brandId || typeof brandId !== "string") {
            return res.status(400).json({ error: "brandId required" });
        }

        const query = `
        SELECT
            created_at,
            visibility_score,
            (visibility->'breakdown'->>'trust')::float AS trust,
            (visibility->'breakdown'->>'sentiment')::float AS sentiment,
            (visibility->'breakdown'->>'brandPresence')::float AS "brandPresence"
        FROM answers
        WHERE customer_id = $1
        AND brand_id = $2
        ORDER BY created_at DESC
        LIMIT 100
        `;

        const result = await db.query(query, [customerId, brandId]);

        return res.json({ success: true, data: result.rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;