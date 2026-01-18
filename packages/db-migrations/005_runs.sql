CREATE TABLE IF NOT EXISTS runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    status TEXT NOT NULL, -- scheduled | running | completed | failed
    error TEXT
);

CREATE INDEX IF NOT EXISTS idx_runs_query_id ON runs(query_id);
CREATE INDEX IF NOT EXISTS idx_runs_source_id ON runs(source_id);
CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs(started_at);

ALTER TABLE runs
ADD COLUMN customer_id UUID;

ALTER TABLE runs
ADD CONSTRAINT runs_customer_id_fkey
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE CASCADE;

UPDATE runs r
SET customer_id = q.customer_id
FROM queries q
WHERE r.query_id = q.id;

ALTER TABLE runs
ALTER COLUMN customer_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_runs_customer_started
ON runs (customer_id, started_at);




-- ALTER TABLE runs ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY runs_isolation
-- ON runs
-- USING (customer_id::text = current_setting('app.customer_id', true))
-- WITH CHECK (customer_id::text = current_setting('app.customer_id', true));

