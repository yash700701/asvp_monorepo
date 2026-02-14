"use client";

import Image from "next/image";

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "ASVP completely changed how we approach AI visibility.",
        img: "/user.png",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "We discovered competitors outranking us in AI models.",
        img: "/user.png",
    },
    {
        name: "John",
        username: "@john",
        body: "The insights are incredibly actionable.",
        img: "/user.png",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "AI search visibility is the new SEO.",
        img: "/user.png",
    },
];

function ReviewCard({ img, name, username, body }: any) {
    return (
        <div className="w-72 mx-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center gap-3">
                <Image
                    src={img}
                    alt={name}
                    width={36}
                    height={36}
                    className="rounded-full"
                />
                <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-zinc-500">{username}</p>
                </div>
            </div>
            <p className="mt-4 text-sm text-zinc-600">{body}</p>
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="py-24 text-[#171717]">

            <div className="text-center max-w-3xl mx-auto mb-16 px-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Brands Winning in AI Search Use ASVP
                </h2>
                <p className="mt-6 text-lg text-zinc-600">
                    See how growth teams are increasing their visibility across AI models
                    and outperforming competitors in AI-driven recommendations.
                </p>
            </div>

            <div className="relative overflow-hidden">

                <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-linear-to-r from-[#F7F7F4] to-transparent z-10" />

                <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-linear-to-l from-[#F7F7F4] to-transparent z-10" />

                <div className="space-y-5 py-5">
                    <div className="flex w-max animate-scroll-left">
                        {[...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`left-${i}`} {...review} />
                        ))}
                    </div>

                    <div className="flex w-max animate-scroll-right">
                        {[...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`right-${i}`} {...review} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}


