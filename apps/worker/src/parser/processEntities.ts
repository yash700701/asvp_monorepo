import { extractEntitiesNER } from "./nerClient";
import { linkEntity } from "./unifiedEntityLinker";

type LinkedEntity = {
    entity_id: string;          // canonical ID
    name: string;               // surface form from text
    canonical_name: string;
    type: "Brand" | "Company" | "Product";
    confidence: number;         // linking confidence
    relevance: number;          // from Phase 2 + 3
    sentence_index: number;
};


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

export function linkNEREntities(
    entities: ASVPEntity[]
): LinkedEntity[] {
    return entities.map(e => {
        const linked = linkEntity(e.name);

        if (!linked) {
            return {
                entity_id: `raw_${e.name.toLowerCase()}`,
                name: e.name,
                canonical_name: e.name,
                type: e.type,
                confidence: e.confidence * 0.6,
                relevance: e.relevance,
                sentence_index: e.sentence_index
            };
        }

        return {
            entity_id: linked.entity.id,
            name: e.name,
            canonical_name: linked.entity.canonical_name,
            type: linked.entity.type,
            confidence: linked.confidence,
            relevance: e.relevance,
            sentence_index: e.sentence_index
        };
    });
}

