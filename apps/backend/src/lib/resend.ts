import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

export const resend = new Resend(process.env.RESEND_API_KEY);
