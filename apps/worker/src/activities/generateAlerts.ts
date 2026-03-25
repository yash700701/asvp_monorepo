import { db } from "../db/client";

type AlertInput = {
    customerId: string;
    brandId?: string | null;
    queryId?: string | null;
    runId?: string | null;
    sourceId?: string | null;
    alertType: string;
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    message: string;
    metricValue?: number | null;
    baselineValue?: number | null;
    thresholdValue?: number | null;
    dedupeKey: string;
    evidence?: Record<string, unknown>;
};

async function createOrRefreshAlert(input: AlertInput) {
    const existing = await db.query(
        `
        SELECT id, status
        FROM alerts
        WHERE customer_id = $1
        AND dedupe_key = $2
        AND status IN ('open', 'acknowledged')
        LIMIT 1
        `,
        [input.customerId, input.dedupeKey]
    );

    if (existing.rows.length > 0) {
        await db.query(
            `
            UPDATE alerts
            SET
                severity = $2,
                title = $3,
                message = $4,
                metric_value = $5,
                baseline_value = $6,
                threshold_value = $7,
                evidence = $8,
                run_id = COALESCE($9, run_id),
                last_seen_at = now(),
                status = CASE WHEN status = 'resolved' THEN 'open' ELSE status END
            WHERE id = $1
            `,
            [
                existing.rows[0].id,
                input.severity,
                input.title,
                input.message,
                input.metricValue ?? null,
                input.baselineValue ?? null,
                input.thresholdValue ?? null,
                JSON.stringify(input.evidence ?? {}),
                input.runId ?? null,
            ]
        );
        return;
    }

    await db.query(
        `
        INSERT INTO alerts (
            customer_id,
            brand_id,
            query_id,
            run_id,
            source_id,
            alert_type,
            severity,
            title,
            message,
            metric_value,
            baseline_value,
            threshold_value,
            dedupe_key,
            evidence,
            status,
            first_seen_at,
            last_seen_at
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, 'open', now(), now()
        )
        `,
        [
            input.customerId,
            input.brandId ?? null,
            input.queryId ?? null,
            input.runId ?? null,
            input.sourceId ?? null,
            input.alertType,
            input.severity,
            input.title,
            input.message,
            input.metricValue ?? null,
            input.baselineValue ?? null,
            input.thresholdValue ?? null,
            input.dedupeKey,
            JSON.stringify(input.evidence ?? {}),
        ]
    );
}

