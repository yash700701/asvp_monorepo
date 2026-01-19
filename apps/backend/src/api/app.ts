import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import "../auth/google";
import healthRoute from "../routes/health";
import brandsRoute from "../routes/brands";
import queriesRoute from "../routes/queries";
import analyticsVisibilityRoute from "../routes/analyticsVisibility";
import analyticsShareOfVoiceRoute from "../routes/analyticsShareOfVoice";
import alertsRoute from "../routes/alerts";
import recommendationsRoute from "../routes/recommendations";
import authRoutes from "../routes/auth";
import usageRoutes from "../routes/usage";
import billingRoutes from "../routes/billing";
import feedbackRoutes from "../routes/feedback";
import { apiLimiter } from "../middleware/rateLimit";

export const createApp = () => {
    const app = express();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(passport.initialize());

    // routes
    app.use("/health", healthRoute);
    app.use("/brands", brandsRoute);
    app.use("/queries", queriesRoute, apiLimiter);
    app.use("/analytics", analyticsVisibilityRoute, apiLimiter);
    app.use("/analytics", analyticsShareOfVoiceRoute, apiLimiter);
    app.use("/alerts", alertsRoute);
    app.use("/recommendations", recommendationsRoute);
    app.use("/auth", authRoutes);
    app.use("/billing", usageRoutes, apiLimiter);
    app.use("/billing", billingRoutes, apiLimiter);
    app.use("/feedback", feedbackRoutes);



    return app;
};
