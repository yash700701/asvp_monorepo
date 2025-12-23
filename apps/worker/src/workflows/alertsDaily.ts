import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/generateAlerts";
import type * as activitiesRecommendations from "../activities/generateRecommendations";

const { generateSoVDropAlerts } = proxyActivities<typeof activities>({
    startToCloseTimeout: "5 minutes"
});

const { generateRecommendations } = proxyActivities<typeof activitiesRecommendations>({
    startToCloseTimeout: "10 minutes"
});

export async function alertsDailyWorkflow(input: {
    customerId: string;
}) {
    await generateSoVDropAlerts(input);
    await generateRecommendations(input);
}
