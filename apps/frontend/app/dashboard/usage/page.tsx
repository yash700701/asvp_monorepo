"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UsageBar } from "@/components/UsageBar";
import PricingSection from "@/components/landingPage/SubscriptionPlans";
import Loading from "@/components/Loading";

type UsageResponse = {
    plan: "free" | "pro" | "enterprise";
    used: number;
    limit: number;
};

const PLAN_DETAILS: Record<
    string,
    {
        name: string;
        description: string;
        price: string;
        features: string[];
    }
> = {
    free: {
        name: "Free",
        description: "For trying out AI visibility tracking",
        price: "₹0 / month",
        features: ["Up to 100 query runs", "Basic analytics", "Community support"],
    },
    pro: {
        name: "Pro",
        description: "For growing brands",
        price: "₹2,999 / month",
        features: [
            "Up to 10,000 query runs",
            "Advanced analytics",
            "Recommendations",
            "Priority support",
        ],
    },
    enterprise: {
        name: "Enterprise",
        description: "For large teams & agencies",
        price: "Custom pricing",
        features: [
            "Unlimited runs",
            "Custom integrations",
            "Dedicated support",
            "SLA",
        ],
    },
};

export default function BillingUsagePage() {
    const [usage, setUsage] = useState<UsageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPricing, setShowPricing] = useState(false);

    const pricingRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE}/billing/usage`, {
                withCredentials: true,
            })
            .then((res) => setUsage(res.data))
            .catch(() => setError("Failed to load usage"))
            .finally(() => setLoading(false));
    }, []);

    // Scroll when pricing becomes visible
    useEffect(() => {
        if (showPricing && pricingRef.current) {
            pricingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [showPricing]);

    const plan = usage ? PLAN_DETAILS[usage.plan] : null;

    return (
        <main className="max-w-3xl pt-28 sm:pt-0 space-y-2">
            <h1 className="text-2xl font-bold">Usage & Billing</h1>

            {/* ================= Usage ================= */}
            <section className="border rounded-lg p-4 space-y-3">
                <h2 className="text-lg font-semibold">Usage</h2>

                {loading && (
                    <div className="pt-2">
                        <Loading />
                    </div>
                )}

                {!loading && error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {!loading && usage && (
                    <UsageBar used={usage.used} limit={usage.limit} />
                )}
            </section>

            {/* ================= Current Plan ================= */}
            {usage && plan && (
                <section className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Current Plan</h2>

                        {usage.plan !== "enterprise" && (
                            <button
                                onClick={() => setShowPricing(true)}
                                className="text-sm px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
                            >
                                Upgrade
                            </button>
                        )}
                    </div>

                    <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-600">{plan.description}</div>
                        <div className="mt-1 text-sm font-semibold">{plan.price}</div>
                    </div>

                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {plan.features.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* ================= Pricing ================= */}
            {showPricing && (
                <section ref={pricingRef} className="pt-5">
                    <PricingSection />
                </section>
            )}
        </main>
    );
}
