import { db } from "../db/client";
import { PLANS } from "./plans";

export async function syncPlanExpiry(customerId: string) {
    await db.query(
        `
        UPDATE customers
        SET
            plan = 'free',
            run_limit = $2,
            billing_status = 'inactive'
        WHERE id = $1
          AND plan <> 'free'
          AND plan_expires_at IS NOT NULL
          AND plan_expires_at <= now()
        `,
        [customerId, PLANS.free.run_limit]
    );
}
