CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    provider TEXT NOT NULL,          -- google | email
    provider_id TEXT,                -- OAuth subject
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_customer ON users(customer_id);
