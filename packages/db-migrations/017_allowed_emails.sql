CREATE TABLE IF NOT EXISTS allowed_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_allowed_emails_email
ON allowed_emails (email);

CREATE INDEX IF NOT EXISTS idx_allowed_emails_active
ON allowed_emails (is_active);

INSERT INTO allowed_emails (email, is_active)
VALUES ('yashtiwari700714@gmail.com', true)
ON CONFLICT (email) DO NOTHING;
