"use client";

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t text-[#E8E8E3]">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 py-8">
                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo_white.png"
                            alt="ASVP Logo"
                            width={64}
                            height={64}
                            className="h-12 w-12 md:h-16 md:w-16"
                            unoptimized
                        />
                        <span className="font-semibold text-2xl md:text-4xl">
                            Verity AI
                        </span>
                    </div>

                    {/* Center */}
                    <div className="text-xs md:text-sm opacity-80">
                        Verity AI. All rights reserved. © 2026
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://www.linkedin.com/company/verity-ai"
                            target="_blank"
                            aria-label="LinkedIn"
                            className="opacity-80 hover:opacity-100 transition"
                        >
                            <img src="/linkedin.png" alt="LinkedIn" className="h-5 md:h-6" />
                        </a>

                        <a
                            href="https://x.com/verity_ai"
                            target="_blank"
                            aria-label="X"
                            className="opacity-80 hover:opacity-100 transition"
                        >
                            <img src="/twitter.png" alt="X" className="h-5 md:h-6" />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}
