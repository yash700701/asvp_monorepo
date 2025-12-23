import express from "express";
import cors from "cors";
import healthRoute from "../routes/health";
import brandsRoute from "../routes/brands";
import queriesRoute from "../routes/queries";
import queryScheduleRoute from "../routes/querySchedule";
import queryAutoScheduleRoute from "../routes/queryAutoSchedule";
import analyticsVisibilityRoute from "../routes/analyticsVisibility";
import analyticsShareOfVoiceRoute from "../routes/analyticsShareOfVoice";
import alertsRoute from "../routes/alerts";

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routes
    app.use("/health", healthRoute);
    app.use("/brands", brandsRoute);
    app.use("/queries", queriesRoute);
    app.use("/queries", queryScheduleRoute);
    app.use("/queries", queryAutoScheduleRoute);
    app.use("/analytics", analyticsVisibilityRoute);
    app.use("/analytics", analyticsShareOfVoiceRoute);
    app.use("/alerts", alertsRoute);

    return app;
};
