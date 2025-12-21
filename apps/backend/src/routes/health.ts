import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
    res.json({ status: "ok", service: "asvp-backend" });
});

export default router;
