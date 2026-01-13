import { Router } from "express";
import { db } from "../db/client";
import { getTemporalClient } from "../lib/temporalClient";

const router = Router();

/**
 * POST /queries/:id/schedule
 * Manually trigger a Temporal workflow for a query
 */
router.post("/:id/schedule", async (req, res) => {
    const { id: queryId } = req.params;

    // Verify query exists
    const queryResult = await db.query(
        `
        SELECT id
        FROM queries
        WHERE id = $1 AND customer_id = $2
        `,
        [queryId, req.user!.customer_id]
    );

    if (queryResult.rows.length === 0) {
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

    // Start Temporal workflow
    const temporal = await getTemporalClient();

    const handle = await temporal.workflow.start(
        "querySchedulerWorkflow",
        {
        taskQueue: "asvp-query-scheduler",
        workflowId: `query-${queryId}-${Date.now()}`,
        args: [
            {
            queryId,
            sourceId
            }
        ]
        }
    );

    res.json({
        message: "Workflow started",
        workflowId: handle.workflowId,
        runId: handle.firstExecutionRunId
    });
});

export default router;
