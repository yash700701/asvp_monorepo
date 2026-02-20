"use client";

import { BarChart3, Brain, Eye, TrendingUp, ShieldCheck } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="py-10 text-[#171717]">
            <div className="max-w-7xl mx-auto px-6 md:px-20">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="text-zinc-600">Why</span> modern brands <span className="text-zinc-600">use</span> VerityAi.
                    </h2>
                    <p className="mt-6 text-lg text-zinc-600">
                        Understand how AI models perceive your brand and take control of your visibility before competitors outrank you.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* TOP ROW */}
                    <div className="col-span-12 md:col-span-3 h-[220px] bg-gray-100 rounded-2xl p-8 transition flex flex-col">
                        <Eye className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-xl font-semibold mb-3">Competitive Intelligence</h3>
                        <p className="text-zinc-600">
                            See why AI suggests competitors and uncover.
                        </p>
                    </div>

                    <div className="col-span-12 md:col-span-6 h-[220px] bg-gray-100 rounded-2xl p-8 transition flex flex-col">
                        <Brain className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-2xl font-semibold mb-4">
                            AI Model Visibility Tracking
                        </h3>
                        <p className="text-zinc-600 leading-relaxed">
                            Monitor how ChatGPT, Gemini, and other AI systems describe your brand.
                        </p>
                    </div>

                    <div className="col-span-12 md:col-span-3 h-[220px] bg-white border rounded-2xl p-8 transition flex flex-col">
                        <BarChart3 className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                        <p className="text-zinc-600">
                            Get step-by-step recommendations to improve AI discoverability.
                        </p>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="col-span-12 md:col-span-6 h-[220px] bg-white rounded-2xl p-8 border transition flex flex-col">
                        <TrendingUp className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-2xl font-semibold mb-4">
                            Growth-Driven Optimization
                        </h3>
                        <p className="text-zinc-600 leading-relaxed">
                            Align your content, authority, and positioning to increase AI-generated mentions.
                        </p>
                    </div>

                    <div className="col-span-12 md:col-span-6 h-[220px] bg-gray-100 rounded-2xl p-8 transition flex flex-col">
                        <ShieldCheck className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-2xl font-semibold mb-4">
                            Brand Protection
                        </h3>
                        <p className="text-zinc-600 leading-relaxed">
                            Detect misinformation or incorrect AI responses instantly.
                        </p>
                    </div>

                </div>






            </div>
        </section>
    );
}
