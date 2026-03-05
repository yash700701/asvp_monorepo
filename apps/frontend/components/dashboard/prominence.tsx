"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/shadcn/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

type ProminenceRow = {
    created_at: string;
    prominence_score: number;
    first_sentence_index: number;
    best_sentence: string;
};

type ApiResponse = {
    success: boolean;
    data: ProminenceRow[];
};

type ChartPoint = {
    time: string;
    score: number;
    first_sentence_index: number;
    best_sentence: string;
};

export default function ProminenceDashboard({ brandId, onAverageProminence, onAveragePosition }: { brandId: string; onAverageProminence: (avg: number | null) => void; onAveragePosition: (avg: string | null) => void }) {

    const [data, setData] = useState<ProminenceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePoint, setActivePoint] = useState<ChartPoint | null>(null);

    useEffect(() => {
        async function fetchProminence() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/dashboard/prominenceTrend?brandId=${brandId}`,
                    { credentials: "include" }
                );

                const json: ApiResponse = await res.json();

                if (json.success) {
                    setData(json.data);
                }

            } catch (err) {
                console.error("Prominence fetch failed", err);
            } finally {
                setLoading(false);
            }
        }

        if (brandId) fetchProminence();
    }, [brandId]);

    const mentions = data.filter(d => d.prominence_score > 0);

    const avgScore =
        mentions.reduce((acc, d) => acc + d.prominence_score, 0) /
        (mentions.length || 1);
    onAverageProminence(avgScore.toFixed(2) ? parseFloat(avgScore.toFixed(2)) : null);

    const avgPosition =
        mentions.reduce((acc, d) => acc + d.first_sentence_index, 0) /
        (mentions.length || 1);
    onAveragePosition(avgPosition >= 0 ? `+${Math.round(avgPosition)}` : `${Math.round(avgPosition)}`);

    const chartData = useMemo(
        () =>
            [...data]
                .reverse()
                .map(d => ({
                    time: new Date(d.created_at).toLocaleTimeString(),
                    score: d.prominence_score,
                    first_sentence_index: d.first_sentence_index,
                    best_sentence: d.best_sentence
                })),
        [data]
    );

    useEffect(() => {
        if (chartData.length && !activePoint) {
            setActivePoint(chartData[chartData.length - 1]);
        }
    }, [chartData, activePoint]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">

                {/* Chart Card Skeleton */}
                <Card className="rounded-2xl shadow-sm border-zinc-300">
                    <CardHeader>
                        <div className="h-4 w-52 bg-zinc-200 rounded"></div>
                    </CardHeader>

                    <CardContent>
                        <div className="h-80 w-full bg-zinc-200 rounded-lg"></div>
                    </CardContent>
                </Card>

                {/* Best Sentence Card Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="h-4 w-40 bg-zinc-200 rounded"></div>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <div className="h-3 w-full bg-zinc-200 rounded"></div>
                        <div className="h-3 w-11/12 bg-zinc-200 rounded"></div>
                        <div className="h-3 w-10/12 bg-zinc-200 rounded"></div>
                    </CardContent>
                </Card>

            </div>
        );
    }

    if (!data.length) {
        return <div className="text-sm text-muted-foreground border border-yellow-500 px-2 py-1 bg-yellow-100">No prominence data available yet.</div>;
    }

    return (
        <div className="space-y-6">

            {/* Trend Chart */}
            <Card className="rounded-2xl shadow-sm border-zinc-300">
                <CardHeader>
                    <CardTitle className="text-sm">Prominence Trend (Last 100 Runs)</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                onMouseMove={(state: any) => {
                                    if (state && state.activePayload && state.activePayload.length) {
                                        setActivePoint(state.activePayload[0].payload);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (chartData.length) {
                                        setActivePoint(chartData[chartData.length - 1]);
                                    }
                                }}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="time" />

                                <YAxis domain={[0, 1]} />

                                <Tooltip
                                    formatter={(v: number | undefined) =>
                                        `${(v ?? 0).toFixed(2)}`
                                    }
                                    labelFormatter={(label, payload) => {
                                        const row: any = payload?.[0]?.payload;

                                        if (!row) return label;

                                        return `Time: ${label} | Sentence: ${row.first_sentence_index}`;
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>


            {/* Dynamic Best Sentence */}
            {activePoint?.best_sentence && (
                <Card className="rounded-2xl shadow-sm border-zinc-300">
                    <CardHeader>
                        <CardTitle className="text-sm">Strongest Brand Mention</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground ">
                            {activePoint.best_sentence}
                        </p>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
