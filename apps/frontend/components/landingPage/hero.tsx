"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    return (
        <section className="relative overflow-hidden bg-[#F7F7F4] text-[#171717]">

            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-200 h-200 bg-[#44413E]/10 blur-3xl rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-28 text-center">

                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
                    AI Search Visibility Platform
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
                    If AI Doesn’t Mention You,
                    <br />
                    <span className="text-(--primary)">
                        You Don’t Exist.
                    </span>
                </h1>

                <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl text-zinc-700 leading-relaxed">
                    VerityAI reveals how AI models talk about your brand —
                    and shows exactly what to fix when competitors take your place.
                </p>

                <div className="mt-12 flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-8 py-4 bg-(--primary) hover:bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Get Started
                    </button>

                    <button className="px-8 py-4 border border-zinc-400 hover:border-zinc-600 rounded-xl font-semibold transition-all duration-300">
                        See How It Works →
                    </button>
                </div>

            </div>
        </section>
    );
}
