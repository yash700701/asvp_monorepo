"use client";

import { BarChart3, Brain, Eye, TrendingUp, ShieldCheck } from "lucide-react";

export default function BenefitsSection() {
    return (
        <section className="py-10 text-[#171717]">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Why modern brands use ASVP
                    </h2>
                    <p className="mt-6 text-lg text-zinc-600">
                        Understand how AI models perceive your brand and take control of your visibility before competitors outrank you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">

                    <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
                        <Brain className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-2xl font-semibold mb-4">
                            AI Model Visibility Tracking
                        </h3>
                        <p className="text-zinc-600 leading-relaxed">
                            Monitor how ChatGPT, Gemini, and other AI systems describe your brand.
                            Discover gaps before your competitors dominate AI-driven recommendations.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
                        <Eye className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-xl font-semibold mb-3">
                            Competitive Intelligence
                        </h3>
                        <p className="text-zinc-600">
                            See why AI suggests competitors and uncover the content signals driving it.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
                        <BarChart3 className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-xl font-semibold mb-3">
                            Actionable Insights
                        </h3>
                        <p className="text-zinc-600">
                            Get step-by-step recommendations to improve AI discoverability.
                        </p>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
                        <TrendingUp className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-2xl font-semibold mb-4">
                            Growth-Driven Optimization
                        </h3>
                        <p className="text-zinc-600 leading-relaxed">
                            Align your content, authority, and positioning to increase AI-generated mentions and brand visibility across major models.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
                        <ShieldCheck className="w-8 h-8 mb-6 text-primary" />
                        <h3 className="text-xl font-semibold mb-3">
                            Brand Protection
                        </h3>
                        <p className="text-zinc-600">
                            Detect misinformation or incorrect AI responses about your brand instantly.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
