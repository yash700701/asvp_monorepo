import { Router } from "express";
import { db } from "../db/client";
import { getTemporalClient } from "../lib/temporalClient";
import { frequencyToCron } from "../lib/cron";
import { DEFAULT_CUSTOMER_ID } from "../config/customer";

const router = Router();

/**
 * POST /queries/:id/auto-schedule
 */
router.post("/:id/auto-schedule", async (req, res) => {
    const { id: queryId } = req.params;

    // Fetch query
    const queryRes = await db.query(
        `
        SELECT id, frequency
        FROM queries
        WHERE id = $1 AND customer_id = $2
        `,
        [queryId, DEFAULT_CUSTOMER_ID]
    );

    if (queryRes.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    // fetch ChatGPT source
    const sourceRes = await db.query(
        `SELECT id FROM sources WHERE type = 'chatgpt'`
    );

    if (sourceRes.rows.length === 0) {
        return res.status(500).json({ error: "ChatGPT source not found" });
    }

    const sourceId = sourceRes.rows[0].id;

    const { frequency } = queryRes.rows[0];
    const cron = frequencyToCron(frequency);

    if (!cron) {
        return res.status(400).json({
        error: "Query frequency is manual; cannot auto-schedule"
        });
    }

    const temporal = await getTemporalClient();
    const workflowId = `cron-query-${queryId}-${sourceId}`;

    // Start cron workflow
    await temporal.workflow.start("querySchedulerWorkflow", {
        taskQueue: "asvp-query-scheduler",
        workflowId,
        cronSchedule: cron,
        args: [
        {
            queryId,
            sourceId
        }
        ]
    });

    // Persist schedule metadata
    await db.query(
        `
        INSERT INTO query_schedules (query_id, source_id, workflow_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (query_id, source_id) DO NOTHING
        `,
        [queryId, sourceId, workflowId]
    );

    res.json({
        message: "Query scheduled",
        workflowId,
        cron
    });
});

export default router;
