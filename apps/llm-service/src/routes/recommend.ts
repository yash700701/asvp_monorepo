import { Router } from "express";
import { getProvider } from "../providers";

const router = Router();

router.post("/recommend", async (req, res) => {
    const provider = getProvider();

    const result = await provider.recommend(req.body);

    res.json(result);
});

export default router;
