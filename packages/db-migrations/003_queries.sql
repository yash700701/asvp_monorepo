CREATE TABLE IF NOT EXISTS queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    query_type TEXT NOT NULL, -- brand | category | competitor
    frequency TEXT NOT NULL DEFAULT 'daily', -- daily | weekly | manual
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_queries_customer_id ON queries(customer_id);
CREATE INDEX IF NOT EXISTS idx_queries_type ON queries(query_type);

