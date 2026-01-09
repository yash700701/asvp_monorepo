import { fetchJSON } from "../../lib/api";

export default async function RecommendationsPage() {
    const recs = await fetchJSON<any[]>(
        "/recommendations"
    );

    return (
        <main className="p-6">
        <h1 className="text-xl font-bold mb-4">
            Recommendations
        </h1>

        <ul className="space-y-4">
            {recs.map((r) => (
            <li
                key={r.id}
                className="border p-4 rounded"
            >
                <div className="font-semibold">
                {r.type} — {r.priority}
                </div>
                <div className="text-sm mt-1">
                {r.message}
                </div>
            </li>
            ))}
        </ul>
        </main>
    );
}
