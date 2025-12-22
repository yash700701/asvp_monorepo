CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    screenshot_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
