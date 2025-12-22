import { Connection, Client } from "@temporalio/client";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});

let client: Client | null = null;

export async function getTemporalClient(): Promise<Client> {
    if (client) return client;

    const connection = await Connection.connect({
        address: process.env.TEMPORAL_ADDRESS || "localhost:7233"
    });

    client = new Client({ connection });
    return client;
}
