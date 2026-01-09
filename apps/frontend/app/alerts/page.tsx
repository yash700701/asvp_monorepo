import { fetchJSON } from "../../lib/api";
import { Badge } from "../../components/Badge";

function severityColor(severity: string) {
    switch (severity) {
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

export default async function AlertsPage() {
    const alerts = await fetchJSON<any[]>("/alerts");

    return (
        <section className="p-6 space-y-6">
        <h1 className="text-xl font-bold">
            Alerts
        </h1>

        {alerts.length === 0 && (
            <div className="text-gray-500">
            No active alerts 🎉
            </div>
        )}

        <ul className="space-y-4">
            {alerts.map((a) => (
            <li
                key={a.id}
                className="bg-white border rounded p-4"
            >
                <div className="flex items-center gap-2 mb-1">
                <Badge
                    label={a.severity.toUpperCase()}
                    color={severityColor(a.severity)}
                />
                <span className="font-semibold">
                    {a.alert_type}
                </span>
                </div>

                <p className="text-sm text-gray-700">
                {a.message}
                </p>
            </li>
            ))}
        </ul>
        </section>
    );
}
