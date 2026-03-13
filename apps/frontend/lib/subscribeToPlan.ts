import axios from "axios";

export async function subscribeToPlan(plan: "premium" | "custom") {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/billing/subscribe`,
        { plan },
        { withCredentials: true }
    );

    return res.data as {
        payment_link_id: string;
        payment_url: string;
    };
}
