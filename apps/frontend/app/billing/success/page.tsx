export default function BillingSuccessPage() {
    return (
        <main className="min-h-screen bg-[#f7f5ef] px-6 flex items-center justify-center text-[#171717]">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center space-y-4">
                <h1 className="text-2xl font-semibold">Subscription created</h1>
                <p className="text-sm text-zinc-600">
                    Payment was submitted successfully. Your account will switch plans after the Razorpay webhook is received and verified.
                </p>
                <a
                    href="dashboard/usage"
                    className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    Go to dashboard
                </a>
            </div>
        </main>
    );
}
