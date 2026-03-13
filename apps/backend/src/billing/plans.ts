import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export const PLANS = {
    free: {
        run_limit: 100,
    },
    premium: {
        run_limit: 5000,
        payment_amount: 99900,
    },
    custom: {
        run_limit: 20000,
        payment_amount: 499900,
    },
} as const;

export type PlanKey = keyof typeof PLANS;
