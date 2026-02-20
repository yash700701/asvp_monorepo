"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { InteractiveGridPattern } from "../ui/magic/interactive-grid-pattern"

export default function Hero() {
    const router = useRouter();

    return (
        <section className="relative overflow-hidden text-[#171717]">

            <InteractiveGridPattern
                className={cn(
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[130%] skew-y-12 -z-10"
                )}
            />

            <div className="max-w-6xl mx-auto px-6 z-10 py-28 text-center">

                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
                    AI Search Visibility Platform
                </div>

                <h1 className="text-5xl manrope.className sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
                    <span className="text-zinc-600">If AI Doesn’t</span> Mention You,
                    <span className="text-(--primary)">
                        You Don’t Exist.
                    </span>
                </h1>

                <p className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl text-zinc-700 leading-relaxed">
                    VerityAI reveals how AI models talk about your brand —
                    and shows exactly what to fix when competitors take your place.
                </p>

                <div className="mt-12 flex justify-center gap-4 ">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 bg-(--primary) hover:bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Get Started
                    </button>

                    <button className="px-4 py-2 border border-zinc-400 hover:border-zinc-600 rounded-xl font-semibold transition-all duration-300">
                        See How It Works →
                    </button>
                </div>

            </div>
        </section>
    );
}
