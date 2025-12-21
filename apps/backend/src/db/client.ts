import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // required for Neon
});

(async () => {
    try {
        const res = await db.query("SELECT 1");
        console.log("Connected to Neon Postgres");
    } catch (err) {
        console.error("Neon connection failed", err);
    }
})();
