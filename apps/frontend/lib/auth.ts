"use client";

import api from "../lib/axios";

export async function getCurrentUser() {
    try {
        const res = await api.get("/api/backend/me", {
        headers: {
            "Cache-Control": "no-store",
        },
        });
        
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
