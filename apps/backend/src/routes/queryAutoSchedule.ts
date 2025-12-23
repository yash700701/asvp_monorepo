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

    const { frequency } = queryRes.rows[0];
    const cron = frequencyToCron(frequency);

    if (!cron) {
        return res.status(400).json({
        error: "Query frequency is manual; cannot auto-schedule"
        });
    }

    const temporal = await getTemporalClient();
    const workflowId = `cron-query-${queryId}-chatgpt`;

    // Start cron workflow
    await temporal.workflow.start("querySchedulerWorkflow", {
        taskQueue: "asvp-query-scheduler",
        workflowId,
        cronSchedule: cron,
        args: [
        {
            queryId,
            sourceId: "3fcad857-3004-4a73-8f7f-0690813891a2", // chatgpt source ID
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
        [queryId, "3fcad857-3004-4a73-8f7f-0690813891a2", workflowId]
    );

    res.json({
        message: "Query scheduled",
        workflowId,
        cron
    });
});

export default router;
