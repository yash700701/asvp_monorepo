"use client";

import axios from "axios";

// Axios instance for same-origin (Next.js BFF)
const api = axios.create({
  withCredentials: true, // send cookies
});

export async function getCurrentUser() {
    try {
        const res = await api.get("/api/backend/me", {
        headers: {
            "Cache-Control": "no-store",
        },
        });

        console.log("getCurrentUser response status:", res.status);
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
        return null;
        }
        throw err;
    }
}

export function loginWithGoogle() {
    window.location.href = "/api/auth/google";
}

export async function logout() {
    await api.post("/api/auth/logout");
}
