"use client";

import Loading from "@/components/Loading";

type Brand = {
    id: string;
    brand_name: string;
};

type Query = {
    id: string;
    query_text: string;
    frequency: string;
    brand_id: string;
    query_type: "brand" | "category" | "competitor";
    created_at: string;
    is_active: boolean;
    is_paused: boolean;
};

type Props = {
    brands: Brand[];
    queries: Query[];
    queriesLoading: boolean;
    queryError: string | null;
    filterBrandId: string;
    runningId: string | null;
    pausingId: string | null;
    activatingId: string | null;
    unschedulingId: string | null;
    onFilterBrandChange: (brandId: string) => void;
    onRunOnce: (queryId: string) => void;
    onActivate: (queryId: string) => void;
    onPause: (queryId: string) => void;
    onResume: (queryId: string) => void;
    onUnschedule: (queryId: string) => void;
};

export default function QueryList({
    brands,
    queries,
    queriesLoading,
    queryError,
    filterBrandId,
    runningId,
    pausingId,
    activatingId,
    unschedulingId,
    onFilterBrandChange,
    onRunOnce,
    onActivate,
    onPause,
    onResume,
    onUnschedule,
}: Props) {
    return (
        <section className="space-y-4 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">Queries</h2>
                    {queriesLoading && <Loading />}
                </div>

                <select
                    value={filterBrandId}
                    onChange={(e) => onFilterBrandChange(e.target.value)}
                    className="border rounded p-2 text-sm"
                >
                    <option value="">All brands</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.brand_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="border rounded divide-y">
                {!queriesLoading && queries.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">No queries found</p>
                )}
                {queryError && (
                    <p className="p-4 text-sm text-red-500">
                        Error loading queries: {queryError}
                    </p>
                )}

                {queries.map((q) => (
                    <div
                        key={q.id}
                        className="p-4 text-sm flex items-start justify-between gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{q.query_text}</span>

                                {q.is_active && !q.is_paused && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                        Active
                                    </span>
                                )}

                                {q.is_active && q.is_paused && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                        Paused
                                    </span>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {q.frequency} · {q.query_type}
                            </div>
                        </div>

                        <div className="flex items-end justify-end gap-2 flex-wrap">
                            <button
                                onClick={() => onRunOnce(q.id)}
                                disabled={runningId === q.id}
                                className="text-xs px-3 py-1 rounded border border-gray-400 hover:bg-gray-100 transition disabled:opacity-50"
                            >
                                {runningId === q.id ? "Running..." : "Run once"}
                            </button>

                            {!q.is_active && (
                                <button
                                    onClick={() => onActivate(q.id)}
                                    disabled={activatingId === q.id}
                                    className="text-xs px-3 py-1 rounded border border-black hover:bg-black hover:text-white transition disabled:opacity-50"
                                >
                                    {activatingId === q.id ? "Activating..." : "Activate"}
                                </button>
                            )}

                            {q.is_active && !q.is_paused && (
                                <button
                                    onClick={() => onPause(q.id)}
                                    disabled={pausingId === q.id}
                                    className="text-xs px-3 py-1 rounded border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition disabled:opacity-50"
                                >
                                    {pausingId === q.id ? "Pausing..." : "Pause"}
                                </button>
                            )}

                            {q.is_active && q.is_paused && (
                                <button
                                    onClick={() => onResume(q.id)}
                                    disabled={pausingId === q.id}
                                    className="text-xs px-3 py-1 rounded border border-green-600 text-green-700 hover:bg-green-50 transition disabled:opacity-50"
                                >
                                    {pausingId === q.id ? "Resuming..." : "Resume"}
                                </button>
                            )}

                            {q.is_active && (
                                <button
                                    onClick={() => onUnschedule(q.id)}
                                    disabled={unschedulingId === q.id}
                                    className="text-xs px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                >
                                    {unschedulingId === q.id ? "Stopping..." : "Unschedule"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
