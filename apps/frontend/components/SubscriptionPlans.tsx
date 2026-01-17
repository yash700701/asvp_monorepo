import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Check } from "lucide-react";

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
        },
    ];

    return (
        <section className="py-20 bg-[#E8E8E3] text-[#171717]">
        <div className="max-w-7xl mx-auto px-5 text-center">
            <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-14">
            Choose a plan that fits your AI search visibility goals.
            </p>

            <div className="grid gap-8 md:grid-cols-3 items-end">
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
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm px-4 py-1 rounded-full text-[#E8E8E3] bg-[#44413E]">
                    Most Popular
                    </span>
                )}

                <CardHeader className="text-center space-y-2">
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
                        <li
                        key={feature}
                        className="flex items-center gap-2"
                        >
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                        </li>
                    ))}
                    </ul>

                    <Button
                    className={`w-full rounded-xl cursor-pointer ${
                        plan.popular
                        ? "bg-primary border hover:bg-primary/90"
                        : "variant-outline text-[#E8E8E3]"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    >
                    {plan.name === "Custom"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
        </section>
    );
}
