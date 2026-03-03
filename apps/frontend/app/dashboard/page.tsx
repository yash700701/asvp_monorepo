// import KPIGrid from "@/components/dashboard/kpi/KPIGrid";
// import VisibilityTrendChart from "@/components/dashboard/charts/VisibilityTrendChart";
// import SentimentChart from "@/components/dashboard/charts/SentimentChart";
// import ProminenceChart from "@/components/dashboard/charts/ProminenceChart";
// import CompetitorChart from "@/components/dashboard/charts/CompetitorChart";
// import AnswerTable from "@/components/dashboard/tables/AnswerTable";
// import AlertsPanel from "@/components/dashboard/alerts/AlertsPanel";

// export default function DashboardPage() {
//     return (
//         <div className="space-y-6">
//             <KPIGrid />
//             <VisibilityTrendChart />
//             <div className="grid grid-cols-2 gap-6">
//                 <SentimentChart />
//                 <ProminenceChart />
//             </div>
//             <CompetitorChart />
//             <AlertsPanel />
//             <AnswerTable />
//         </div>
//     );
// }



"use client"

import { useEffect, useState } from "react";

import TopBar from "@/components/dashboard/TopBar"
import KPIGrid from "@/components/dashboard/KPIGrid"

export default function DashboardSkeleton() {

    // const [brands, setBrands] = useState<>([])

    // useEffect(() => {
    //     setBrandsLoading(true);
    //     axios
    //         .get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
    //             withCredentials: true,
    //         })
    //         .then((res) => {
    //             setBrands(res.data);
    //             setBrandsCount(res.data.length);
    //         })
    //         .catch(() => setFetchBrandsError("Failed to load brands"))
    //         .finally(() => setBrandsLoading(false));
    // }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 mt-24 sm:mt-0">

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <TopBar />

                {/* Content */}
                <main className="p-4 space-y-4">

                    {/* KPI Section */}
                    <KPIGrid />

                    {/* Visibility Trend Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
                        <div className="h-64 bg-gray-100 rounded-xl" />
                    </div>

                    {/* Sentiment + Prominence */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                            <div className="h-56 bg-gray-100 rounded-xl" />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                            <div className="h-56 bg-gray-100 rounded-xl" />
                        </div>
                    </div>

                    {/* Competitor Intelligence */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="h-6 w-56 bg-gray-200 rounded mb-6" />
                        <div className="h-64 bg-gray-100 rounded-xl" />
                    </div>

                    {/* Alerts */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-gray-100 rounded-xl"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Answer Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-gray-100 rounded"
                                />
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}