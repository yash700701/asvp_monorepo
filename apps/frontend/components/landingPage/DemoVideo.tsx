"use client";

export default function DemoSection() {
    return (
        <section className="py-10 text-[#171717]">
            <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-20 items-center">

                {/* LEFT SIDE */}
                <div>
                    <p className="text-sm italic text-zinc-500 mb-4">
                        See It In Action
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                        Watch how ASVP transforms
                        <br />
                        AI visibility.
                    </h2>

                    <p className="mt-6 text-lg text-zinc-600 max-w-md">
                        Discover how brands monitor AI mentions, track competitors,
                        and optimize their visibility across ChatGPT, Gemini, and
                        other generative AI platforms.
                    </p>

                    <button className="mt-8 px-6 py-3 bg-black text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition">
                        Start Free Trial
                    </button>
                </div>

                {/* RIGHT SIDE - VIDEO */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                        title="ASVP Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

            </div>
        </section>
    );
}
