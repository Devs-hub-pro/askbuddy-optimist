
-- Add GIN indexes for full-text search on questions
CREATE INDEX IF NOT EXISTS idx_questions_title_fts ON public.questions USING GIN (to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_questions_content_fts ON public.questions USING GIN (to_tsvector('simple', coalesce(content, '')));
CREATE INDEX IF NOT EXISTS idx_questions_tags ON public.questions USING GIN (tags);

-- Add GIN indexes for full-text search on hot_topics
CREATE INDEX IF NOT EXISTS idx_hot_topics_title_fts ON public.hot_topics USING GIN (to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_hot_topics_description_fts ON public.hot_topics USING GIN (to_tsvector('simple', coalesce(description, '')));

-- Add GIN indexes for full-text search on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_nickname_fts ON public.profiles USING GIN (to_tsvector('simple', coalesce(nickname, '')));
CREATE INDEX IF NOT EXISTS idx_profiles_bio_fts ON public.profiles USING GIN (to_tsvector('simple', coalesce(bio, '')));

-- Also add trigram indexes for ILIKE pattern matching performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_questions_title_trgm ON public.questions USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_questions_content_trgm ON public.questions USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hot_topics_title_trgm ON public.hot_topics USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hot_topics_description_trgm ON public.hot_topics USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname_trgm ON public.profiles USING GIN (nickname gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_bio_trgm ON public.profiles USING GIN (bio gin_trgm_ops);
