CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID,
    user_id UUID,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_customer ON audit_logs(customer_id);


-- Example usage:
-- Login events
-- Plan changes
-- Query activation/deactivation
-- Billing webhooks

-- await db.query(
--   `
--   INSERT INTO audit_logs (customer_id, user_id, action, metadata)
--   VALUES ($1, $2, $3, $4)
--   `,
--   [
--     customerId,
--     req.user!.user_id,
--     "QUERY_ACTIVATED",
--     { query_id }
--   ]
-- );