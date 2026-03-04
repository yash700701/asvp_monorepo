import { query, Router } from "express";
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

router.get('/brandMentions', async (req, res) => {
    try {
        const { brandId } = req.query;
        const customerId = req.user?.customer_id;

        if (!brandId || typeof brandId !== "string") {
            return res.status(400).json({ error: "brandId required" });
        }

        const query1 = `
        SELECT
        date_trunc('day', created_at) AS day,
        COUNT(*) FILTER (WHERE mentions_brand = true) * 100.0 / COUNT(*) AS mention_rate
        FROM answers
        WHERE customer_id = $1
        AND brand_id = $2
        GROUP BY day
        ORDER BY day;
        `;

        const query2 = `
        SELECT
        COUNT(*) FILTER (WHERE mentions_brand = true) AS mentions,
        COUNT(*) AS total
        FROM answers
        WHERE customer_id = $1
        AND brand_id = $2;
        `

        const Trend = await db.query(query1, [customerId, brandId]);
        const count = await db.query(query2, [customerId, brandId]);
        return res.json({ success: true, data: Trend.rows, count: count.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/sentiment-overview", async (req, res) => {
    try {
        const { brandId } = req.query;
        const customerId = req.user?.customer_id;
        if (!brandId || typeof brandId !== "string") {
            return res.status(400).json({ error: "brandId required" });
        }

        const query1 = `
            SELECT
            created_at,
            (sentiment_data->>'score')::float AS sentiment_score,
            sentiment_data->>'label' AS sentiment_label,
            (sentiment_data->'similarities'->>'positive')::float AS positive_sim,
            (sentiment_data->'similarities'->>'neutral')::float AS neutral_sim,
            (sentiment_data->'similarities'->>'negative')::float AS negative_sim
        FROM answers
        WHERE customer_id = $1
        AND brand_id = $2
        ORDER BY created_at DESC
        LIMIT 100;
        `;

    
        const Aggregate = await db.query(query1, [customerId, brandId]);
        return res.json({ success: true, data: Aggregate.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;