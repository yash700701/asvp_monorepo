ALTER TABLE customers
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS razorpay_payment_link_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
