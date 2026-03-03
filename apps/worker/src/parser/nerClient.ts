import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export type RawNEREntity = {
    text: string;
    label: string;
    start: number;
    end: number;
    confidence: number;
};

export async function extractEntitiesNER(text: string): Promise<RawNEREntity[]> {
    const res = await fetch(`${process.env.NER_SERVICE_URL}/extract-entities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await res.json();
    return data.entities;
}
