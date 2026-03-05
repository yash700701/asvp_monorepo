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
    CartesianGrid
} from "recharts";

type MentionTrend = {
    day: string;
    mention_rate: string | number;
};

type MentionsResponse = {
    success: boolean;
    data: MentionTrend[];
    count: {
        mentions: string | number;
        total: string | number;
    };
};

export default function BrandMentionsDashboard({ brandId, onMentionsChange, onTotalResponsesChange, onMentionRateChange }: { brandId: string; onMentionsChange: (mentions: number) => void; onTotalResponsesChange: (total: number) => void; onMentionRateChange: (rate: number) => void }) {

    const [response, setResponse] = useState<MentionsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMentions() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/dashboard/brandMentions?brandId=${brandId}`,
                    {
                        credentials: "include"
                    }
                );

                const data = await res.json();
                setResponse(data);

            } catch (err) {
                console.error("Failed to fetch brand mentions:", err);
            } finally {
                setLoading(false);
            }
        }

        if (brandId) fetchMentions();
    }, [brandId]);

    if (loading) {
        return (
            <Card className="rounded-2xl shadow-sm col-span-8 border-zinc-300 animate-pulse">
                <CardHeader>
                    <div className="h-4 w-40 bg-zinc-200 rounded"></div>
                </CardHeader>

                <CardContent>
                    <div className="h-72 w-full flex items-end gap-2">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-zinc-200 rounded"
                                style={{ height: `${30 + Math.random() * 40}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!response?.data.length) {
        return <div className="text-sm text-muted-foreground border border-yellow-500 px-2 py-1 bg-yellow-100">No mention data available.</div>;
    }

    if (!response || !response.success) {
        return <div className="text-sm text-red-500">Failed to load brand mentions.</div>;
    }

    const mentions = Number(response.count.mentions);
    onMentionsChange(mentions);
    const total = Number(response.count.total);
    onTotalResponsesChange(total);

    const mentionRate = total ? (mentions / total) * 100 : 0;
    onMentionRateChange(mentionRate);

    const chartData = response.data.map((d) => ({
        day: new Date(d.day).toLocaleDateString(),
        mention_rate: Number(d.mention_rate),
    }));

    return (
        <div className="">
            <Card className="rounded-2xl shadow-sm col-span-8 border-zinc-300">
                <CardHeader>
                    <CardTitle className="text-sm">Brand Mention Trend</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)}%`} />
                                <Line
                                    type="monotone"
                                    dataKey="mention_rate"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}