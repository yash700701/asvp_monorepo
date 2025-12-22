import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/createRun";

const { createRun } = proxyActivities<typeof activities>({
    startToCloseTimeout: "1 minute"
});

export async function querySchedulerWorkflow(input: {
    queryId: string;
    sourceId: string;
}) {
    await createRun(input);
}
