export type RawNEREntity = {
    text: string;
    label: string;
    start: number;
    end: number;
    confidence: number;
};

export async function extractEntitiesNER(text: string): Promise<RawNEREntity[]> {
    const res = await fetch("http://localhost:8091/extract-entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await res.json();
    return data.entities;
}
