import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/google`
    );
}
