import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/createRun";
import type * as answerActivities from "../activities/fetchAndStoreAnswer";
import type * as parseAnswerActivities from "../activities/parseAnswer";
import { defineSignal, setHandler } from "@temporalio/workflow";

export const pauseSignal = defineSignal("pause");
export const resumeSignal = defineSignal("resume");

const { createRun } = proxyActivities<typeof activities>({
    startToCloseTimeout: "3 minutes"
});

const { fetchAndStoreAnswer } = proxyActivities<typeof answerActivities>({
    startToCloseTimeout: "3 minutes",
});

const { parseAnswer } = proxyActivities<typeof parseAnswerActivities>({
    startToCloseTimeout: "3 minutes",
});

export async function querySchedulerWorkflow(input: {
    queryId: string;
    sourceId: string;
    customer_id: string;
}) {
    let paused = false;

    setHandler(pauseSignal, () => {
        paused = true;
    });

    setHandler(resumeSignal, () => {
        paused = false;
    });

    // Cron will re-enter here on each tick
    if (paused) {
        return;
    }
    const { runId } = await createRun(input);
    await fetchAndStoreAnswer(input);
    await parseAnswer({ runId });
}
