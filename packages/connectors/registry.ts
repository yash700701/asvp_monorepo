import { GoogleAIOConnector } from "./googleAIO/GoogleAIOConnector";

export const CONNECTOR_REGISTRY = {
    google_aio: new GoogleAIOConnector()
};
