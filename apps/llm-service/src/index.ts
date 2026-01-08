import express from "express";
import { llmRateLimiter } from "./middleware/rateLimit";
import dotenv from "dotenv";
import recommendRoute from "./routes/recommend";

dotenv.config();

const app = express();
app.use(express.json());
app.use(llmRateLimiter);

app.use("/", recommendRoute);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`LLM service running on port ${port}`);
});
