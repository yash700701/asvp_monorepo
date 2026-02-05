ALTER TABLE answers
ADD COLUMN IF NOT EXISTS sentiment TEXT,
ADD COLUMN IF NOT EXISTS prominence REAL,
ADD COLUMN IF NOT EXISTS entities JSONB DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_answers_sentiment
ON answers (sentiment);

CREATE INDEX IF NOT EXISTS idx_answers_prominence
ON answers (prominence);
