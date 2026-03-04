"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "@/components/dashboard/TopBar";
import VisibilityOverview from "@/components/dashboard/VisibilityOverview";
import KPIGrid from "@/components/dashboard/KPIGrid";
import BrandMentionsDashboard from "@/components/dashboard/BrandMentions";
import SentimentDashboard from "@/components/dashboard/Sentiment";

type Brand = {
    id: string;
    brand_name: string;
};

export default function DashboardPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

    useEffect(() => {
        async function loadBrands() {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE}/brands`,
                    { withCredentials: true }
                );
                const data = Array.isArray(res.data) ? res.data : [];
                setBrands(data);
                if (data.length > 0) {
                    setSelectedBrandId(data[0].id);
                }
            } catch {
                setBrands([]);
            }
        }

        loadBrands();
    }, []);

    const topBarBrands = useMemo(
        () => brands.map((b) => ({ id: b.id, name: b.brand_name })),
        [brands]
    );

    return (
        <div className="space-y-6">
            <TopBar
                brands={topBarBrands}
                selectedBrandId={selectedBrandId}
                onSelectBrand={setSelectedBrandId}
            />
            <KPIGrid />
            {selectedBrandId ? (
                <VisibilityOverview brandId={selectedBrandId} />
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
        </div>
    );
}