export async function generateSoVDropAlerts(input: { customerId: string }) {
    const visibilityDropRows = await db.query(
        `
        WITH latest_runs AS (
            SELECT
                r.query_id,
                r.source_id,
                r.id AS run_id,
                ROW_NUMBER() OVER (
                    PARTITION BY r.query_id, r.source_id
                    ORDER BY r.started_at DESC, r.id DESC
                ) AS rn
            FROM runs r
            JOIN queries q ON q.id = r.query_id
            WHERE q.customer_id = $1
              AND q.is_deleted = FALSE
        ),
        latest_runs_only AS (
            SELECT query_id, source_id, run_id
            FROM latest_runs
            WHERE rn = 1
        ),
        recent AS (
            SELECT
                q.id AS query_id,
                q.brand_id,
                r.source_id,
                lro.run_id AS latest_run_id,
                AVG(a.visibility_score) FILTER (
                    WHERE r.started_at >= now() - interval '1 day'
                ) AS current_visibility,
                AVG(a.visibility_score) FILTER (
                    WHERE r.started_at >= now() - interval '8 days'
                      AND r.started_at < now() - interval '1 day'
                ) AS baseline_visibility
            FROM queries q
            JOIN runs r ON r.query_id = q.id
            JOIN answers a ON a.run_id = r.id
            LEFT JOIN latest_runs_only lro
                ON lro.query_id = r.query_id
               AND lro.source_id = r.source_id
            WHERE q.customer_id = $1
              AND q.is_deleted = FALSE
            GROUP BY q.id, q.brand_id, r.source_id, lro.run_id
        )
        SELECT *
        FROM recent
        WHERE current_visibility IS NOT NULL
          AND baseline_visibility IS NOT NULL
          AND baseline_visibility - current_visibility >= 20
        `,
        [input.customerId]
    );

    for (const row of visibilityDropRows.rows) {
        await createOrRefreshAlert({
            customerId: input.customerId,
            brandId: row.brand_id,
            queryId: row.query_id,
            runId: row.latest_run_id,
            sourceId: row.source_id,
            alertType: "visibility_drop",
            severity: row.baseline_visibility - row.current_visibility >= 35 ? "high" : "medium",
            title: "Visibility dropped",
            message: `Visibility fell from ${Number(row.baseline_visibility).toFixed(1)} to ${Number(row.current_visibility).toFixed(1)} for this query/source pair.`,
            metricValue: Number(row.current_visibility),
            baselineValue: Number(row.baseline_visibility),
            thresholdValue: 20,
            dedupeKey: `visibility_drop:${row.query_id}:${row.source_id}`,
            evidence: {
                current_visibility: Number(row.current_visibility),
                baseline_visibility: Number(row.baseline_visibility),
            },
        });
    }

    const brandMissingRows = await db.query(
        `
        WITH latest_answers AS (
            SELECT DISTINCT ON (q.id, r.source_id)
                q.id AS query_id,
                q.brand_id,
                q.query_text,
                q.query_type,
                r.id AS run_id,
                r.source_id,
                a.mentions_brand,
                a.visibility_score,
                a.raw_text
            FROM queries q
            JOIN runs r ON r.query_id = q.id
            JOIN answers a ON a.run_id = r.id
            WHERE q.customer_id = $1
              AND q.is_deleted = FALSE
            ORDER BY q.id, r.source_id, r.started_at DESC
        )
        SELECT *
        FROM latest_answers
        WHERE query_type = 'brand'
          AND mentions_brand = FALSE
        `,
        [input.customerId]
    );

    for (const row of brandMissingRows.rows) {
        await createOrRefreshAlert({
            customerId: input.customerId,
            brandId: row.brand_id,
            queryId: row.query_id,
            runId: row.run_id,
            sourceId: row.source_id,
            alertType: "brand_missing",
            severity: "high",
            title: "Brand missing in branded query",
            message: `Your brand was not mentioned for branded query "${row.query_text}".`,
            metricValue: Number(row.visibility_score ?? 0),
            thresholdValue: 1,
            dedupeKey: `brand_missing:${row.query_id}:${row.source_id}`,
            evidence: {
                raw_text: row.raw_text,
                query_text: row.query_text,
            },
        });
    }

    const connectorFailureRows = await db.query(
        `
        SELECT
            q.id AS query_id,
            q.brand_id,
            r.id AS run_id,
            r.source_id,
            a.raw_text,
            r.error
        FROM runs r
        JOIN queries q ON q.id = r.query_id
        LEFT JOIN answers a ON a.run_id = r.id
        WHERE q.customer_id = $1
          AND r.started_at >= now() - interval '1 day'
          AND (
              r.status = 'failed'
              OR COALESCE(a.raw_text, '') ILIKE 'Gemini API error:%'
              OR COALESCE(a.raw_text, '') ILIKE '%quota exceeded%'
              OR COALESCE(a.raw_text, '') ILIKE '%resource_exhausted%'
          )
        `,
        [input.customerId]
    );

    for (const row of connectorFailureRows.rows) {
        await createOrRefreshAlert({
            customerId: input.customerId,
            brandId: row.brand_id,
            queryId: row.query_id,
            runId: row.run_id,
            sourceId: row.source_id,
            alertType: "connector_failure",
            severity: "high",
            title: "Connector or quota failure",
            message: "A recent answer fetch failed due to API or quota limits.",
            dedupeKey: `connector_failure:${row.query_id}:${row.source_id}`,
            evidence: {
                raw_text: row.raw_text,
                run_error: row.error,
            },
        });
    }
}
