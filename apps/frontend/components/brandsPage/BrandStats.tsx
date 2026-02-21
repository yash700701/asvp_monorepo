"use client";

import CountUp from "react-countup";

type Props = {
    brandsCount: number;
    queryCount: number;
    activeQueryCount: number;
    visibility: number;
};

export default function BrandStats({
    brandsCount,
    queryCount,
    activeQueryCount,
    visibility,
}: Props) {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">

            <div>
                <h2 className="text-lg font-semibold">Brand Overview</h2>
                <p className="text-sm text-gray-500">
                    Summary of your tracked brands
                </p>
            </div>

            <div className="flex flex-wrap gap-6">
                <StatCard label="Total Brands" value={brandsCount} />
                <StatCard label="Total Queries" value={queryCount} />
                <StatCard label="Active Queries" value={activeQueryCount} />
                <StatCard label="Avg Visibility" value={visibility} />
            </div>

            <div className="border rounded-lg h-32 flex items-center justify-center text-sm text-gray-400">
                Visibility trend chart (coming soon)
            </div>

        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-2">
            <div className="text-4xl font-semibold">
                <CountUp
                    end={value}
                    duration={1.2}
                    separator=","
                />
                {label === "Avg Visibility" && "%"}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}