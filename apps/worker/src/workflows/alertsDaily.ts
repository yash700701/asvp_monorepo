import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/generateAlerts";

const { generateSoVDropAlerts } = proxyActivities<typeof activities>({
    startToCloseTimeout: "5 minutes"
});

export async function alertsDailyWorkflow(input: {
    customerId: string;
}) {
    await generateSoVDropAlerts(input);
}
