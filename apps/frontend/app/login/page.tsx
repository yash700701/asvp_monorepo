"use client";

import { loginWithGoogle } from "../../lib/auth";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded p-8 space-y-6">
            <h1 className="text-xl font-bold">
            Sign in to ASVP
            </h1>

            <button
            onClick={loginWithGoogle}
            className="w-full bg-black text-white px-4 py-2 rounded"
            >
            Sign in with Google
            </button>
        </div>
        </main>
    );
}
