"use client";

import Image from "next/image";
import Link from "next/link";
import { loginWithGoogle } from "../../lib/auth";

export default function SigninPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">

        {/* Left Image */}
        <div className="relative hidden lg:block">
            <Image
            src="/logan-voss-PAoo2lm4m0k-unsplash.jpg"
            alt="Verity AI"
            fill
            className="object-cover"
            priority
            />
        </div>

        {/* Right Content */}
        <div className="flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
                <Image src="/logo_black.png" alt="Verity AI" width={28} height={28} unoptimized />
                <span className="text-lg font-semibold text-[#171717]">
                Verity AI
                </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-[#171717]">
                Welcome back
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
                Sign in to continue to your dashboard.
            </p>

            {/* Google Sign In */}
            <button
                onClick={loginWithGoogle}
                className="mt-5 w-full cursor-pointer text-[#171717] flex items-center justify-center gap-2 rounded-lg border  bg-white py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
                <Image src="/google.png" unoptimized alt="Google" width={16} height={16} />
                Sign in with Google
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <div className="h-px w-full bg-gray-300" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px w-full bg-gray-300" />
            </div>

            {/* Email Sign In */}
            <form className="space-y-3">
                <div>
                <label className="block text-xs font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#44413E]"
                />
                </div>

                <div>
                <label className="block text-xs font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#44413E]"
                />
                </div>

                <div className="flex justify-end text-xs">
                <Link
                    href="/forgot-password"
                    className="text-[#44413E] hover:underline"
                >
                    Forgot password?
                </Link>
                </div>

                <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-lg bg-[#44413E] py-2.5 text-sm font-semibold text-white hover:bg-[#171717] transition"
                >
                Sign In
                </button>
            </form>

            {/* Footer */}
            <p className="mt-5 text-center text-xs text-gray-600">
                Don’t have an account?{" "}
                <Link
                href="/signup"
                className="font-medium underline text-[#44413E] hover:underline"
                >
                Sign up
                </Link>
            </p>

            </div>
        </div>
        </div>
    );
}
