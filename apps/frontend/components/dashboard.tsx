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


import { SidebarProvider, SidebarTrigger } from "@/components/ui/shadcn/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Dashboard() {
    return (
      <SidebarProvider className="bg-[#E8E8E3]">
        <AppSidebar />
        <main>
          <SidebarTrigger />
        </main>
      </SidebarProvider>
    );
}
