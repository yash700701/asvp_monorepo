import { linkEntityExact } from "./entityLinker";
import { linkEntityFuzzy } from "./fuzzyLinker";

export function linkEntity(name: string) {
    return (
        linkEntityExact(name) ||
        linkEntityFuzzy(name) ||
        null
    );
}
