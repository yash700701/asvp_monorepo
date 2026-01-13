CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    email TEXT NOT NULL,
    name TEXT,
    provider TEXT NOT NULL,          -- google | email
    provider_id TEXT,                -- OAuth subject
    created_at TIMESTAMPTZ DEFAULT now(),

    -- REQUIRED for OAuth upsert
    UNIQUE (provider, provider_id)
);

-- Optional but recommended
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_customer
ON users(customer_id);
