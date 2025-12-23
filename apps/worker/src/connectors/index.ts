import { ChatGPTMockConnector } from "./chatgpt.mock";
import { PerplexityMockConnector } from "./perplexity.mock";
import { GoogleAioMockConnector } from "./googleAio.mock";
import { SourceConnector } from "./types";

export function getConnectorBySourceType(type: string): SourceConnector {
    switch (type) {
        case "chatgpt":
        return ChatGPTMockConnector;
        case "perplexity":
        return PerplexityMockConnector;
        case "google_aio":
        return GoogleAioMockConnector;
        default:
        throw new Error(`Unknown source type: ${type}`);
    }
}
