import { ChatGPTMockConnector } from "./chatgpt.mock";
import { PerplexityMockConnector } from "./perplexity.mock";
import { GoogleAioMockConnector } from "./googleAio.mock";
import { SourceConnector } from "./types";
import { CONNECTOR_REGISTRY } from "../../../../packages/connectors/registry";
import type { AISourceConnector } from "../../../../packages/connectors/types";

function adaptPackageConnector(
    connector: AISourceConnector
): SourceConnector {
    return {
        async fetch({ queryText, queryType, runId, locale }) {
            const result = await connector.execute({
                runId,
                query: queryText,
                queryType,
                locale
            });

            return {
                raw_text: result.raw.text,
                metadata: {
                    ...result.metadata,
                    debug: result.debug
                },
                screenshot_path: result.raw.screenshotUrl,
                html_path: result.raw.htmlPath
            };
        }
    };
}

export function getConnectorBySourceType(type: string): SourceConnector {
    const registryConnector = (CONNECTOR_REGISTRY as Record<string, AISourceConnector | undefined>)[type];
    if (registryConnector) {
        return adaptPackageConnector(registryConnector);
    }

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
