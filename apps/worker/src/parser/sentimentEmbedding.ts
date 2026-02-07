import OpenAI from "openai";

import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

const MODEL = "text-embedding-3-small";

const SENTIMENT_ANCHORS = {
    positive: "This text expresses strong approval, trust, or recommendation.",
    neutral: "This text is factual, balanced, and unbiased.",
    negative: "This text expresses criticism, dissatisfaction, or problems."
};

let anchorEmbeddings: Record<
    keyof typeof SENTIMENT_ANCHORS,
    number[]
> | null = null;

async function embed(text: string): Promise<number[]> {
    const res = await client.embeddings.create({
        model: MODEL,
        input: text
    });
    return res.data[0].embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getAnchorEmbeddings() {
    if (anchorEmbeddings) return anchorEmbeddings;

    anchorEmbeddings = {
        positive: await embed(SENTIMENT_ANCHORS.positive),
        neutral: await embed(SENTIMENT_ANCHORS.neutral),
        negative: await embed(SENTIMENT_ANCHORS.negative)
    };

    return anchorEmbeddings;
}

export async function detectSentimentEmbedding(text: string): Promise<{
    label: "positive" | "neutral" | "negative";
    score: number;
    similarities: Record<string, number>;
}> {
    const anchors = await getAnchorEmbeddings();
    const textEmbedding = await embed(text);

    const simPositive = cosineSimilarity(textEmbedding, anchors.positive);
    const simNeutral = cosineSimilarity(textEmbedding, anchors.neutral);
    const simNegative = cosineSimilarity(textEmbedding, anchors.negative);

    let label: "positive" | "neutral" | "negative" = "neutral";
    let maxSim = simNeutral;

    if (simPositive > maxSim) {
        label = "positive";
        maxSim = simPositive;
    }
    if (simNegative > maxSim) {
        label = "negative"; 
        maxSim = simNegative;
    }

    const score = Number((simPositive - simNegative).toFixed(3));

    return {
        label,
        score,
        similarities: {
            positive: Number(simPositive.toFixed(3)),
            neutral: Number(simNeutral.toFixed(3)),
            negative: Number(simNegative.toFixed(3))
        }
    };
}
