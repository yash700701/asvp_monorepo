"use client";

export function UsageBar({
    used,
    limit
}: {
    used: number;
    limit: number;
}) {
    const pct = Math.min(100, (used / limit) * 100);

    return (
        <div className="space-y-1">
            <div className="text-sm">
                Usage: {used} / {limit} runs
            </div>
            <div className="h-2 bg-gray-200 rounded">
                <div
                    className="h-2 bg-black rounded"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
