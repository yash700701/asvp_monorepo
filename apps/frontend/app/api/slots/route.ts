import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
});

const MAX_SLOTS = parseInt(process.env.NEXT_PUBLIC_MAX_INVITE_SLOTS || "10")


export async function GET() {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) FROM allowed_emails WHERE is_active = true`
        );

        const activeCount = parseInt(result.rows[0].count, 10);
        const remainingSlots = Math.max(MAX_SLOTS - activeCount, 0);

        return NextResponse.json({
            activeCount,
            remainingSlots,
            isFull: remainingSlots === 0,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch slots" },
            { status: 500 }
        );
    }
}
