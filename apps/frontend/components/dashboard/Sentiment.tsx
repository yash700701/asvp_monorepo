"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/shadcn/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

type SentimentRow = {
    created_at: string;
    sentiment_score: number;
    sentiment_label: "positive" | "neutral" | "negative";
    positive_sim: number;
    neutral_sim: number;
    negative_sim: number;
};

type ApiResponse = {
    success: boolean;
    data: SentimentRow[];
};

export default function SentimentDashboard({ brandId }: { brandId: string }) {
    const [data, setData] = useState<SentimentRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSentiment() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/dashboard/sentiment-overview?brandId=${brandId}`,
                    { credentials: "include" }
                );

                const json: ApiResponse = await res.json();

                if (json.success) {
                    setData(json.data);
                }
            } catch (err) {
                console.error("Sentiment fetch failed", err);
            } finally {
                setLoading(false);
            }
        }

        if (brandId) fetchSentiment();
    }, [brandId]);

    if (loading) {
        return (
            <Card className="rounded-2xl shadow-sm border-zinc-300 animate-pulse">
                <CardHeader>
                    <div className="h-4 w-48 bg-zinc-200 rounded"></div>
                </CardHeader>

                <CardContent>
                    <div className="h-72 w-full flex items-end gap-2">
                        {[...Array(16)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-zinc-200 rounded"
                                style={{ height: `${25 + Math.random() * 50}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data.length) {
        return <div className="text-sm text-muted-foreground border border-yellow-500 px-2 py-1 bg-yellow-100">No sentiment data.</div>;
    }

    const positiveCount = data.filter(d => d.sentiment_label === "positive").length;
    const neutralCount = data.filter(d => d.sentiment_label === "neutral").length;
    const negativeCount = data.filter(d => d.sentiment_label === "negative").length;

    const chartData = [...data]
        .reverse()
        .map(d => ({
            time: new Date(d.created_at).toLocaleTimeString(),
            sentiment: d.sentiment_score,
            positive: d.positive_sim,
            neutral: d.neutral_sim,
            negative: d.negative_sim
        }));

    return (
        <div className="space-y-6">

            {/* <Card>
                <CardHeader>
                    <CardTitle>AI Sentiment Overview</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-3 text-center gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Positive</p>
                        <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Neutral</p>
                        <p className="text-2xl font-bold text-gray-600">{neutralCount}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Negative</p>
                        <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
                    </div>
                </CardContent>
            </Card> */}

            <Card className="rounded-2xl shadow-sm border-zinc-300">
                <CardHeader>
                    <CardTitle className="text-sm">Sentiment Trend (Last 100 Queries)</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="time" />

                                <YAxis domain={[0, 1]} />

                                <Tooltip
                                    formatter={(v: number | undefined) =>
                                        `${(v ?? 0).toFixed(2)}`
                                    }
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="positive"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="neutral"
                                    stroke="#64748b"
                                    strokeWidth={2}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="negative"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}