import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function fetchJSON<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}
