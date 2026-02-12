import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signJWT } from "../auth/jwt";
import path from "path";
import dotenv from "dotenv";
import { db } from "../db/client";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const router = Router();

// Start Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login"
    }),
    async (req, res) => {
        const user = req.user as any;
        const token = signJWT(user);

        const email = user.email;

        const allowlistRes = await db.query(
            `
            SELECT id
            FROM allowed_emails
            WHERE email = $1
            AND is_active = true
            LIMIT 1
            `,
            [email]
        );

        if (allowlistRes.rows.length === 0) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/no-access`
            );
        }

        res.redirect(`http://localhost:3000/api/auth/callback?token=${token}`);
    }
);

// Current user
router.get("/me", (req, res) => {
    const token = req.cookies?.auth_token;
    console.log("Auth token from cookie:", req.cookies);
    console.log("Auth token from cookie:", token);
    if (!token) return res.status(401).json({ error: "unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        res.json(decoded);
    } catch {
        res.status(401).json({ error: "invalid token" });
    }
});

// Logout
router.post("/logout", (_req, res) => {
    res.clearCookie("auth_token");
    res.json({ success: true });
});

export default router;
