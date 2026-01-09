import { fetchJSON } from "../../lib/api";

export default async function AlertsPage() {
    const alerts = await fetchJSON<any[]>("/alerts");

    return (
        <main className="p-6">
        <h1 className="text-xl font-bold mb-4">Alerts</h1>

        <ul className="space-y-3">
            {alerts.map((a) => (
            <li
                key={a.id}
                className="border p-3 rounded"
            >
                <div className="font-semibold">
                {a.alert_type} ({a.severity})
                </div>
                <div className="text-sm text-gray-700">
                {a.message}
                </div>
            </li>
            ))}
        </ul>
        </main>
    );
}
