import Image from "next/image";

export default function BottomCTA() {
    return (
        <section className="relative px-4 pt-10 pb-20  text-[#171717]">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-linear-to-br from-black via-neutral-900 to-neutral-800 text-white shadow-2xl">

                <div className="grid items-center gap-10 p-10 md:grid-cols-2 md:p-16">

                    <div>
                        <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                            Dominate AI Search Results Before Your Competitors Do 🚀
                        </h2>

                        <p className="mt-4 text-neutral-300 text-lg">
                            ASVP helps brands track, optimize, and improve their visibility
                            across AI-powered search engines like ChatGPT, Gemini, and Perplexity.
                        </p>

                        <p className="mt-4 text-neutral-400">
                            Stop guessing. Start ranking where it actually matters.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="/get-started"
                                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
                            >
                                Get Started
                            </a>

                            <a
                                href="/how-it-works"
                                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                See How It Works
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative h-64 w-full md:h-80">
                            <Image
                                src="/asvp-dashboard.png"
                                alt="ASVP Dashboard Preview"
                                fill
                                className="rounded-2xl object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
