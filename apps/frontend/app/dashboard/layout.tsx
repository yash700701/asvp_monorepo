"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#F5F5F4]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 text-[#171717] overflow-y-auto p-6">{children}</main>
        </div>
    );
}

// "use client"

// import { useEffect, useState } from "react";
// import api from "../lib/axios";
// import { getCurrentUser } from "@/lib/auth";

// export default function Dashboard() {
//     const [visibility, setVisibility] = useState<any[]>([]);
//     const [sov, setSov] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState<any | null>(null);

//     useEffect(() => {
//         getCurrentUser().then(setUser);
//     }, []);

//     useEffect(() => {
//         async function load() {
//         try {
//             const [visibilityRes, sovRes] = await Promise.all([
//             api.get("/analytics/visibility"),
//             api.get("/analytics/share-of-voice"),
//             ]);

//             setVisibility(visibilityRes.data);
//             setSov(sovRes.data);
//         } catch (err) {
//             console.error("Failed to load dashboard", err);
//         } finally {
//             setLoading(false);
//         }
//         }

//         load();
//     }, []);

//     return (
        
//         <main className="">
//         <div className="">
//             <main className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold">
//             AI Search Visibility Dashboard
//             </h1>
//             <div>{user ? user.email : "Guest"}</div>

//             <h1 className="text-2xl font-bold">
//             {/* Welcome, {user.email} */}
//             </h1>

//             <section>
//             <h2 className="text-lg font-semibold">
//                 Latest Visibility
//             </h2>
//             <pre className=" p-4 rounded">
//                 {JSON.stringify(visibility.slice(0, 3), null, 2)}
//             </pre>
//             </section>

//             <section>
//             <h2 className="text-lg font-semibold">
//                 Share of Voice
//             </h2>
//             <pre className="p-4 rounded">
//                 {JSON.stringify(sov.slice(0, 3), null, 2)}
//             </pre>
//             </section>
//         </main>
//         </div>

//         </main>
        
//     );
// }



// import { fetchJSON } from "../../lib/axios";
// import { Badge } from "../../components/Badge";

// function priorityColor(priority: string) {
//   switch (priority) {
//     case "high":
//       return "red";
//     case "medium":
//       return "yellow";
//     case "low":
//       return "green";
//     default:
//       return "gray";
//   }
// }

// export default async function RecommendationsPage() {
//   const recs = await fetchJSON<any[]>("/recommendations");

//   return (
//     <section className="p-6 space-y-6">
//       <h1 className="text-xl font-bold">Recommendations</h1>

//       {recs.length === 0 && <div className="text-gray-500">No recommendations yet.</div>}

//       <ul className="space-y-4">
//         {recs.map((r) => {
//           const isLLM = r.type === "llm_recommendation";

//           return (
//             <li key={r.id} className="bg-white border rounded p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Badge label={r.priority.toUpperCase()} color={priorityColor(r.priority)} />
//                 <Badge
//                   label={isLLM ? "AI-Generated" : "Rule-Based"}
//                   color={isLLM ? "purple" : "blue"}
//                 />
//               </div>

//               <p className="text-sm text-gray-800">{r.message}</p>
//             </li>
//           );
//         })}
//       </ul>
//     </section>
//   );
// }

