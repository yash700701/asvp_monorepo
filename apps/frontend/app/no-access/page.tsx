import Image from "next/image";

export default function NoAccessPage() {
    return (
        <main className="min-h-screen flex bg-[#E8E8E3] text-[#171717] items-center justify-center p-4">
            <div className="w-full max-w-md p-8 text-center space-y-6">
                <div className="space-y-2">
                    <div className="flex flex-col items-center space-y-3">
                        <Image
                            src="/logo_black.png"
                            alt="VerityAI Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Invite-only Access
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        We are currently onboarding a limited number of early users.
                    </p>
                </div>

                <div className="relative rounded-xl bg-[#F5F5F4] p-4 text-sm text-gray-600">
                    <div className="absolute -top-3 right-3 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
                        Slots available
                    </div>
                    <p>
                        <span className="font-medium text-gray-800">VerityAI</span> is in private beta.
                    </p>
                    <p className="mt-1">
                        To ensure quality and performance, we are allowing only
                        <span className="font-semibold text-gray-800"> 10 customers </span>
                        during this phase.
                    </p>
                </div>

                <form className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Work Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-900"
                    >
                        Request Access
                    </button>
                </form>

                <p className="text-xs text-gray-400">
                    We’ll review your request and get back to you if a slot opens up.
                    No spam, promise.
                </p>
            </div>
        </main>
    );
}
