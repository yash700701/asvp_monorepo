CREATE TABLE IF NOT EXISTS query_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    workflow_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (query_id, source_id)
);
