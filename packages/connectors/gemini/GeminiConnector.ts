import {
    AISourceConnector,
    ConnectorExecuteInput,
    ConnectorExecuteOutput
} from "../types";

import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

export class GeminiConnector implements AISourceConnector {
    source = "gemini" as const;

    async execute(
        input: ConnectorExecuteInput
    ): Promise<ConnectorExecuteOutput> {
        const start = Date.now();

        const useApi = process.env.ENABLE_GEMINI_API === "true";
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl =
            process.env.GEMINI_API_URL;

        if (useApi && apiKey && apiUrl) {
            const text = await this.callGemini(apiUrl, apiKey, input.query);

            return {
                source: this.source,
                raw: {
                    text
                },
                metadata: {
                    appeared: true,
                    position: 1,
                    container: "gemini_api",
                    model: "gemini",
                    latencyMs: Date.now() - start
                },
                debug: {
                    fetchedAt: new Date().toISOString(),
                    executionType: "api",
                    version: "gemini_api_v1"
                }
            };
        }

        return {
            source: this.source,
            raw: {
                text: "Gemini API not configured"
            },
            metadata: {
                appeared: false,
                position: 0,
                container: "gemini_disabled",
                model: "gemini",
                latencyMs: Date.now() - start
            },
            debug: {
                fetchedAt: new Date().toISOString(),
                executionType: "api",
                version: "gemini_api_v1"
            }
        };
    }

    private async callGemini(
        apiUrl: string,
        apiKey: string,
        query: string
    ): Promise<string> {
        const url = apiUrl.includes("?")
            ? `${apiUrl}&key=${apiKey}`
            : `${apiUrl}?key=${apiKey}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }],
                generationConfig: {
                    temperature: 0.2
                }
            })
        });

        if (!res.ok) {
            const body = await res.text();
            return `Gemini API error: ${res.status} ${body}`;
        }

        const data = await res.json();
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            data?.candidates?.[0]?.content?.text;

        return String(text || "Gemini API returned no text");
    }
}
