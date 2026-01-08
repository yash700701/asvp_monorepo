import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const MIGRATIONS_DIR = path.join(__dirname);
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // required for Neon
});

async function ensureMigrationsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
    const res = await pool.query("SELECT filename FROM schema_migrations");
    return new Set(res.rows.map((r) => r.filename));
}

async function run() {
    console.log("🚀 Running DB migrations...");
    await ensureMigrationsTable();

    const applied = await getAppliedMigrations();

    const files = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => /^\d+_.*\.sql$/.test(f))
        .sort();

    for (const file of files) {
        if (applied.has(file)) {
        console.log(`⏭️  Skipping ${file}`);
        continue;
        }

        console.log(`➡️  Applying ${file}`);
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

        await pool.query("BEGIN");
        try {
        await pool.query(sql);
        await pool.query(
            "INSERT INTO schema_migrations (filename) VALUES ($1)",
            [file]
        );
        await pool.query("COMMIT");
        console.log(`✅ Applied ${file}`);
        } catch (err) {
        await pool.query("ROLLBACK");
        console.error(`❌ Failed ${file}`);
        throw err;
        }
    }

    await pool.end();
    console.log("🎉 Migrations complete");
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
