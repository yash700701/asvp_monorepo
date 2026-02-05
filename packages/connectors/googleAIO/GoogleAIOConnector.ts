import {
    AISourceConnector,
    ConnectorExecuteInput,
    ConnectorExecuteOutput
} from "../types";
import { runBrowserTask } from "../../browser-engine/runBrowserTask";

export class GoogleAIOConnector implements AISourceConnector {
    source = "google_aio" as const;

    async execute(
        input: ConnectorExecuteInput
    ): Promise<ConnectorExecuteOutput> {
        const start = Date.now();

        const searchUrl = this.buildSearchUrl(input.query);

        const browserResult = await runBrowserTask({
            runId: input.runId,
            source: this.source,
            url: searchUrl,
            waitFor: {
                selector: "body",
                timeoutMs: 30000
            }
        });

        const { html } = browserResult;

        const detection = this.detectAIO(html);

        return {
            source: this.source,
            raw: {
                text: detection.text ?? "",
                html,
                // screenshotUrl: browserResult.screenshotUrl
            },
            metadata: {
                appeared: detection.appeared,
                position: detection.position,
                container: detection.container,
                latencyMs: Date.now() - start
            },
            debug: {
                fetchedAt: new Date().toISOString(),
                executionType: "browser",
                version: "google_aio_v1"
            }
        };
    }

    private buildSearchUrl(query: string): string {
        const q = encodeURIComponent(query);
        return `https://www.google.com/search?q=${q}&hl=en`;
    }

    /**
     * Heuristic-based AI Overview detection
     */
    private detectAIO(html: string): {
        appeared: boolean;
        text?: string;
        position?: number;
        container?: string;
    } {
        // Heuristic 1: Known AI Overview markers
        if (
            html.includes("AI Overview") ||
            html.includes("Generative AI")
        ) {
            const text = this.extractVisibleText(html);
            return {
                appeared: true,
                text,
                position: 1,
                container: "ai_overview_label"
            };
        }

        // Heuristic 2: data-attrid based containers
        if (html.includes("wa:/description")) {
            const text = this.extractVisibleText(html);
            return {
                appeared: true,
                text,
                position: 1,
                container: "data_attrid_wa_description"
            };
        }

        return {
            appeared: false
        };
    }

    /**
     * VERY naive extraction for v1
     * We improve this in later phases
     */
    private extractVisibleText(html: string): string {
        return html
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 3000);
    }
}
