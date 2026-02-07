import { BRAND_REGISTRY, CanonicalEntity } from "./brandRegistry";

function normalize(text: string): string {
    return text.toLowerCase().trim();
}

export function linkEntityExact(
    name: string
): { entity: CanonicalEntity; confidence: number } | null {
    const key = normalize(name);

    for (const entity of BRAND_REGISTRY) {
        if (
            normalize(entity.canonical_name) === key ||
            entity.aliases.map(normalize).includes(key)
        ) {
            return { entity, confidence: 0.95 };
        }
    }
    return null;
}
