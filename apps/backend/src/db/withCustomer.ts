import { PoolClient } from "pg";

export async function withCustomer<T>(
    client: PoolClient,
    customerId: string,
    fn: () => Promise<T>
): Promise<T> {
    await client.query("SET LOCAL app.customer_id = $1", [customerId]);

    return fn();
}
