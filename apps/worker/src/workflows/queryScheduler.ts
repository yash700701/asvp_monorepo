import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/createRun";
import type * as answerActivities from "../activities/fetchAndStoreAnswer";

const { createRun } = proxyActivities<typeof activities>({
    startToCloseTimeout: "2 minutes"
});

const { fetchAndStoreAnswer } = proxyActivities<typeof answerActivities>({
    startToCloseTimeout: "2 minutes",
});

export async function querySchedulerWorkflow(input: {
    queryId: string;
    sourceId: string;
}) {
    await createRun(input);
    await fetchAndStoreAnswer(input);
}
