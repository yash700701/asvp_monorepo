"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Check } from "lucide-react";
import { subscribeToPlan } from "@/lib/subscribeToPlan";

export default function PricingSection() {
    const plans = [
        {
            name: "Free",
            price: "₹0",
            description: "Get started and explore basic visibility.",
            features: [
                "Limited keywords tracking",
                "Basic AI visibility score",
                "Weekly updates",
                "Community support",
            ],
            popular: false,
            action: null,
        },
        {
            name: "Basic",
            price: "₹999 / month",
            description: "Best for startups and growing brands.",
            features: [
                "Track up to 50 keywords",
                "AI Search Visibility Dashboard",
                "Share of Voice analytics",
                "Daily updates",
                "Email support",
            ],
            popular: true,
            action: "pro" as const,
        },
        {
            name: "Custom",
            price: "Contact Us",
            description: "Advanced needs & enterprise scale.",
            features: [
                "Unlimited keywords",
                "Multi-brand tracking",
                "Custom AI reports",
                "API access",
                "Dedicated support",
            ],
            popular: false,
            action: "contact",
        },
    ];

    async function handleSubscribe(plan: "pro") {
        try {
            const { payment_url } = await subscribeToPlan(plan);
            window.location.href = payment_url; 
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to start subscription");
        }
    }

    return (
        <section className="py-16 text-[#171717]">
            <div className="max-w-7xl mx-auto px-5 text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-14">
                    Choose a plan that fits your AI search visibility goals.
                </p>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-end">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg ${
                                plan.popular
                                    ? "scale-105 border-primary shadow-xl"
                                    : "border-muted"
                            }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#44413E] text-[#E8E8E3] text-xs px-4 py-1 rounded-full">
                                    Most Popular
                                </span>
                            )}

                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-semibold">
                                    {plan.name}
                                </CardTitle>
                                <p className="text-3xl font-bold">{plan.price}</p>
                                <p className="text-muted-foreground text-sm">
                                    {plan.description}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.action === "pro" && (
                                    <Button
                                        className="w-full border cursor-pointer rounded-xl"
                                        onClick={() => handleSubscribe("pro")}
                                    >
                                        Get Started
                                    </Button>
                                )}

                                {plan.action === "contact" && (
                                    <Button variant="outline" className="w-full rounded-xl cursor-pointer text-zinc-200">
                                        Contact Sales
                                    </Button>
                                )}

                                {!plan.action && (
                                    <Button disabled className="w-full border rounded-xl">
                                        Current Plan
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
