import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const res = await fetch("http://localhost:4000/auth/me", {
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
