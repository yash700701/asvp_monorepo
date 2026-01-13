import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
        return NextResponse.redirect("/login");
    }

    const res = NextResponse.redirect(
        new URL("/", req.url)
    );

    // Cookie is now set by Next.js (same origin)
    res.cookies.set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax", // no cross-site now
        secure: false,   // localhost
        path: "/",
    });

    return res;
}
