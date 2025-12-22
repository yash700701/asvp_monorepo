import { Worker } from "@temporalio/worker";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function run() {
    const worker = await Worker.create({
        workflowsPath: path.join(__dirname, "workflows"),
        activities: require("./activities"),
        taskQueue: "asvp-query-scheduler"
    });

    console.log("Temporal worker started");
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
