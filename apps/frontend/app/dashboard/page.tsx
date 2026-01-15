import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Dashboard from "@/components/dashboard";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/signin");
    }

    try {
        jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
    } catch {
        redirect("/signin");
    }

    return <Dashboard />;
}
