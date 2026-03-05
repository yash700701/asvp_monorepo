"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "@/components/dashboard/TopBar";
import VisibilityOverview from "@/components/dashboard/VisibilityOverview";
import KPIGrid from "@/components/dashboard/KPIGrid";
import BrandMentionsDashboard from "@/components/dashboard/BrandMentions";
import SentimentDashboard from "@/components/dashboard/Sentiment";
import ProminenceDashboard from "@/components/dashboard/prominence";
import {
    DashboardBrand,
    useBrandSelection,
} from "@/components/dashboard/BrandSelectionContext";

export default function DashboardPage() {
    const {
        brands,
        setBrands,
        selectedBrandId,
        setSelectedBrandId,
    } = useBrandSelection();

    const [averageVisibility, setAverageVisibility] = useState<number | null>(null);
    const [visibilityChange, setVisibilityChange] = useState<string | null>(null);
    const [averageSentiment, setAverageSentiment] = useState<number | null>(null);
    const [averageProminence, setAverageProminence] = useState<number | null>(null);

    useEffect(() => {
        async function loadBrands() {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE}/brands`,
                    { withCredentials: true }
                );
                const data = (Array.isArray(res.data) ? res.data : []) as DashboardBrand[];

                setBrands(data);

                if (data.length > 0) {
                    const stillValid = data.some((b) => b.id === selectedBrandId);
                    if (!stillValid) {
                        setSelectedBrandId(data[0].id);
                    }
                } else {
                    setSelectedBrandId(null);
                }
            } catch {
                setBrands([]);
                setSelectedBrandId(null);
            }
        }

        loadBrands();
    }, [setBrands, selectedBrandId, setSelectedBrandId]);

    const topBarBrands = useMemo(
        () => brands.map((b) => ({ id: b.id, name: b.brand_name })),
        [brands]
    );

    return (
        <div className="pt-28 sm:pt-0 space-y-3">
            <TopBar
                brands={topBarBrands}
                selectedBrandId={selectedBrandId}
                onSelectBrand={setSelectedBrandId}
            />

            <KPIGrid
                averageVisibility={averageVisibility}
                visibilityChange={visibilityChange}
                averageSentiment={averageSentiment}
                averageProminence={averageProminence}
            />

            {selectedBrandId ? (
                <VisibilityOverview
                    brandId={selectedBrandId}
                    onAverageVisibilityChange={setAverageVisibility}
                    onVisibilityChange={setVisibilityChange}
                />
            ) : (
                <div className="rounded-md border bg-white p-4 text-sm text-gray-500">
                    Select a brand to view visibility overview.
                </div>
            )}

            {selectedBrandId ? (
                <BrandMentionsDashboard brandId={selectedBrandId} />
            ) : (
                <div className="rounded-md border bg-white p-4 text-sm text-gray-500">
                    Select a brand to view brand mentions.
                </div>
            )}

            {selectedBrandId ? (
                <SentimentDashboard brandId={selectedBrandId} />
            ) : (
                <div className="rounded-md border bg-white p-4 text-sm text-gray-500">
                    Select a brand to view sentiment overview.
                </div>
            )}

            {selectedBrandId ? (
                <ProminenceDashboard brandId={selectedBrandId} />
            ) : (
                <div className="rounded-md border bg-white p-4 text-sm text-gray-500">
                    Select a brand to view prominence overview.
                </div>
            )}
        </div>
    );
}
