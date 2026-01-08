import crypto from "crypto";

const cache = new Map<string, { value: any; expiresAt: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCacheKey(payload: any): string {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex");
}

export function getCached(key: string) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

export function setCached(key: string, value: any) {
    cache.set(key, {
        value,
        expiresAt: Date.now() + TTL_MS
    });
}
