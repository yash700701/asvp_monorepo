import express from "express";
import cors from "cors";
import healthRoute from "../routes/health";
import brandsRoute from "../routes/brands";

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routes
    app.use("/health", healthRoute);
    app.use("/brands", brandsRoute);

    return app;
};
