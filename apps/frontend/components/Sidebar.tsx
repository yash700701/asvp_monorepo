"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart, Search, Settings, Menu } from "lucide-react";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
  { name: "Brands", href: "/dashboard/brands", icon: BarChart },
  { name: "Queries", href: "/dashboard/queries", icon: Search },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  return (
    <aside
      className={`border-r bg-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image src="/logo_black.png" alt="Verity AI" width={24} height={24} unoptimized />
            <span className="font-semibold text-[#171717] text-sm">Verity AI</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={18} color="#000000" />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-sm text-[#171717] hover:bg-gray-100"
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
