export function estimateTokens(text: string): number {
    // rough heuristic: ~4 chars per token
    return Math.ceil(text.length / 4);
}
