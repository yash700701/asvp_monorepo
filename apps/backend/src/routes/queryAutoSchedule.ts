import { Router } from "express";
import { db } from "../db/client";
import { getTemporalClient } from "../lib/temporalClient";
import { frequencyToCron } from "../lib/cron";
import { requireAuth } from "../middleware/requireAuth";
import { WorkflowExecutionAlreadyStartedError } from "@temporalio/client";

const router = Router();

/**
 * POST /queries/:id/auto-schedule
 */
router.post("/:id/auto-schedule", requireAuth, async (req, res) => {
  const { id: queryId } = req.params;

  // Fetch query & ownership check
  const queryRes = await db.query(
    `
    SELECT id, frequency, is_active
    FROM queries
    WHERE id = $1 AND customer_id = $2
    `,
    [queryId, req.user!.customer_id]
  );

  if (queryRes.rows.length === 0) {
    return res.status(404).json({ error: "Query not found" });
  }

  const query = queryRes.rows[0];

  if (query.is_active) {
    return res.status(400).json({ error: "Query already scheduled" });
  }

  // Validate frequency
  const cron = frequencyToCron(query.frequency);
  if (!cron) {
    return res.status(400).json({
      error: "Query frequency is manual; cannot auto-schedule",
    });
  }

  // Fetch ChatGPT source
  const sourceRes = await db.query(`SELECT id FROM sources WHERE type = 'chatgpt'`);

  if (sourceRes.rows.length === 0) {
    return res.status(500).json({ error: "ChatGPT source not found" });
  }

  const sourceId = sourceRes.rows[0].id;

  const workflowId = `cron-query-${queryId}-${sourceId}`;
  const temporal = await getTemporalClient();

  // Start Temporal cron workflow (idempotent)
  try {
    await temporal.workflow.start("querySchedulerWorkflow", {
      taskQueue: "asvp-query-scheduler",
      workflowId,
      cronSchedule: cron,
      workflowExecutionTimeout: "365 days",
      args: [{ queryId, sourceId }],
    });
  } catch (err: any) {
    if (err instanceof WorkflowExecutionAlreadyStartedError) {
      return res.status(409).json({
        error: "Query is already scheduled in Temporal",
      });
    }
    throw err;
  }

  // Persist DB state atomically
  await db.query("BEGIN");

  try {
    const scheduleRes = await db.query(
      `
      INSERT INTO query_schedules (query_id, source_id, workflow_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (query_id, source_id)
      DO UPDATE SET workflow_id = EXCLUDED.workflow_id
      RETURNING id
      `,
      [queryId, sourceId, workflowId]
    );

    const scheduleId = scheduleRes.rows[0].id;

    await db.query(
      `
      UPDATE queries
      SET is_active = true,
          schedule_id = $1
      WHERE id = $2
      `,
      [scheduleId, queryId]
    );

    await db.query("COMMIT");

    return res.json({
      message: "Query scheduled successfully",
      workflowId,
      cron,
      schedule_id: scheduleId,
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Failed to persist schedule:", err);
    return res.status(500).json({ error: "Failed to persist schedule" });
  }
});

export default router;
