"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
    BrandSelectionProvider,
    useBrandSelection,
} from "@/components/dashboard/BrandSelectionContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const { selectedBrand } = useBrandSelection();

    return (
        <div className="flex h-screen bg-white">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                selectedBrandName={selectedBrand?.brand_name || null}
                selectedBrandLogoUrl={selectedBrand?.logo_url || null}
            />
            <main className="flex-1 text-[#171717] overflow-y-auto p-4">{children}</main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <BrandSelectionProvider>
            <DashboardShell>{children}</DashboardShell>
        </BrandSelectionProvider>
    );
}
