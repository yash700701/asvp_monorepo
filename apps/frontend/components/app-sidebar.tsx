"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/shadcn/sidebar";
import Image from "next/image";
import logo from "../public/logo_white.png";

export function AppSidebar() {
    return (
      <Sidebar className="bg-[#44413E]">
        <SidebarHeader />
        <div className="flex items-center gap-2 px-5">
          <Image src={logo} alt="Logo" width={36} height={36} className="" />
          <h1 className="text-2xl">Verity AI</h1>
        </div>
        <SidebarContent>
          <SidebarGroup />
          <div className="px-6 flex flex-col gap-4 mt-4 items-start">
            <button className="border px-4 py-1 rounded-lg">visibility</button>
            <button className="border px-4 py-1 rounded-lg">Share of Voice</button>
            <button className="border px-4 py-1 rounded-lg">Alerts</button>
            <button className="border px-4 py-1 rounded-lg">Recommendations</button>
          </div>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    );
}
