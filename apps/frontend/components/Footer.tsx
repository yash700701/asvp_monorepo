"use client";

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex items-center justify-between border-t px-6 py-10 text-sm text-[#E8E8E3]">
        {/* Left */}
        <div className="flex items-center gap-2">
            <Image src="/logo_white.png" alt="ASVP Logo" width={10} height={10} className="h-16 w-16" unoptimized />
            <span className="font-semibold text-4xl">Verity AI</span>
        </div>

        {/* Center */}
        <div>
            Verity AI. All rights reserved. © 2026
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
            <a
            href="https://www.linkedin.com/company/verity-ai"
            target="_blank"
            aria-label="LinkedIn"
            >
            <img src="/linkedin.png" alt="LinkedIn" className="h-6 opacity-80 hover:opacity-100" />
            </a>

            <a
            href="https://x.com/verity_ai"
            target="_blank"
            aria-label="X"
            >
            <img src="/twitter.png" alt="X" className="h-6 opacity-80 hover:opacity-100" />
            </a>
        </div>
        </footer>
    );
}
