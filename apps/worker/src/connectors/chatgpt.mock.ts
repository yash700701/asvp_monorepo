import { SourceConnector } from "./types";

export const ChatGPTMockConnector: SourceConnector = {
    async fetch({ queryText }) {
        return {
        raw_text: `Mock ChatGPT answer for: "${queryText}"`,
        metadata: {
            model: "gpt-4o-mock",
            source: "chatgpt"
        }
        };
    }
};
