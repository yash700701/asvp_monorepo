import { ParserInput, ParsedOutput } from "./types";
import { detectSentimentEmbedding } from "./sentimentEmbedding";
import { computeSentenceLevelProminence } from "./sentenceProminence";
import { processEntities } from "./processEntities";
import { computeVisibilityScore } from "./computeVisibilityScore";
import { linkNEREntities } from "./processEntities";
import { linkEntity } from "./unifiedEntityLinker";

export function ruleBasedParser(input: ParserInput): ParsedOutput {
    const text = input.raw_text;
    const lower = text.toLowerCase();
    const brandNamesLower = input.brandNames.map((b) => b.toLowerCase());

    const mentionsBrand = brandNamesLower.some((b) =>
        lower.includes(b)
    );

    // simple heuristic for snippet
    const mainSnippet = input.raw_text.slice(0, 300);

    // confidence heuristic
    let confidence = 0.4;
    if (mentionsBrand) confidence += 0.3;
    if (input.raw_text.length > 200) confidence += 0.2;
    if (input.raw_text.length > 500) confidence += 0.1;

    confidence = Math.min(confidence, 1.0);

    // const confidence = computeVisibilityScore(xyz);

    const sentiment = detectSentiment(lower);
    // const sentiment = await detectSentimentEmbedding(input.raw_text);
    const prominence = computeProminence(lower, brandNamesLower);
    // const prominence = await computeSentenceLevelProminence(
    //     input.raw_text,
    //     input.brandNames
    // );
    const entities = extractEntities(text, brandNamesLower);
    // const entities = processEntities(
    //     input.raw_text,
    //     sentences,
    //     sentenceImportanceScores,
    //     input.brandNames
    // )

    return {
        main_snippet: mainSnippet,
        mentions_brand: mentionsBrand,
        confidence,
        sentiment,
        prominence,
        entities
    };
}

function detectSentiment(text: string): "positive" | "neutral" | "negative" {
    const positiveWords = [
        "best",
        "leading",
        "top",
        "trusted",
        "recommended",
        "reliable",
        "innovative",
        "fast",
        "secure",
        "powerful",
        "popular",
        "excellent"
    ];
    const negativeWords = [
        "bad",
        "worse",
        "worst",
        "slow",
        "unreliable",
        "unsafe",
        "issue",
        "problem",
        "complaint",
        "limited",
        "outdated",
        "deprecated"
    ];

    let score = 0;
    for (const w of positiveWords) {
        if (text.includes(w)) score += 1;
    }
    for (const w of negativeWords) {
        if (text.includes(w)) score -= 1;
    }

    if (score >= 2) return "positive";
    if (score <= -2) return "negative";
    return "neutral";
}

function computeProminence(text: string, brandNamesLower: string[]): number {
    const length = Math.max(text.length, 1);
    let firstIndex = -1;
    for (const brand of brandNamesLower) {
        const idx = text.indexOf(brand);
        if (idx !== -1) {
            firstIndex = firstIndex === -1 ? idx : Math.min(firstIndex, idx);
        }
    }

    if (firstIndex === -1) return 0;

    // Higher score when brand appears earlier in the answer
    const positionRatio = firstIndex / length;
    const prominence = 1 - Math.min(Math.max(positionRatio, 0), 1);
    return Number(prominence.toFixed(3));
}

function extractEntities(text: string, brandNamesLower: string[]) {
    const entities: ParsedOutput["entities"] = [];
    const seen = new Set<string>();

    const brandSet = new Set(brandNamesLower);

    // Simple heuristic: capture capitalized word sequences
    const regex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const name = match[1].trim();
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        let type: ParsedOutput["entities"][number]["type"] = "Other";
        if (brandSet.has(key)) {
            type = "Brand";
        }

        entities.push({
            name,
            type,
            relevance: 0.6
        });

        if (entities.length >= 20) break;
    }

    return entities;
}



// How you’ll likely evolve this in ASVP 

// Replace keyword sentiment → embedding-based sentiment
// Improve entities → NER model
// Confidence → answer source weighting
// Prominence → sentence-level scoring
// Entity type inference → Brand / Product / Company separation