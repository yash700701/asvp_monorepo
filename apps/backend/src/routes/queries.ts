import { Router } from "express";
import { db } from "../db/client";
import { requireAuth } from "../middleware/requireAuth";
import { getTemporalClient } from "../lib/temporalClient";
import { frequencyToCron } from "../lib/cron";
import { WorkflowExecutionAlreadyStartedError } from "@temporalio/client";

const router = Router();

/**
 * POST /queries
 * body: {
 *   query_text: string,
 *   query_type: "brand" | "category" | "competitor",
 *   frequency?: "daily" | "weekly" | "manual"
 * }
 */
router.post("/", requireAuth, async (req, res) => {
    const { brand_id, query_text, query_type, frequency = "daily" } = req.body;

    if (!brand_id || !query_text || !query_type) {
        return res.status(400).json({ error: "brand_id, query_text and query_type are required" });
    }

    if (!["brand", "category", "competitor"].includes(query_type)) {
        return res.status(400).json({ error: "Invalid query_type" });
    }

    if (!["daily", "weekly", "manual"].includes(frequency)) {
        return res.status(400).json({ error: "Invalid frequency" });
    }

    try {
        const result = await db.query(
            `
        INSERT INTO queries (
            customer_id,
            brand_id,
            query_text,
            query_type,
            frequency
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
            [req.user!.customer_id, brand_id, query_text, query_type, frequency]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /queries?brand_id=
 */
router.get("/", requireAuth, async (req, res) => {
    const { brand_id } = req.query;

    try {
        let result;

        if (brand_id) {
            // Fetch queries for a specific brand
            result = await db.query(
                `
            SELECT id, query_text, frequency, brand_id, query_type, created_at, is_active, is_paused
            FROM queries
            WHERE brand_id = $1
            AND customer_id = $2
            ORDER BY created_at DESC
            `,
                [brand_id, req.user!.customer_id]
            );
        } else {
            // Fetch all queries for the customer
            result = await db.query(
                `
            SELECT id, query_text, frequency, brand_id, query_type, created_at, is_active, is_paused
            FROM queries
            WHERE customer_id = $1
            ORDER BY created_at DESC
            `,
                [req.user!.customer_id]
            );
        }

        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch queries:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /queries/:id
 */
router.get("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        SELECT *
        FROM queries
        WHERE id = $1 AND customer_id = $2
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    res.json(result.rows[0]);
});

/**
 * DELETE /queries/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        DELETE FROM queries
        WHERE id = $1 AND customer_id = $2
        RETURNING id
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    res.json({ deleted: true });
});

/**
 * POST /queries/:id/schedule
 * Manually trigger a Temporal workflow for a query
 */
router.post("/:id/manual-run", requireAuth, async (req, res) => {

    const usageRes = await db.query(
        `
        SELECT COUNT(*)::int AS count
        FROM runs
        WHERE customer_id = $1
        AND started_at >= date_trunc('month', now()) 
        `,
        [req.user!.customer_id]
    );

    const usage = usageRes.rows[0].count;

    const customerRes = await db.query(
        `
        SELECT run_limit
        FROM customers
        WHERE id = $1
        `,
        [req.user!.customer_id]
    );

    const limit = customerRes.rows[0].run_limit;

    if (usage >= limit) {
        return res.status(403).json({
            error: "run_limit_exceeded",
            limit,
            used: usage
        });
    }

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
    const sourceRes = await db.query(`SELECT id FROM sources WHERE type = 'chatgpt'`);

    if (sourceRes.rows.length === 0) {
        return res.status(500).json({ error: "ChatGPT source not found" });
    }

    const sourceId = sourceRes.rows[0].id;

    // Start Temporal workflow
    const temporal = await getTemporalClient();

    const handle = await temporal.workflow.start("querySchedulerWorkflow", {
        taskQueue: "asvp-query-scheduler",
        workflowId: `query-${queryId}-${Date.now()}`,
        args: [
            {
                queryId,
                sourceId,
                customer_id: req.user!.customer_id,
            },
        ],
    });

    res.json({
        message: "Workflow started",
        workflowId: handle.workflowId,
        runId: handle.firstExecutionRunId,
    });
});

/**
 * POST /queries/:id/auto-schedule
 */
router.post("/:id/auto-schedule", requireAuth, async (req, res) => {

    const usageRes = await db.query(
        `
        SELECT COUNT(*)::int AS count
        FROM runs
        WHERE customer_id = $1
        AND started_at >= date_trunc('month', now()) 
        `,
        [req.user!.customer_id]
    );

    const usage = usageRes.rows[0].count;

    const customerRes = await db.query(
        `
        SELECT run_limit
        FROM customers
        WHERE id = $1
        `,
        [req.user!.customer_id]
    );

    const limit = customerRes.rows[0].run_limit;

    if (usage >= limit) {
        return res.status(403).json({
            error: "run_limit_exceeded",
            limit,
            used: usage
        });
    }

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
            args: [{ queryId, sourceId, customer_id: req.user!.customer_id }],
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

/**
 * POST /queries/:id/unschedule
 * Stop cron execution of a query
 */
router.post("/:id/unschedule", requireAuth, async (req, res) => {
    const queryId = req.params.id;

    // Fetch query + schedule (LEFT JOIN is critical)
    const result = await db.query(
        `
        SELECT
        q.id,
        q.is_active,
        q.schedule_id,
        qs.workflow_id
        FROM queries q
        JOIN query_schedules qs
        ON qs.id = q.schedule_id
        WHERE q.id = $1::uuid
        AND q.customer_id = $2::uuid
        `,
        [queryId, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    const query = result.rows[0];

    if (!query.is_active || !query.workflow_id) {
        return res.status(400).json({ error: "Query is not scheduled" });
    }

    const { workflow_id, schedule_id } = result.rows[0];

    // TERMINATE Temporal workflow
    try {
        const temporal = await getTemporalClient();
        const handle = temporal.workflow.getHandle(workflow_id);
        await handle.terminate("Query unscheduled by user");
    } catch (err: any) {
        if (!err.message?.includes("NOT_FOUND")) {
            console.error("Temporal terminate failed:", err);
            return res.status(500).json({ error: "Failed to stop workflow" });
        }
    }

    // Update DB (queries)
    await db.query(
        `
        UPDATE queries
        SET
        is_active = false,
        is_paused = false,
        schedule_id = NULL
        WHERE id = $1::uuid
        `,
        [queryId]
    );

    // Delete schedule row 
    await db.query(
        `
    DELETE FROM query_schedules
    WHERE workflow_id = $1
    `,
        [query.workflow_id]
    );

    res.json({ message: "Query unscheduled successfully" });
});

// POST /queries/:id/pause
router.post("/:id/pause", requireAuth, async (req, res) => {
    const { id: queryId } = req.params;

    const result = await db.query(
        `
        SELECT qs.workflow_id, q.is_active, q.schedule_id
        FROM queries q
        JOIN query_schedules qs ON qs.id = q.schedule_id
        WHERE q.id = $1::uuid
        AND q.customer_id = $2::uuid
        AND q.is_active = true
        `,
        [queryId, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    const query = result.rows[0];
    if (!query.is_active || !query.schedule_id) {
        return res.status(400).json({ error: "Query is not scheduled" });
    }

    const { workflow_id } = result.rows[0];

    try {
        const temporal = await getTemporalClient();
        const handle = temporal.workflow.getHandle(workflow_id);

        await handle.signal("pause");
    } catch (err: any) {
        console.error("Failed to pause schedule:", err);
        return res.status(500).json({ error: "Failed to pause schedule" });
    }

    // Update DB
    await db.query(
        `
        UPDATE queries
        SET is_paused = true
        WHERE id = $1
        `,
        [queryId]
    );

    res.json({
        message: "Query schedule paused",
    });
});

/**
 * POST /queries/:id/resume
 */
router.post("/:id/resume", requireAuth, async (req, res) => {
    const { id: queryId } = req.params;

    const result = await db.query(
        `
        SELECT qs.workflow_id, q.is_active, q.schedule_id
        FROM queries q
        JOIN query_schedules qs ON qs.id = q.schedule_id
        WHERE q.id = $1::uuid
        AND q.customer_id = $2::uuid
        AND q.is_active = true
        `,
        [queryId, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    const query = result.rows[0];

    if (!query.is_active || !query.schedule_id) {
        return res.status(400).json({ error: "Query is not scheduled" });
    }

    const { workflow_id } = result.rows[0];

    try {
        const temporal = await getTemporalClient();
        const handle = temporal.workflow.getHandle(workflow_id);

        await handle.signal("resume");
    } catch (err: any) {
        console.error("Failed to resume schedule:", err);
        return res.status(500).json({ error: "Failed to resume schedule" });
    }

    // Update DB
    await db.query(
        `
        UPDATE queries
        SET is_paused = false
        WHERE id = $1
        `,
        [queryId]
    );

    res.json({
        message: "Query schedule resumed",
    });
});


export default router;
