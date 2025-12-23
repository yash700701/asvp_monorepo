import { SourceConnector } from "./types";

export const PerplexityMockConnector: SourceConnector = {
    async fetch({ queryText }) {
        return {
        raw_text: `Mock Perplexity answer citing multiple sources for: "${queryText}"`,
        metadata: {
            source: "perplexity",
            citations: ["example.com", "docs.example.com"]
        }
        };
    }
};
