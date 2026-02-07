import { similarity } from "./stringSimilarity";
import { BRAND_REGISTRY } from "./brandRegistry";

export function linkEntityFuzzy(name: string) {
    const key = name.toLowerCase();

    let best: { entity: any; score: number } | null = null;

    for (const entity of BRAND_REGISTRY) {
        for (const alias of entity.aliases) {
            const score = similarity(key, alias);
            if (score > 0.85 && (!best || score > best.score)) {
                best = { entity, score };
            }
        }
    }

    if (!best) return null;

    return {
        entity: best.entity,
        confidence: Number((0.7 + best.score * 0.25).toFixed(3))
    };
}
