import { db } from "../db/client";
import { getConnectorBySourceType } from "../connectors";

export async function fetchAndStoreAnswer(input: {
    queryId: string;
    sourceId: string;
}) {
  // Get query text
    const queryRes = await db.query(
        `
        SELECT q.query_text, s.type AS source_type
        FROM queries q
        JOIN sources s ON s.id = $1
        WHERE q.id = $2
        `,
        [input.sourceId, input.queryId]
    );

    const row = queryRes.rows[0];
    if (!row) throw new Error("Query or source not found");

    // Get connector
    const connector = getConnectorBySourceType(row.source_type);

    // Fetch raw answer
    const result = await connector.fetch({
        queryText: row.query_text
    });

    // Get latest run
    const runRes = await db.query(
        `
        SELECT id
        FROM runs
        WHERE query_id = $1 AND source_id = $2
        ORDER BY started_at DESC
        LIMIT 1
        `,
        [input.queryId, input.sourceId]
    );

    const runId = runRes.rows[0]?.id;
    if (!runId) throw new Error("Run not found");

    // Store raw answer
    await db.query(
        `
        INSERT INTO answers (run_id, raw_text, metadata, screenshot_path)
        VALUES ($1, $2, $3, $4)
        `,
        [runId, result.raw_text, result.metadata, result.screenshot_path || null]
    );
}
