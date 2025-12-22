import { db } from "../db/client";

export async function createRun(input: {
    queryId: string;
    sourceId: string;
}) {
    const { queryId, sourceId } = input;

    const result = await db.query(
        `
        INSERT INTO runs (
        query_id,
        source_id,
        started_at,
        status
        )
        VALUES ($1, $2, now(), 'scheduled')
        RETURNING id
        `,
        [queryId, sourceId]
    );

    return { runId: result.rows[0].id };
}
