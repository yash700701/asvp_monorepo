import { db } from "../db/client";

export async function createRun(input: {
    queryId: string;
    sourceId: string;
    customer_id?: string;
}) {
    const { queryId, sourceId } = input;
    let customerId = input.customer_id;

    // Guard: deleted/missing queries must never create runs
    const queryRes = await db.query(
        `
        SELECT customer_id
        FROM queries
        WHERE id = $1
        AND is_deleted = FALSE
        LIMIT 1
        `,
        [queryId]
    );

    if (queryRes.rows.length === 0) {
        throw new Error("Query not found or deleted");
    }

    if (!customerId) {
        customerId = queryRes.rows[0].customer_id;
    }

    const result = await db.query(
        `
        INSERT INTO runs (
        query_id,
        source_id,
        customer_id,
        started_at,
        status
        )
        VALUES ($1, $2, $3, now(), 'scheduled')
        RETURNING id
        `,
        [queryId, sourceId, customerId]
    );

    return { runId: result.rows[0].id };
}
