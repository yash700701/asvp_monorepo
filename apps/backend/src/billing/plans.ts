export const PLANS = {
    free: {
        run_limit: 100,
    },
    pro: {
        run_limit: 5000,
        razorpay_plan_id: "plan_pro_monthly",
    },
    business: {
        run_limit: 20000,
        razorpay_plan_id: "plan_business_monthly",
    },
} as const;

export type PlanKey = keyof typeof PLANS;
