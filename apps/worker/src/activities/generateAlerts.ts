import { db } from "../db/client";

export async function generateSoVDropAlerts(input: {
    customerId: string;
}) {
    const res = await db.query(
        `
        WITH daily_sov AS (
        SELECT
            date_trunc('day', r.started_at) AS day,
            s.id AS source_id,
            SUM(CASE WHEN a.mentions_brand THEN 1 ELSE 0 END)::float
            / COUNT(*) AS sov
        FROM answers a
        JOIN runs r ON r.id = a.run_id
        JOIN sources s ON s.id = r.source_id
        JOIN queries q ON q.id = r.query_id
        WHERE q.customer_id = $1
        GROUP BY day, source_id
        ),
        diffs AS (
        SELECT
            d1.day AS day,
            d1.source_id,
            d1.sov AS today_sov,
            d2.sov AS yesterday_sov,
            (d2.sov - d1.sov) AS drop
        FROM daily_sov d1
        JOIN daily_sov d2
            ON d1.source_id = d2.source_id
        AND d1.day = d2.day + INTERVAL '1 day'
        )
        SELECT *
        FROM diffs
        WHERE drop >= 0.2
        `,
        [input.customerId]
    );

    for (const row of res.rows) {
        await db.query(
            `
        INSERT INTO alerts (
            customer_id,
            source_id,
            alert_type,
            severity,
            message
        )
        VALUES ($1, $2, 'sov_drop', 'high', $3)
        `,
            [
                input.customerId,
                row.source_id,
                `Share-of-Voice dropped by ${(row.drop * 100).toFixed(1)}%`
            ]
        );
    }
}
