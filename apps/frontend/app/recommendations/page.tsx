import { fetchJSON } from "../../lib/api";
import { Badge } from "../../components/Badge";

function priorityColor(priority: string) {
    switch (priority) {
        case "high":
        return "red";
        case "medium":
        return "yellow";
        case "low":
        return "green";
        default:
        return "gray";
    }
}

export default async function RecommendationsPage() {
    const recs = await fetchJSON<any[]>("/recommendations");

    return (
        <section className="p-6 space-y-6">
        <h1 className="text-xl font-bold">
            Recommendations
        </h1>

        {recs.length === 0 && (
            <div className="text-gray-500">
            No recommendations yet.
            </div>
        )}

        <ul className="space-y-4">
            {recs.map((r) => {
            const isLLM = r.type === "llm_recommendation";

            return (
                <li
                key={r.id}
                className="bg-white border rounded p-4"
                >
                <div className="flex items-center gap-2 mb-2">
                    <Badge
                    label={r.priority.toUpperCase()}
                    color={priorityColor(r.priority)}
                    />
                    <Badge
                    label={isLLM ? "AI-Generated" : "Rule-Based"}
                    color={isLLM ? "purple" : "blue"}
                    />
                </div>

                <p className="text-sm text-gray-800">
                    {r.message}
                </p>
                </li>
            );
            })}
        </ul>
        </section>
    );
}
