import { extractEntitiesNER } from "./nerClient";

type ASVPEntity = {
    name: string;
    type: "Brand" | "Company" | "Product" | "Person" | "Location" | "Other";
    confidence: number;
    sentence_index: number;
    relevance: number;
    canonical_id?: string; // for entity linking later
};

const ENTITY_MAP: Record<string, ASVPEntity["type"]> = {
    ORG: "Company",
    PRODUCT: "Product",
    PERSON: "Person",
    GPE: "Location",
    LOC: "Location"
};

export async function processEntities(
    text: string,
    sentences: string[],
    sentenceScores: number[],
    brandNames: string[]
): Promise<ASVPEntity[]> {
    const rawEntities = await extractEntitiesNER(text);
    const lowerBrands = new Set(brandNames.map(b => b.toLowerCase()));

    return rawEntities.map(e => {
        const lower = e.text.toLowerCase();

        let type: ASVPEntity["type"] =
            ENTITY_MAP[e.label] ?? "Other";

        if (lowerBrands.has(lower)) {
            type = "Brand";
        }

        const sentenceIndex =
            sentences.findIndex(s => s.includes(e.text));

        const relevance =
            sentenceIndex >= 0
                ? Number((sentenceScores[sentenceIndex] * e.confidence).toFixed(3))
                : 0.4;

        return {
            name: e.text,
            type,
            confidence: e.confidence,
            sentence_index: sentenceIndex,
            relevance
        };
    });
}
