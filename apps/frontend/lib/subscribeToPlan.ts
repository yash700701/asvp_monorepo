import axios from "axios";

export async function subscribeToPlan(plan: "pro" | "business") {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/billing/subscribe`,
        { plan },
        { withCredentials: true }
    );

    return res.data as {
        subscription_id: string;
        payment_url: string;
    };
}
