// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import Dashboard from "@/components/dashboard";

// export default async function DashboardPage() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("auth_token")?.value;

//     if (!token) {
//         redirect("/signin");
//     }

//     try {
//         jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
//     } catch {
//         redirect("/signin");
//     }

//     return <Dashboard />;
// }

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Welcome to Verity AI dashboard.</p>
    </div>
  );
}

