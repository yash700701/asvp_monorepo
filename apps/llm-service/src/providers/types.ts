export type RecommendInput = {
    type: string;
    brand: string;
    query: string;
    source: string;
    signals: Record<string, any>;
    evidence?: Record<string, any>;
};

export type RecommendOutput = {
    recommendation: string;
    confidence: number;
};

export interface LLMProvider {
    recommend(input: RecommendInput): Promise<RecommendOutput>;
}
