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

export default function ProminenceDashboard({ brandId }: { brandId: string }) {

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

    const avgPosition =
        mentions.reduce((acc, d) => acc + d.first_sentence_index, 0) /
        (mentions.length || 1);

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
        return <div className="text-sm text-muted-foreground">Loading prominence...</div>;
    }

    if (!data.length) {
        return <div className="text-sm text-muted-foreground">No prominence data.</div>;
    }

    return (
        <div className="space-y-6">

            {/* Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Brand Prominence</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-3 gap-6 text-center">

                    <div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold">
                            {avgScore.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Avg Mention Position</p>
                        <p className="text-2xl font-bold">
                            {Math.round(avgPosition)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Mentions</p>
                        <p className="text-2xl font-bold">
                            {mentions.length} / {data.length}
                        </p>
                    </div>

                </CardContent>
            </Card>


            {/* Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Prominence Trend (Last 100 Runs)</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                onMouseMove={(state: any) => {
                                    const payload = state?.activePayload?.[0]?.payload;
                                    if (payload) {
                                        setActivePoint(payload);
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
                                />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>


            {/* Dynamic Best Sentence */}
            {activePoint?.best_sentence && (
                <Card>
                    <CardHeader>
                        <CardTitle>Strongest Brand Mention</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {activePoint.best_sentence}
                        </p>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
