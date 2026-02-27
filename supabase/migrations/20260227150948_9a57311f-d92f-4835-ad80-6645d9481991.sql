
-- Remove unique constraint on experts.user_id to allow test data and multiple expert profiles
ALTER TABLE public.experts DROP CONSTRAINT IF EXISTS experts_user_id_key;

-- Add display fields directly to experts table for flexibility
ALTER TABLE public.experts ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.experts ADD COLUMN IF NOT EXISTS avatar_url text;
