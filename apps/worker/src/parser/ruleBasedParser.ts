import { ParserInput, ParsedOutput } from "./types";

export function ruleBasedParser(input: ParserInput): ParsedOutput {
    const text = input.raw_text.toLowerCase();

    const mentionsBrand = input.brandNames.some((b) =>
        text.includes(b.toLowerCase())
    );

    // simple heuristic for snippet
    const mainSnippet = input.raw_text.slice(0, 300);

    // confidence heuristic
    let confidence = 0.4;
    if (mentionsBrand) confidence += 0.3;
    if (input.raw_text.length > 200) confidence += 0.2;
    if (input.raw_text.length > 500) confidence += 0.1;

    confidence = Math.min(confidence, 1.0);

    return {
        main_snippet: mainSnippet,
        mentions_brand: mentionsBrand,
        confidence
    };
}
