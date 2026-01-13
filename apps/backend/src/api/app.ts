import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import "../auth/google";
import healthRoute from "../routes/health";
import brandsRoute from "../routes/brands";
import queriesRoute from "../routes/queries";
import queryScheduleRoute from "../routes/querySchedule";
import queryAutoScheduleRoute from "../routes/queryAutoSchedule";
import analyticsVisibilityRoute from "../routes/analyticsVisibility";
import analyticsShareOfVoiceRoute from "../routes/analyticsShareOfVoice";
import alertsRoute from "../routes/alerts";
import recommendationsRoute from "../routes/recommendations";
import authRoutes from "../routes/auth";

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
    app.use("/queries", queriesRoute);
    app.use("/queries", queryScheduleRoute);
    app.use("/queries", queryAutoScheduleRoute);
    app.use("/analytics", analyticsVisibilityRoute);
    app.use("/analytics", analyticsShareOfVoiceRoute);
    app.use("/alerts", alertsRoute);
    app.use("/recommendations", recommendationsRoute);
    app.use("/auth", authRoutes);

    return app;
};
