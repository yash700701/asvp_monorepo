"use client";

import Image from "next/image";

const logos = [
    "/logo_black.png",
    "/logo_black.png",
    "/logo_black.png",
    "/logo_black.png",
    "/logo_black.png",
];

export default function PartnersSection() {
    return (
        <section className="w-full text-[#171717] pb-20 pt-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-12">
                    Delivering results for
                </h2>

                <div className="relative overflow-hidden">

                    <div className="absolute left-0 top-0 h-full w-24 bg-linear-to-r from-[#F7F7F4] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-[#F7F7F4] to-transparent z-10 pointer-events-none" />

                    <div className="flex w-max animate-scroll">
                        {[...logos, ...logos].map((logo, i) => (
                            <div key={i} className="mx-12 flex items-center">
                                <Image
                                    src={logo}
                                    alt="partner logo"
                                    width={120}
                                    height={40}
                                    className="h-20 w-auto object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
