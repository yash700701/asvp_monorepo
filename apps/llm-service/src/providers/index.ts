import { GeminiProvider } from "./gemini";
import { LLMProvider } from "./types";

export function getProvider(): LLMProvider {
    const provider = process.env.LLM_PROVIDER || "gemini";

    switch (provider) {
        case "gemini":
        return new GeminiProvider();
        default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
}
