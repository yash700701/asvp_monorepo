import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export const FLAGS = {
    ENABLE_LLM_RECOMMENDATIONS:
        process.env.ENABLE_LLM_RECOMMENDATIONS === "true"
};
