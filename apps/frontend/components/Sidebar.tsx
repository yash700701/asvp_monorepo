"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart, Search, Settings, Menu } from "lucide-react";
import clsx from "clsx";

const items = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart },
    { name: "Brands", href: "/dashboard/brands", icon: BarChart },
    { name: "Queries", href: "/dashboard/queries", icon: Search },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Alerts", href: "/dashboard/alerts", icon: BarChart },
    { name: "Recommendations", href: "/dashboard/recommendations", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
    collapsed,
    setCollapsed,
}: {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };


    return (
        <>
            {/* ================= MOBILE TOP NAV ================= */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-white">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-3 hover:opacity-90 transition"
                >
                    <Image
                        src="/logo_black.png"
                        alt="Verity AI"
                        width={26}
                        height={26}
                        unoptimized
                    />
                    <span className="font-semibold text-lg text-[#171717]">
                        Verity AI
                    </span>
                </Link>

                {/* Scrollable Nav */}
                <nav className="flex items-center gap-2 overflow-x-auto px-2 pb-2 scrollbar-hide">
                    {items.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition",
                                    active
                                        ? "bg-gray-100 text-[#171717]"
                                        : "text-[#171717] hover:bg-gray-100"
                                )}
                            >
                                <item.icon size={18} />
                                <span className="whitespace-nowrap">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside
                className={clsx(
                    "hidden md:block h-screen border-r bg-white transition-all duration-300",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Top */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo_black.png"
                                alt="Verity AI"
                                width={24}
                                height={24}
                                unoptimized
                            />
                            <span className="font-semibold text-sm text-[#171717]">
                                Verity AI
                            </span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)}>
                        <Menu size={18} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="mt-4 space-y-1">
                    {items.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2 text-sm transition",
                                    active
                                        ? "bg-gray-100 text-[#171717]"
                                        : "text-[#171717] hover:bg-gray-100"
                                )}
                            >
                                <item.icon size={18} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
