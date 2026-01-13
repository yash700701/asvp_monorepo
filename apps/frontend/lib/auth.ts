"use client";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function getCurrentUser() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
        cache: "no-store"
    });

    console.log("getCurrentUser response status:", res);
    if (!res.ok) return null;
    return res.json();
}

export function loginWithGoogle() {
    window.location.href = `${API_BASE}/auth/google`;
}

export async function logout() {
    await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });
}
