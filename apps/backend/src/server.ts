import { createApp } from "./api/app";
import { config } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

app.listen(config.port, () => {
    logger.info(`ASVP backend running on port ${config.port}`);
});
