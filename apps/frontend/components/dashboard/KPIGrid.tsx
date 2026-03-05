"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type KPI = {
    title: string
    value: number | string
    trend?: string
}

export default function KPIGrid({ averageVisibility, visibilityChange, averageSentiment, averageProminence }: { averageVisibility: number | null; visibilityChange: string | null; averageSentiment: number | null; averageProminence: number | null }) {
    const kpis: KPI[] = [
        { title: "Visibility Score", value: averageVisibility ?? 0, trend: visibilityChange ?? "0%" },
        { title: "Brand Mention Rate", value: 64, trend: "+3.1%" },
        { title: "Avg Prominence", value: averageProminence ?? 0.71, trend: "-1.4%" },
        { title: "Sentiment Score", value: averageSentiment ?? "Positive" },
        { title: "AI Confidence", value: 0.82, trend: "+0.8%" },
        { title: "Total Answers", value: 1248, trend: "+12%" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
            ))}
        </div>
    )
}

function KPICard({ title, value, trend }: KPI) {
    const isNumber = typeof value === "number"

    const [displayValue, setDisplayValue] = useState(0)
    const [displayTrend, setDisplayTrend] = useState(0)

    const trendNumber = trend ? Number(trend.replace("%", "").replace("+", "").replace("-", "")) : 0
    const trendSign = trend?.startsWith("-") ? -1 : 1

    const isPositiveTrend = trend?.startsWith("+")
    const isNegativeTrend = trend?.startsWith("-")

    // Value animation
    useEffect(() => {
        if (!isNumber) return

        let start = 0
        const duration = 2000
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

    // Trend animation
    useEffect(() => {
        if (!trend) return

        let start = 0
        const duration = 700
        const increment = trendNumber / (duration / 16)

        const counter = setInterval(() => {
            start += increment

            if (start >= trendNumber) {
                setDisplayTrend(trendNumber)
                clearInterval(counter)
            } else {
                setDisplayTrend(Number(start.toFixed(2)))
            }
        }, 16)

        return () => clearInterval(counter)
    }, [trend, trendNumber])

    return (
        <div className="bg-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">

            
            <p className="text-xs font-medium text-zinc-800">{title}</p>
            
            <div className="mt-3 items-end justify-between">
                <h2 className="text-3xl font-semibold text-gray-900">
                    {isNumber ? displayValue : value}
                </h2>

                {trend && (
                    <div
                        className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${isPositiveTrend
                            ? "text-green-600"
                            : isNegativeTrend
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                    >
                        {isPositiveTrend && (
                            <ArrowUpRight size={16} className="animate-pulse" />
                        )}

                        {isNegativeTrend && (
                            <ArrowDownRight size={16} className="animate-pulse" />
                        )}

                        {trendSign < 0 ? "-" : "+"}
                        {displayTrend.toFixed(1)}%
                    </div>
                )}
            </div>

            {/* Sentiment Badge */}
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