CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    screenshot_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE answers
ADD COLUMN IF NOT EXISTS main_snippet TEXT,
ADD COLUMN IF NOT EXISTS mentions_brand BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confidence REAL,
ADD COLUMN IF NOT EXISTS parsed_at TIMESTAMPTZ;

ALTER TABLE answers
ADD COLUMN IF NOT EXISTS html_path TEXT;

CREATE INDEX IF NOT EXISTS idx_answers_html_path
ON answers (html_path);

ALTER TABLE answers
ADD COLUMN IF NOT EXISTS sentiment TEXT,
ADD COLUMN IF NOT EXISTS prominence REAL,
ADD COLUMN IF NOT EXISTS entities JSONB DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_answers_sentiment
ON answers (sentiment);

CREATE INDEX IF NOT EXISTS idx_answers_prominence
ON answers (prominence);

ALTER TABLE answers
ADD COLUMN IF NOT EXISTS visibility JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS sentiment_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS prominence_data JSONB DEFAULT '{}'::jsonb,

ADD COLUMN IF NOT EXISTS visibility_score REAL,
ADD COLUMN IF NOT EXISTS sentiment_label TEXT,
ADD COLUMN IF NOT EXISTS sentiment_score REAL,
ADD COLUMN IF NOT EXISTS prominence_score REAL,
ADD COLUMN IF NOT EXISTS mentions_brand BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_answers_visibility_score
ON answers (visibility_score);

CREATE INDEX IF NOT EXISTS idx_answers_sentiment_label
ON answers (sentiment_label);

CREATE INDEX IF NOT EXISTS idx_answers_prominence_score
ON answers (prominence_score);

CREATE INDEX IF NOT EXISTS idx_answers_entities_gin
ON answers USING GIN (entities);

ALTER TABLE answers
ADD COLUMN customer_id UUID;

ALTER TABLE answers
ADD COLUMN brand_id TEXT;

CREATE INDEX idx_answers_customer_brand
ON answers (customer_id, brand_id);

CREATE INDEX idx_answers_customer_brand_time
ON answers (customer_id, brand_id, created_at DESC);


-- ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY answers_isolation
-- ON answers
-- USING (customer_id::text = current_setting('app.customer_id', true))
-- WITH CHECK (customer_id::text = current_setting('app.customer_id', true));
