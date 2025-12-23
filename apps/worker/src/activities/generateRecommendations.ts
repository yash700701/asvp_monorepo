import { db } from "../db/client";

export async function generateRecommendations(input: {
    customerId: string;
}) {
    // Low visibility queries
    const lowVisibility = await db.query(
        `
        SELECT
        q.id AS query_id,
        s.id AS source_id,
        AVG(
            CASE WHEN a.mentions_brand THEN a.confidence ELSE 0 END
        ) AS visibility
        FROM answers a
        JOIN runs r ON r.id = a.run_id
        JOIN queries q ON q.id = r.query_id
        JOIN sources s ON s.id = r.source_id
        WHERE q.customer_id = $1
        GROUP BY q.id, s.id
        HAVING AVG(
        CASE WHEN a.mentions_brand THEN a.confidence ELSE 0 END
        ) < 0.3
        `,
        [input.customerId]
    );

    for (const row of lowVisibility.rows) {
        await db.query(
        `
        INSERT INTO recommendations (
            customer_id,
            query_id,
            source_id,
            type,
            priority,
            message,
            evidence
        )
        VALUES ($1, $2, $3, 'visibility_gap', 'high', $4, $5)
        `,
        [
            input.customerId,
            row.query_id,
            row.source_id,
            "Your brand rarely appears for this query. Add authoritative FAQ/About content targeting this topic.",
            { visibility: row.visibility }
        ]
        );
    }

    // Recent SoV drop alerts
    const alerts = await db.query(
        `
        SELECT source_id, message
        FROM alerts
        WHERE customer_id = $1
        AND alert_type = 'sov_drop'
        AND created_at >= now() - INTERVAL '2 days'
        `,
        [input.customerId]
    );

    for (const alert of alerts.rows) {
        await db.query(
        `
        INSERT INTO recommendations (
            customer_id,
            source_id,
            type,
            priority,
            message,
            evidence
        )
        VALUES ($1, $2, 'sov_loss', 'high', $3, $4)
        `,
        [
            input.customerId,
            alert.source_id,
            "Competitors overtook you in AI answers. Review competitor claims and add missing facts/entities.",
            { alert: alert.message }
        ]
        );
    }

    // Low confidence answers
    const lowConfidence = await db.query(
        `
        SELECT
        q.id AS query_id,
        s.id AS source_id,
        AVG(a.confidence) AS avg_confidence
        FROM answers a
        JOIN runs r ON r.id = a.run_id
        JOIN queries q ON q.id = r.query_id
        JOIN sources s ON s.id = r.source_id
        WHERE q.customer_id = $1
        GROUP BY q.id, s.id
        HAVING AVG(a.confidence) < 0.5
        `,
        [input.customerId]
    );

    for (const row of lowConfidence.rows) {
        await db.query(
        `
        INSERT INTO recommendations (
            customer_id,
            query_id,
            source_id,
            type,
            priority,
            message,
            evidence
        )
        VALUES ($1, $2, $3, 'low_confidence', 'medium', $4, $5)
        `,
        [
            input.customerId,
            row.query_id,
            row.source_id,
            "AI answers lack confidence. Add structured data, citations, and explicit claims to your content.",
            { avg_confidence: row.avg_confidence }
        ]
        );
    }
}
