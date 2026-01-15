CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id),
    alert_type TEXT NOT NULL, -- visibility_drop | sov_drop
    severity TEXT NOT NULL,   -- low | medium | high
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    acknowledged_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_customer ON alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);


ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY alerts_isolation
ON alerts
USING (customer_id::text = current_setting('app.customer_id', true))
WITH CHECK (customer_id::text = current_setting('app.customer_id', true));
