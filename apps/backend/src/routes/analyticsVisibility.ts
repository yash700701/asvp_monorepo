import { Router } from "express";
import { db } from "../db/client";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * GET /analytics/visibility
 * Query params:
 *   from?: ISO date
 *   to?: ISO date
 */
router.get("/visibility", requireAuth, async (req, res) => {
    const { from, to } = req.query;

    const params: any[] = [req.user!.customer_id];
    let dateFilter = "";

    if (from) {
        params.push(from);
        dateFilter += ` AND r.started_at >= $${params.length}`;
    }

    if (to) {
        params.push(to);
        dateFilter += ` AND r.started_at <= $${params.length}`;
    }

    const result = await db.query(
        `
        SELECT
        date_trunc('day', r.started_at) AS day,
        s.type AS source_type,
        AVG(
            CASE
            WHEN a.mentions_brand THEN a.confidence
            ELSE 0
            END
        ) AS visibility_score,
        COUNT(*) AS total_answers,
        SUM(CASE WHEN a.mentions_brand THEN 1 ELSE 0 END) AS brand_mentions
        FROM answers a
        JOIN runs r ON r.id = a.run_id
        JOIN sources s ON s.id = r.source_id
        JOIN queries q ON q.id = r.query_id
        WHERE q.customer_id = $1
        ${dateFilter}
        GROUP BY day, source_type
        ORDER BY day DESC, source_type
        `,
        params
    );

    res.json(result.rows);
});

export default router;
