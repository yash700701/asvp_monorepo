import Image from "next/image";
import Link from "next/link";

// Reusable NavLink (simple version)
function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
        href={href}
        className="text-sm font-medium text-gray-700 hover:text-black transition"
        >
        {children}
        </Link>
    );
}

export default function Header() {
    return (
        <header className="w-full border-b bg-[#E8E8E3]/20 backdrop-blur-md fixed top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
            </div>
            <span className="text-2xl font-bold text-[#171717] tracking-tight">
                VerityAI
            </span>
            </Link>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/">Overview</NavLink>
            <NavLink href="/analytics/visibility">Visibility</NavLink>
            <NavLink href="/analytics/share-of-voice">Share of Voice</NavLink>
            <NavLink href="/alerts">Alerts</NavLink>
            <NavLink href="/recommendations">Recommendations</NavLink>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
            <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
            >
                Sign in
            </Link>

            <Link
                href="/get-started"
                className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition"
            >
                Get Started
            </Link>
            </div>
        </div>
        </header>
    );
}
