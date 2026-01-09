import { fetchJSON } from "../../../lib/api";
import { VisibilityChart } from "../../../components/VisibilityChart";

export default async function VisibilityPage() {
    const data = await fetchJSON<any[]>(
        "/analytics/visibility"
    );

    return (
        <section className="p-6 space-y-6">
        <h1 className="text-xl font-bold">
            Visibility Over Time
        </h1>

        <div className="bg-white border rounded p-4">
            <VisibilityChart data={data} />
        </div>
        </section>
    );
}
