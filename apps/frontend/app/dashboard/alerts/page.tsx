"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

type AlertRow = {
    id: string;
    alert_type: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "acknowledged" | "resolved";
    title: string | null;
    message: string;
    brand_name: string | null;
    query_text: string | null;
    source_type: string | null;
    metric_value: number | null;
    baseline_value: number | null;
    threshold_value: number | null;
    evidence: Record<string, unknown> | null;
    first_seen_at: string;
    last_seen_at: string;
};

type BrandOption = {
    id: string;
    brand_name: string;
};

const severityStyles: Record<string, string> = {
    low: "bg-zinc-100 text-zinc-700",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-700",
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertRow[]>([]);
    const [brands, setBrands] = useState<BrandOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    async function loadAlerts() {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            if (severityFilter) params.set("severity", severityFilter);
            if (brandFilter) params.set("brand_id", brandFilter);

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE}/alerts?${params.toString()}`,
                { withCredentials: true }
            );
            setAlerts(res.data?.data ?? []);
        } catch {
            setError("Failed to load alerts");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
                withCredentials: true,
            })
            .then((res) => {
                setBrands(res.data ?? []);
            })
            .catch(() => {
                setBrands([]);
            });
    }, []);

    useEffect(() => {
        loadAlerts();
    }, [statusFilter, severityFilter, brandFilter]);

    async function updateAlert(alertId: string, action: "ack" | "resolve") {
        try {
            setActionLoadingId(`${alertId}:${action}`);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/alerts/${alertId}/${action}`,
                {},
                { withCredentials: true }
            );
            await loadAlerts();
        } catch {
            setError(`Failed to ${action} alert`);
        } finally {
            setActionLoadingId(null);
        }
    }

    async function runAlertGeneration() {
        try {
            setRefreshing(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/alerts/run`,
                {},
                { withCredentials: true }
            );
            setTimeout(() => {
                loadAlerts();
                setRefreshing(false);
            }, 1500);
        } catch {
            setRefreshing(false);
            setError("Failed to start alert generation");
        }
    }

    return (
        <main className="pt-28 sm:pt-0 space-y-4">
            <div>
                <h1 className="text-xl font-semibold">Alerts</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Track visibility drops, brand-missing events, and connector failures.
                </p>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={runAlertGeneration}
                    disabled={refreshing}
                    className="rounded border border-black bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    {refreshing ? "Generating..." : "Run Alert Scan"}
                </button>
            </div>

            <section className="rounded-lg border bg-white p-4 flex flex-wrap gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                >
                    <option value="">All statuses</option>
                    <option value="open">Open</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="resolved">Resolved</option>
                </select>

                <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                >
                    <option value="">All severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>

                <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                >
                    <option value="">All brands</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.brand_name}
                        </option>
                    ))}
                </select>
            </section>

            {loading && <Loading />}
            {!loading && error && <p className="text-sm text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="space-y-3">
                    {alerts.length === 0 && (
                        <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
                            No alerts found for the current filters.
                        </div>
                    )}

                    {alerts.map((alert) => (
                        <article key={alert.id} className="rounded-lg border bg-white p-4 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${severityStyles[alert.severity] || severityStyles.low}`}>
                                            {alert.severity}
                                        </span>
                                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                                            {alert.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{alert.alert_type}</span>
                                    </div>
                                    <h2 className="text-base font-semibold">
                                        {alert.title || "Alert"}
                                    </h2>
                                    <p className="text-sm text-gray-700">{alert.message}</p>
                                </div>

                                <div className="flex gap-2">
                                    {alert.status === "open" && (
                                        <button
                                            onClick={() => updateAlert(alert.id, "ack")}
                                            disabled={actionLoadingId === `${alert.id}:ack`}
                                            className="text-xs px-3 py-1.5 rounded border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
                                        >
                                            {actionLoadingId === `${alert.id}:ack` ? "Acknowledging..." : "Acknowledge"}
                                        </button>
                                    )}
                                    {alert.status !== "resolved" && (
                                        <button
                                            onClick={() => updateAlert(alert.id, "resolve")}
                                            disabled={actionLoadingId === `${alert.id}:resolve`}
                                            className="text-xs px-3 py-1.5 rounded border border-black bg-black text-white hover:opacity-90 disabled:opacity-50"
                                        >
                                            {actionLoadingId === `${alert.id}:resolve` ? "Resolving..." : "Resolve"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2 text-xs text-gray-600 md:grid-cols-3">
                                <div>
                                    <span className="font-medium text-gray-800">Brand:</span> {alert.brand_name || "Unknown"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Source:</span> {alert.source_type || "Unknown"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Query:</span> {alert.query_text || "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Metric:</span> {alert.metric_value ?? "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Baseline:</span> {alert.baseline_value ?? "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800">Threshold:</span> {alert.threshold_value ?? "N/A"}
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 flex flex-wrap gap-4">
                                <span>First seen: {new Date(alert.first_seen_at).toLocaleString("en-IN")}</span>
                                <span>Last seen: {new Date(alert.last_seen_at).toLocaleString("en-IN")}</span>
                            </div>

                            {alert.evidence && Object.keys(alert.evidence).length > 0 && (
                                <details className="text-xs">
                                    <summary className="cursor-pointer text-gray-700">Evidence</summary>
                                    <pre className="mt-2 whitespace-pre-wrap break-words rounded bg-zinc-50 p-3 text-gray-600">
                                        {JSON.stringify(alert.evidence, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
