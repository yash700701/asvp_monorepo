"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export function SoVChart({
    data
}: {
    data: any[];
}) {
    return (
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <XAxis dataKey="source_type" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Bar dataKey="share_of_voice" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}
