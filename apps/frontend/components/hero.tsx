"use client"

import React from 'react'
import { useRouter } from "next/navigation";

function Hero() {
    const router = useRouter();
    return (
        <div>
            <section className="relative overflow-hidden bg-[#E8E8E3] text-[#171717]">
                <div className="max-w-7xl mx-auto px-6 py-24">

                    {/* Left */}
                    <div>
                    <h1 className="text-9xl leading-28 font-extrabold">
                        If AI Doesn’t Mention You, <span className='text-[#44413E]'>You Don’t Exist.</span>
                    </h1>

                    <p className="mt-6 text-3xl text-zinc-700">
                        VerityAI reveals how AI models talk about your brand—and what to fix when competitors take your place.
                    </p>

                    <div className="mt-10 flex gap-4">
                        <button onClick={() => router.push("/dashboard")} className="px-6 py-3 cursor-pointer bg-[#44413E] hover:bg-[#171717] text-zinc-50 rounded-xl font-semibold">
                        Get Started
                        </button>
                        <button className="px-6 py-3 cursor-pointer border border-gray-600 rounded-xl">
                        See How It Works →
                        </button>
                    </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Hero