CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id),
    query_id UUID REFERENCES queries(id),
    type TEXT NOT NULL,        -- visibility_gap | sov_loss | low_confidence
    priority TEXT NOT NULL,    -- low | medium | high
    message TEXT NOT NULL,
    evidence JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_recs_customer ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_recs_created ON recommendations(created_at);
