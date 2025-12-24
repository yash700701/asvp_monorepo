import axios from "axios";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

const LLM_BASE_URL = process.env.LLM_SERVICE_URL || "http://localhost:5050";
const LLM_TIMEOUT_MS = 10_000;

export async function callLLMRecommend(payload: any) {
    const res = await axios.post(`${LLM_BASE_URL}/recommend`, payload, {
        timeout: LLM_TIMEOUT_MS
    });
    return res.data;
}
