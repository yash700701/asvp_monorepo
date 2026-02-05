import {
    AISourceConnector,
    ConnectorExecuteInput,
    ConnectorExecuteOutput
} from "../types";

export class GeminiConnector implements AISourceConnector {
    source = "gemini" as const;

    async execute(
        input: ConnectorExecuteInput
    ): Promise<ConnectorExecuteOutput> {
        const start = Date.now();

        const useApi = process.env.ENABLE_GEMINI_API === "true";
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = process.env.GEMINI_API_URL;

        if (useApi && apiKey && apiUrl) {
            try {
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
            } catch {
                // Fall through to mock if API fails
            }
        }

        const mockText = this.buildMockAnswer(input.query);

        return {
            source: this.source,
            raw: {
                text: mockText
            },
            metadata: {
                appeared: true,
                position: 1,
                container: "gemini_mock",
                model: "gemini-mock",
                latencyMs: Date.now() - start
            },
            debug: {
                fetchedAt: new Date().toISOString(),
                executionType: "api",
                version: "gemini_mock_v1"
            }
        };
    }

    private buildMockAnswer(query: string): string {
        return `Mock Gemini answer for: "${query}". This is a zero-cost connector response for testing.`;
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
            throw new Error(`Gemini API error: ${res.status}`);
        }

        const data = await res.json();
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            data?.candidates?.[0]?.content?.text;

        if (!text) {
            throw new Error("Gemini API returned no text");
        }

        return String(text);
    }
}
