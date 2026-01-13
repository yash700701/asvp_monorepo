"use client";

import { loginWithGoogle } from "../../lib/auth";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#E8E8E3]">
        <div className="bg-white border rounded-3xl border-[#171717] p-8 space-y-2">
            <h1 className="text-sm text-[#171717] font-bold">
            Sign in to ASVP
            </h1>

            <button
            onClick={loginWithGoogle}
            className="w-full bg-black text-white px-4 py-2 rounded-xl"
            >
            Sign in with Google
            </button>
        </div>
        </main>
    );
}
