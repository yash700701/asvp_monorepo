import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";

export const llmRateLimiter: RequestHandler = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,             // 30 requests per minute
    standardHeaders: true,
    legacyHeaders: false
});
