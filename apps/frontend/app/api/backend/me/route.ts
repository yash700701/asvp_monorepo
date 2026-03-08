import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
        credentials: "include", 
        headers: {
        cookie: req.headers.get("cookie") || "",
        },
    });

    if (!res.ok) {
        return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
        );
    }

    const data = await res.json();
    return NextResponse.json(data);
}
