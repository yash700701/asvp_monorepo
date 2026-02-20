"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function FeedbackSection() {
    const [msg, setMsg] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const path = usePathname();

    async function submit() {
        if (!msg.trim()) return;

        try {
            setLoading(true);

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/feedback`,
                {
                    message: msg,
                    page: path,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setMsg("");
            setSubmitted(true);
        } catch (err) {
            console.error("Feedback submission failed", err);
            // optional: show toast / inline error
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white h-screen w-full">
            <section className="mx-auto pt-20 max-w-md rounded-2xl  p-8">
                {!submitted ? (
                    <>
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Help us build VerityAI with you
                            </h2>
                            <p className="text-sm text-gray-600">
                                Your feedback directly shapes what we build next.
                                If something feels confusing, missing, or frustrating —
                                we genuinely want to hear it.
                            </p>
                            <p className="text-xs text-gray-500">
                                Every message is read by the founding team.
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <textarea
                                rows={5}
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="What should we improve? What almost stopped you from continuing?"
                                className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <button
                                onClick={submit}
                                disabled={loading}
                                className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-60"
                            >
                                {loading ? "Sending…" : "Share feedback"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3 text-center">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Thank you for helping us improve
                        </h3>
                        <p className="text-sm text-gray-600">
                            Your feedback has been received and will directly influence
                            upcoming improvements.
                        </p>
                        <p className="text-xs text-gray-500">
                            We truly appreciate you taking the time.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
