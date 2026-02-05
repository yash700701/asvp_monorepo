import { db } from "../db/client";
import { ruleBasedParser } from "../parser/ruleBasedParser";

export async function parseAnswer(input: {
    runId: string;
}) {
    try {
        // Get raw answer + brand names
        // Query -> For a given run, get the AI answer text and all brand names belonging to the same customer.
        const res = await db.query(
            `
            SELECT 
            a.id AS answer_id,
            a.raw_text,
            b.brand_name
            FROM answers a
            JOIN runs r ON r.id = a.run_id
            JOIN queries q ON q.id = r.query_id
            JOIN brands b ON b.customer_id = q.customer_id
            WHERE r.id = $1
            `,
            [input.runId]
        );

        if (res.rows.length === 0) {
            await db.query(
                `
                UPDATE runs
                SET status = 'failed', error = 'answer_not_found', finished_at = now()
                WHERE id = $1
                `,
                [input.runId]
            );
            return;
        }

        const rawText = res.rows[0].raw_text;
        const brandNames = res.rows.map((r) => r.brand_name);

        // Parse
        const parsed = ruleBasedParser({
            raw_text: rawText,
            brandNames
        });

        // Store structured fields
        await db.query(
            `
            UPDATE answers
            SET 
            main_snippet = $1,
            mentions_brand = $2,
            confidence = $3,
            sentiment = $4,
            prominence = $5,
            entities = $6,
            parsed_at = now()
            WHERE id = $7
            `,
            [
                parsed.main_snippet,
                parsed.mentions_brand,
                parsed.confidence,
                parsed.sentiment,
                parsed.prominence,
                JSON.stringify(parsed.entities),
                res.rows[0].answer_id
            ]
        );

        await db.query(
            `
            UPDATE runs
            SET status = 'completed', finished_at = now()
            WHERE id = $1
            `,
            [input.runId]
        );
    } catch (err: any) {
        await db.query(
            `
            UPDATE runs
            SET status = 'failed', error = $2, finished_at = now()
            WHERE id = $1
            `,
            [input.runId, err?.message || "parse_failed"]
        );
        throw err;
    }
}
