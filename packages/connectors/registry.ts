import { GoogleAIOConnector } from "./googleAIO/GoogleAIOConnector";
import { GeminiConnector } from "./gemini/GeminiConnector";

export const CONNECTOR_REGISTRY = {
    google_aio: new GoogleAIOConnector(),
    gemini: new GeminiConnector()
};
