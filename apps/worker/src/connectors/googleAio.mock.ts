import { SourceConnector } from "./types";

export const GoogleAioMockConnector: SourceConnector = {
    async fetch({ queryText }) {
        return {
        raw_text: `Mock Google AI Overview summary for: "${queryText}"`,
        metadata: {
            source: "google_aio",
            serp_position: 0
        }
        };
    }
};
