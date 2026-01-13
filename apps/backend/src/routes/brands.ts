import { Router } from "express";
import { db } from "../db/client";

const router = Router();

/**
 * POST /brands
 * body: { brand_name: string, canonical_urls: string[] }
 */
router.post("/", async (req, res) => {
    const { brand_name, canonical_urls } = req.body;

    if (!brand_name || !Array.isArray(canonical_urls)) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    try {
        const result = await db.query(
        `
        INSERT INTO brands (customer_id, brand_name, canonical_urls)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [req.user!.customer_id, brand_name, canonical_urls]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        if (err.code === "23505") {
        return res.status(409).json({ error: "Brand already exists" });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /brands
 */
router.get("/", async (req, res) => {
    const result = await db.query(
        `
        SELECT * FROM brands
        WHERE customer_id = $1
        ORDER BY created_at DESC
        `,
        [req.user!.customer_id]
    );

    res.json(result.rows);
});

/**
 * GET /brands/:id
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        SELECT * FROM brands
        WHERE id = $1 AND customer_id = $2
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Brand not found" });
    }

    res.json(result.rows[0]);
});

/**
 * DELETE /brands/:id
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await db.query(
        `
        DELETE FROM brands
        WHERE id = $1 AND customer_id = $2
        RETURNING id
        `,
        [id, req.user!.customer_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Brand not found" });
    }

    res.json({ deleted: true });
});

export default router;
