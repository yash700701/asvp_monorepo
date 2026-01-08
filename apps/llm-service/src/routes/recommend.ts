import { Router } from "express";
import { getProvider } from "../providers";
import { getCacheKey, getCached, setCached } from "../cache/dedupe";

const router = Router();

router.post("/recommend", async (req, res) => {

    const cacheKey = getCacheKey(req.body);
    const cached = getCached(cacheKey);

    if (cached) {
        return res.json({ ...cached, cached: true });
    }

    const provider = getProvider();
    const result = await provider.recommend(req.body);

    setCached(cacheKey, result);

    res.json({ ...result, cached: false });
});

export default router;
