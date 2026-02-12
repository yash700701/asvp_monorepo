import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export interface JwtUser {
    user_id: string;
    customer_id: string;
    email: string;
}

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.auth_token;
    if (!token) {
        console.log("middleware error")
        return res.status(401).json({ error: "unauthenticated" });
    }

    try {
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
        ) as Express.User;

        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "invalid_token" });
    }
}
