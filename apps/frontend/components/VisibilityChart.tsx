"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export function VisibilityChart({
    data
}: {
    data: any[];
}) {
    return (
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="avg_visibility"
                strokeWidth={2}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}
