import { GoogleGenAI } from "@google/genai";
import { LLMProvider, RecommendInput, RecommendOutput } from "./types";
import { estimateTokens } from "../utils/tokens";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY not set");

const ai = new GoogleGenAI({});
const INPUT_COST_PER_1K_TOKENS = 0.00030; //  in $
const OUTPUT_COST_PER_1K_TOKENS = 0.00250; 

export class GeminiProvider implements LLMProvider {
    async recommend(input: RecommendInput): Promise<RecommendOutput> {
        const prompt = `
        You are an expert in AI search visibility.

        Context:
        Brand: ${input.brand}
        Query: ${input.query}
        Source: ${input.source}

        Signals:
        ${JSON.stringify(input.signals, null, 2)}

        Evidence:
        ${JSON.stringify(input.evidence || {}, null, 2)}

        Task:
        Give ONE clear, actionable recommendation to improve the brand's visibility in AI answers.
        Be concrete. Avoid fluff.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
            }
        });
        
        const promptTokens = estimateTokens(prompt);
        const text = response.text ?? "";
        const outputTokens = estimateTokens(text);
        
        const totalTokens = promptTokens + outputTokens;
        const estimatedInputCost = (promptTokens / 1000) * INPUT_COST_PER_1K_TOKENS;
        const estimatedOutputCost = (outputTokens / 1000) * OUTPUT_COST_PER_1K_TOKENS;

        const totalEstimatedCost = estimatedInputCost + estimatedOutputCost;

        console.log("[LLM_USAGE]", {
            provider: "gemini",
            totalTokens,
            estimatedCost: totalEstimatedCost
        });


        return {
            recommendation: text.trim(),
            confidence: 0.8
        };
    }
}
