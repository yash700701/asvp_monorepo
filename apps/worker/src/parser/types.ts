export type ParserInput = {
    raw_text: string;
    brandNames: string[];
};

export type ParsedOutput = {
    main_snippet: string;
    mentions_brand: boolean;
    confidence: number;
};
