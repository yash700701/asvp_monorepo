import { db } from "../db/client";

export async function createRun(input: {
    queryId: string;
    sourceId: string;
    customer_id: string;
}) {
    const { queryId, sourceId, customer_id } = input;

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
        [queryId, sourceId, customer_id]
    );

    return { runId: result.rows[0].id };
}
