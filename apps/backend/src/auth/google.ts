import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db/client";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
        },
        async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) return done(new Error("No email"));

            // find or create customer (MVP: one customer per domain)
            const domain = email.split("@")[1];

            const customerResult = await db.query(
            `
            INSERT INTO customers (name)
            VALUES ($1)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            `,
            [domain]
            );

            const customerId = customerResult.rows[0].id;

            // find or create user
            const userResult = await db.query(
            `
            INSERT INTO users (email, name, provider, provider_id, customer_id)
            VALUES ($1, $2, 'google', $3, $4)
            ON CONFLICT (email)
            DO UPDATE SET provider_id = EXCLUDED.provider_id
            RETURNING *
            `,
            [email, profile.displayName, profile.id, customerId]
            );

            return done(null, userResult.rows[0]);
        } catch (err) {
            done(err);
        }
        }
    )
);
