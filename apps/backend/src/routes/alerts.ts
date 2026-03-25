import { Router } from "express";
import { db } from "../db/client";
import { requireAuth } from "../middleware/requireAuth";
import { getTemporalClient } from "../lib/temporalClient";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    const { status, severity, type, brand_id } = req.query;

    const values: unknown[] = [req.user!.customer_id];
    const filters: string[] = ["a.customer_id = $1"];

    if (status && typeof status === "string") {
        values.push(status);
        filters.push(`a.status = $${values.length}`);
    }

    if (severity && typeof severity === "string") {
        values.push(severity);
        filters.push(`a.severity = $${values.length}`);
    }

    if (type && typeof type === "string") {
        values.push(type);
        filters.push(`a.alert_type = $${values.length}`);
    }

    if (brand_id && typeof brand_id === "string") {
        values.push(brand_id);
        filters.push(`a.brand_id = $${values.length}`);
    }

    const result = await db.query(
        `
        SELECT
            a.*,
            b.brand_name,
            q.query_text,
            s.type AS source_type
        FROM alerts a
        LEFT JOIN brands b ON b.id = a.brand_id
        LEFT JOIN queries q ON q.id = a.query_id
        LEFT JOIN sources s ON s.id = a.source_id
        WHERE ${filters.join(" AND ")}
        ORDER BY a.last_seen_at DESC, a.created_at DESC
        `,
        values
    );

    res.json({ success: true, data: result.rows });
});

router.post("/run", requireAuth, async (req, res) => {
    const temporal = await getTemporalClient();
    const handle = await temporal.workflow.start("alertsDailyWorkflow", {
        taskQueue: "asvp-query-scheduler",
        workflowId: `alerts-${req.user!.customer_id}-${Date.now()}`,
        args: [{ customerId: req.user!.customer_id }],
    });

    res.json({
        success: true,
        workflowId: handle.workflowId,
        runId: handle.firstExecutionRunId,
    });
});

router.post("/:id/ack", requireAuth, async (req, res) => {
    const { id } = req.params;

    await db.query(
        `
        UPDATE alerts
        SET
            acknowledged_at = now(),
            status = 'acknowledged',
            last_seen_at = now()
        WHERE id = $1
          AND customer_id = $2
        `,
        [id, req.user!.customer_id]
    );

    res.json({ message: "Alert acknowledged" });
});

router.post("/:id/resolve", requireAuth, async (req, res) => {
    const { id } = req.params;

    await db.query(
        `
        UPDATE alerts
        SET
            status = 'resolved',
            resolved_at = now(),
            last_seen_at = now()
        WHERE id = $1
          AND customer_id = $2
        `,
        [id, req.user!.customer_id]
    );

    res.json({ message: "Alert resolved" });
});

export default router;
