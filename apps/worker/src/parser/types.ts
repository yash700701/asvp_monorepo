export type ParserInput = {
    raw_text: string;
    brandNames: string[];
};

export type ParsedOutput = {
    main_snippet: string;
    mentions_brand: boolean;
    confidence: number;
    sentiment: "positive" | "neutral" | "negative";
    prominence: number;
    entities: Array<{
        name: string;
        type: "Brand" | "Product" | "Company" | "Person" | "Location" | "Other";
        relevance: number;
    }>;
};
