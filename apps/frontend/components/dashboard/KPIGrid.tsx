"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type KPI = {
    title: string
    value: number | string
    trend?: string
}

export default function KPIGrid() {
    const kpis: KPI[] = [
        { title: "Visibility Score", value: 72.4, trend: "+5.2%" },
        { title: "Brand Mention Rate", value: 64, trend: "+3.1%" },
        { title: "Avg Prominence", value: 0.71, trend: "-1.4%" },
        { title: "Sentiment Score", value: "Positive" },
        { title: "AI Confidence", value: 0.82, trend: "+0.8%" },
        { title: "Total Answers", value: 1248, trend: "+12%" },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
            {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
            ))}
        </div>
    )
}

/* ========================= */
/*       KPI CARD            */
/* ========================= */

function KPICard({ title, value, trend }: KPI) {
    const isNumber = typeof value === "number"
    const [displayValue, setDisplayValue] = useState(0)

    // Animated count-up effect
    useEffect(() => {
        if (!isNumber) return

        let start = 0
        const duration = 800
        const increment = value / (duration / 16)

        const counter = setInterval(() => {
            start += increment
            if (start >= value) {
                setDisplayValue(value)
                clearInterval(counter)
            } else {
                setDisplayValue(Number(start.toFixed(2)))
            }
        }, 16)

        return () => clearInterval(counter)
    }, [value, isNumber])

    const isPositiveTrend = trend?.startsWith("+")
    const isNegativeTrend = trend?.startsWith("-")

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">

            {/* Title */}
            <p className="text-sm font-medium text-gray-500">{title}</p>

            {/* Value */}
            <div className="mt-3 flex items-end justify-between">
                <h2 className="text-3xl font-semibold text-gray-900">
                    {isNumber ? displayValue : value}
                </h2>

                {/* Trend */}
                {trend && (
                    <div
                        className={`flex items-center gap-1 text-sm font-medium ${isPositiveTrend
                                ? "text-green-600"
                                : isNegativeTrend
                                    ? "text-red-600"
                                    : "text-gray-500"
                            }`}
                    >
                        {isPositiveTrend && <ArrowUpRight size={16} />}
                        {isNegativeTrend && <ArrowDownRight size={16} />}
                        {trend}
                    </div>
                )}
            </div>

            {/* Optional Sentiment Styling */}
            {title === "Sentiment Score" && (
                <div
                    className={`mt-4 text-xs font-semibold px-3 py-1 rounded-full w-fit ${value === "Positive"
                            ? "bg-green-100 text-green-700"
                            : value === "Negative"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {value}
                </div>
            )}
        </div>
    )
}