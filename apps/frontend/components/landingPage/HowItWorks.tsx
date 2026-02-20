"use client";

export default function HowItWorks() {
    return (
        <section className="py-28 relative text-[#171717] ">

            <div className="max-w-7xl mx-auto px-6 md:px-20">

                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="text-zinc-600">How It</span> Works
                    </h2>
                    <p className="mt-6 text-lg text-zinc-600">
                        In two simple steps, ASVP reveals how AI sees your brand and helps you fix what’s holding you back.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    <div className="bg-white border rounded-2xl p-10 transition duration-300">

                        <div className="text-6xl font-extrabold text-primary/20 mb-6">
                            01
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">
                            Analyze AI Mentions
                        </h3>

                        <p className="text-zinc-600 leading-relaxed text-lg">
                            We query leading AI models to understand how they describe your brand,
                            what they recommend, and where competitors are outperforming you.
                        </p>

                    </div>

                    <div className="bg-gray-100 rounded-2xl p-10 transition duration-300">

                        <div className="text-6xl font-extrabold text-primary/20 mb-6">
                            02
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">
                            Optimize & Increase Visibility
                        </h3>

                        <p className="text-zinc-600 leading-relaxed text-lg">
                            Get actionable recommendations to improve your AI discoverability,
                            refine positioning, and ensure your brand appears in AI-driven responses.
                        </p>

                    </div>

                </div>
            </div>
        </section>
    );
}
