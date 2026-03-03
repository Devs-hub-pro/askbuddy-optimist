-- Add the fields required by the skill publishing flow.

ALTER TABLE public.experts
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS consultation_price integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS experience_level text,
ADD COLUMN IF NOT EXISTS response_time text,
ADD COLUMN IF NOT EXISTS cover_image text;
