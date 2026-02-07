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

async function embed(text: string): Promise<number[]> {
    const res = await client.embeddings.create({
        model: MODEL,
        input: text
    });
    return res.data[0].embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function splitSentences(text: string): string[] {
    return text
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean);
}

export async function computeSentenceLevelProminence(
    text: string,
    brandNames: string[]
): Promise<{
    score: number;
    first_sentence_index: number;
    best_sentence: string | null;
}> {
    const sentences = splitSentences(text);
    if (sentences.length === 0) {
        return { score: 0, first_sentence_index: -1, best_sentence: null };
    }

    const lowerBrands = brandNames.map(b => b.toLowerCase());

    const fullEmbedding = await embed(text);
    const sentenceEmbeddings = await Promise.all(
        sentences.map(s => embed(s))
    );

    let bestScore = 0;
    let bestSentenceIndex = -1;
    let bestSentence: string | null = null;

    for (let i = 0; i < sentences.length; i++) {
        const sentenceLower = sentences[i].toLowerCase();

        const mentionsBrand = lowerBrands.some(b =>
            sentenceLower.includes(b)
        );
        if (!mentionsBrand) continue;

        const importance = cosineSimilarity(
            sentenceEmbeddings[i],
            fullEmbedding
        );

        const positionWeight = 1 - i / sentences.length;

        const score = importance * positionWeight;

        if (score > bestScore) {
            bestScore = score;
            bestSentenceIndex = i;
            bestSentence = sentences[i];
        }
    }

    return {
        score: Number(bestScore.toFixed(3)),
        first_sentence_index: bestSentenceIndex,
        best_sentence: bestSentence
    };
}
