import { NextResponse } from "next/server";

export async function GET() {
    // Redirect browser to backend OAuth
    return NextResponse.redirect(
        "http://localhost:4000/auth/google"
    );
}
