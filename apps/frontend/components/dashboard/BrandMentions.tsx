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

export default function BrandMentionsDashboard({ brandId }: { brandId: string }) {

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
        return <div className="text-sm text-muted-foreground">Loading brand mentions...</div>;
    }

    if (!response || !response.success) {
        return <div className="text-sm text-red-500">Failed to load brand mentions.</div>;
    }

    const mentions = Number(response.count.mentions);
    const total = Number(response.count.total);

    const mentionRate = total ? (mentions / total) * 100 : 0;

    const chartData = response.data.map((d) => ({
        day: new Date(d.day).toLocaleDateString(),
        mention_rate: Number(d.mention_rate),
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-3">

            <Card className="rounded-2xl shadow-sm col-span-2 border-zinc-300">
                <CardHeader>
                    <CardTitle className="text-sm">Brand Mentions</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-6 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Mentions</p>
                        <p className="text-2xl font-bold">{mentions}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Total Responses</p>
                        <p className="text-2xl font-bold">{total}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Mention Rate</p>
                        <p className="text-2xl font-bold">{mentionRate.toFixed(1)}%</p>
                    </div>
                </CardContent>
            </Card>

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