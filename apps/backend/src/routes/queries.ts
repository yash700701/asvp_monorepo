import { Router } from "express";
import { db } from "../db/client";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * POST /queries
 * body: {
 *   query_text: string,
 *   query_type: "brand" | "category" | "competitor",
 *   frequency?: "daily" | "weekly" | "manual"
 * }
 */
router.post("/", requireAuth, async (req, res) => {
    const { query_text, query_type, frequency = "daily" } = req.body;

    if (!query_text || !query_type) {
        return res.status(400).json({ error: "query_text and query_type are required" });
    }

    if (!["brand", "category", "competitor"].includes(query_type)) {
        return res.status(400).json({ error: "Invalid query_type" });
    }

    if (!["daily", "weekly", "manual"].includes(frequency)) {
        return res.status(400).json({ error: "Invalid frequency" });
    }

    try {
        const result = await db.query(
        `
        INSERT INTO queries (
            customer_id,
            query_text,
            query_type,
            frequency
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [req.user!.customer_id, query_text, query_type, frequency]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /queries
 */
router.get("/", requireAuth, async (req, res) => {
    const result = await db.query(
        `
        SELECT *
        FROM queries
        WHERE customer_id = $1
        ORDER BY created_at DESC
        `,
        [req.user!.customer_id]
    );

    res.json(result.rows);
});

/**
 * GET /queries/:id
 */
router.get("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        SELECT *
        FROM queries
        WHERE id = $1 AND customer_id = $2
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    res.json(result.rows[0]);
});

/**
 * DELETE /queries/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        DELETE FROM queries
        WHERE id = $1 AND customer_id = $2
        RETURNING id
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Query not found" });
    }

    res.json({ deleted: true });
});

export default router;
