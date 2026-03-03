import { ParserInput, ParsedOutput } from "./types";
import { detectSentimentWrapper } from "./sentimentEmbedding";
import { computeSentenceLevelProminenceWrapper } from "./sentenceProminence";
import { processEntities, linkNEREntities } from "./processEntities";
import { computeVisibilityScore } from "./computeVisibilityScore";

function splitSentences(text: string): string[] {
    return text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

function computeSentenceImportanceScores(sentences: string[]): number[] {
    if (sentences.length === 0) return [];

    return sentences.map((_, i) =>
        Number((1 - i / Math.max(1, sentences.length)).toFixed(3))
    );
}

export async function ruleBasedParser(input: ParserInput): Promise<ParsedOutput> {
    const text = input.raw_text;
    const brandNames = input.brandNames;
    const source = input.source;
    const lower = text.toLowerCase();
    const brandNamesLower = input.brandNames.map((b) => b.toLowerCase());

    const mentionsBrand = brandNamesLower.some((b) => lower.includes(b));

    const sentiment = await detectSentimentWrapper(text);
    const prominence = await computeSentenceLevelProminenceWrapper(text, brandNames);

    const sentences = splitSentences(text);
    const sentenceImportanceScores = computeSentenceImportanceScores(sentences);

    const extractedEntities = await processEntities(
        text,
        sentences,
        sentenceImportanceScores,
        brandNames
    );

    const linkedEntities = linkNEREntities(extractedEntities);

    const visibility = computeVisibilityScore({
        source: source || "unknown",
        text,
        prominence,
        linkedEntities,
        sentiment
    });

    return {
        mentions_brand: mentionsBrand,
        confidence: visibility,
        sentiment,
        prominence,
        entities: linkedEntities
    };
}
