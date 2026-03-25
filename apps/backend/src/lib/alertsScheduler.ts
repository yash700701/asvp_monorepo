import path from "path";
import dotenv from "dotenv";
import { WorkflowExecutionAlreadyStartedError } from "@temporalio/client";
import { db } from "../db/client";
import { getTemporalClient } from "./temporalClient";
import { logger } from "./logger";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const ALERTS_CRON_SCHEDULE = process.env.ALERTS_CRON_SCHEDULE || "30 3 * * *";
const ALERTS_TASK_QUEUE = "asvp-query-scheduler";

export async function ensureCustomerAlertsSchedule(customerId: string) {
    const temporal = await getTemporalClient();
    const workflowId = `alerts-daily-${customerId}`;

    try {
        await temporal.workflow.start("alertsDailyWorkflow", {
            taskQueue: ALERTS_TASK_QUEUE,
            workflowId,
            cronSchedule: ALERTS_CRON_SCHEDULE,
            workflowExecutionTimeout: "365 days",
            args: [{ customerId }],
        });
        logger.info(
            { customerId, workflowId, cronSchedule: ALERTS_CRON_SCHEDULE },
            "Scheduled daily alerts workflow"
        );
    } catch (err: any) {
        if (err instanceof WorkflowExecutionAlreadyStartedError) {
            logger.debug({ customerId, workflowId }, "Daily alerts workflow already scheduled");
            return;
        }
        throw err;
    }
}

export async function ensureAllAlertsSchedules() {
    const customersRes = await db.query(
        `
        SELECT id
        FROM customers
        `
    );

    for (const row of customersRes.rows) {
        await ensureCustomerAlertsSchedule(row.id);
    }
}
