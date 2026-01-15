CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free',
    billing_id TEXT,
    sso_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_plan ON customers(plan);

-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY customers_self
-- ON customers
-- USING (id::text = current_setting('app.customer_id', true));
