"use client";

import Loading from "@/components/Loading";
import Image from "next/image";

type Brand = {
    id: string;
    brand_name: string;
    brand_logo: string;
};

type Query = {
    id: string;
    query_text: string;
    brand_name: string;
    brand_logo: string;
    frequency: string;
    brand_id: string;
    query_type: "brand" | "category" | "competitor";
    created_at: string;
    is_active: boolean;
    is_paused: boolean;

    responses: number;
    brand_mentions: number;
    visibility: number;
    prominence: number;
    sentiment: number;
    runs: number;
    last_run: string | null;
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
    deletingId: string | null;
    unschedulingId: string | null;
    onFilterBrandChange: (brandId: string) => void;
    onRunOnce: (queryId: string) => void;
    onDelete: (queryId: string) => void;
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
    deletingId,
    unschedulingId,
    onFilterBrandChange,
    onDelete,
    onRunOnce,
    onActivate,
    onPause,
    onResume,
    onUnschedule,
}: Props) {
    return (
        <section className="w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold italic pb-2">Queries.</h2>
                    {queriesLoading && <Loading />}
                </div>

                <select
                    value={filterBrandId}
                    onChange={(e) => onFilterBrandChange(e.target.value)}
                    className="text-sm"
                >
                    <option value="">All brands</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.brand_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="">
                {!queriesLoading && queries.length === 0 && (
                    <p className="text-sm text-gray-500">No queries found, Add your first query to see how your brand appears in GPT, Gemini & Claude.</p>
                )}
                {queryError && (
                    <p className="text-sm text-red-500">
                        Error loading queries: {queryError}
                    </p>
                )}

                {queries.map((q) => (
                    <div
                        key={q.id}
                        className="py-1 text-sm flex items-start justify-between gap-4"
                    >
                        <div className="bg-gray-100 w-full p-3 rounded-lg">
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

                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <Image
                                        src={q.brand_logo}
                                        alt={q.brand_name}
                                        width={24}
                                        height={24}
                                        className="w-4 h-4 rounded-sm border border-black"
                                    />

                                    <span>
                                        {q.brand_name} | {q.frequency} | {q.query_type}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
                                    <span>Responses: {q.responses}</span>
                                    <span>Mentions: {q.brand_mentions}</span>
                                    <span>Visibility: {q.visibility}%</span>
                                    <span>Prominence: {q.prominence}</span>
                                    <span>Sentiment: {q.sentiment}</span>
                                    <span>Runs: {q.runs}</span>

                                    <span>
                                        Last run:{" "}
                                        {q.last_run
                                            ? new Date(q.last_run).toLocaleString()
                                            : "Never"}
                                    </span>
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

                                <button
                                    onClick={() => onDelete(q.id)}
                                    disabled={deletingId === q.id}
                                    className="text-xs px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 transition"
                                >
                                    {deletingId === q.id ? "Deleting..." : "Delete"}
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
                    </div>
                ))}
            </div>
        </section>
    );
}
