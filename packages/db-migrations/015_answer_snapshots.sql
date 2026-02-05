ALTER TABLE answers
ADD COLUMN IF NOT EXISTS html_path TEXT;

CREATE INDEX IF NOT EXISTS idx_answers_html_path
ON answers (html_path);
