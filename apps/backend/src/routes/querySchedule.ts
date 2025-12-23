import { Router } from "express";
import { db } from "../db/client";
import { getTemporalClient } from "../lib/temporalClient";
import { DEFAULT_CUSTOMER_ID } from "../config/customer";

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
        [queryId, DEFAULT_CUSTOMER_ID]
    );

    if (queryResult.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

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
            sourceId: "3fcad857-3004-4a73-8f7f-0690813891a2" // chatgpt source ID
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
