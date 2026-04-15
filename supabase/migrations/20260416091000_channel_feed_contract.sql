-- Channel + subcategory contract for secondary channel pages.
-- Goal:
-- 1) Keep content strictly inside selected channel.
-- 2) Ensure subcategory filtering is deterministic.
-- 3) Provide stable featured/feed RPCs for frontend integration.

CREATE OR REPLACE FUNCTION public.normalize_channel(p_value text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v text := lower(trim(coalesce(p_value, '')));
BEGIN
  IF v = '' THEN
    RETURN NULL;
  END IF;

  IF v IN ('education-learning', 'education', '教育学习') THEN
    RETURN 'education-learning';
  ELSIF v IN ('career-development', 'career', '职业发展') THEN
    RETURN 'career-development';
  ELSIF v IN ('lifestyle-services', 'lifestyle', '生活服务') THEN
    RETURN 'lifestyle-services';
  ELSIF v IN ('hobbies-skills', 'hobbies', '兴趣技能') THEN
    RETURN 'hobbies-skills';
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.infer_channel_from_subcategory(p_value text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v text := lower(trim(coalesce(p_value, '')));
BEGIN
  IF v = '' THEN
    RETURN NULL;
  END IF;

  IF v IN ('gaokao', '高考', 'kaoyan', '考研', 'study-abroad', '留学', 'competition', '竞赛', 'paper', '论文', '论文写作') THEN
    RETURN 'education-learning';
  ELSIF v IN ('job', '求职', 'resume', '简历', 'interview', '面试', 'remote', '远程工作', 'startup', '创业') THEN
    RETURN 'career-development';
  ELSIF v IN ('housing', '租房', 'legal', '法律', 'emotional', '情感', 'insurance', '保险', 'overseas', '海外生活') THEN
    RETURN 'lifestyle-services';
  ELSIF v IN ('photography', '摄影', 'music', '音乐', 'art', '艺术', 'fitness', '健身', 'cooking', '烹饪') THEN
    RETURN 'hobbies-skills';
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_subcategory(p_channel text, p_value text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_channel text := public.normalize_channel(p_channel);
  v text := lower(trim(coalesce(p_value, '')));
BEGIN
  IF v_channel IS NULL OR v = '' OR v = 'all' OR v = '全部' THEN
    RETURN NULL;
  END IF;

  IF v_channel = 'education-learning' THEN
    IF v IN ('gaokao', '高考') THEN RETURN 'gaokao'; END IF;
    IF v IN ('kaoyan', '考研') THEN RETURN 'kaoyan'; END IF;
    IF v IN ('study-abroad', '留学') THEN RETURN 'study-abroad'; END IF;
    IF v IN ('competition', '竞赛') THEN RETURN 'competition'; END IF;
    IF v IN ('paper', '论文', '论文写作') THEN RETURN 'paper'; END IF;
  ELSIF v_channel = 'career-development' THEN
    IF v IN ('job', '求职') THEN RETURN 'job'; END IF;
    IF v IN ('resume', '简历') THEN RETURN 'resume'; END IF;
    IF v IN ('interview', '面试') THEN RETURN 'interview'; END IF;
    IF v IN ('remote', '远程工作') THEN RETURN 'remote'; END IF;
    IF v IN ('startup', '创业') THEN RETURN 'startup'; END IF;
  ELSIF v_channel = 'lifestyle-services' THEN
    IF v IN ('housing', '租房') THEN RETURN 'housing'; END IF;
    IF v IN ('legal', '法律') THEN RETURN 'legal'; END IF;
    IF v IN ('emotional', '情感') THEN RETURN 'emotional'; END IF;
    IF v IN ('insurance', '保险') THEN RETURN 'insurance'; END IF;
    IF v IN ('overseas', '海外生活') THEN RETURN 'overseas'; END IF;
  ELSIF v_channel = 'hobbies-skills' THEN
    IF v IN ('photography', '摄影') THEN RETURN 'photography'; END IF;
    IF v IN ('music', '音乐') THEN RETURN 'music'; END IF;
    IF v IN ('art', '艺术') THEN RETURN 'art'; END IF;
    IF v IN ('fitness', '健身') THEN RETURN 'fitness'; END IF;
    IF v IN ('cooking', '烹饪') THEN RETURN 'cooking'; END IF;
  END IF;

  RETURN NULL;
END;
$$;

ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS channel text,
ADD COLUMN IF NOT EXISTS subcategory text;

ALTER TABLE public.experts
ADD COLUMN IF NOT EXISTS channel text;

ALTER TABLE public.hot_topics
ADD COLUMN IF NOT EXISTS channel text,
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS featured_priority integer NOT NULL DEFAULT 0;

-- Backfill normalized fields from historical category/subcategory values.
UPDATE public.questions q
SET
  channel = coalesce(
    public.normalize_channel(q.channel),
    public.normalize_channel(q.category),
    public.infer_channel_from_subcategory(q.subcategory),
    public.infer_channel_from_subcategory(q.category)
  ),
  subcategory = coalesce(
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(q.channel),
        public.normalize_channel(q.category),
        public.infer_channel_from_subcategory(q.subcategory),
        public.infer_channel_from_subcategory(q.category)
      ),
      q.subcategory
    ),
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(q.channel),
        public.normalize_channel(q.category),
        public.infer_channel_from_subcategory(q.subcategory),
        public.infer_channel_from_subcategory(q.category)
      ),
      q.category
    ),
    q.subcategory
  )
WHERE q.channel IS NULL OR q.subcategory IS NULL;

UPDATE public.experts e
SET
  channel = coalesce(
    public.normalize_channel(e.channel),
    public.normalize_channel(e.category),
    public.infer_channel_from_subcategory(e.subcategory),
    public.infer_channel_from_subcategory(e.category)
  ),
  subcategory = coalesce(
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(e.channel),
        public.normalize_channel(e.category),
        public.infer_channel_from_subcategory(e.subcategory),
        public.infer_channel_from_subcategory(e.category)
      ),
      e.subcategory
    ),
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(e.channel),
        public.normalize_channel(e.category),
        public.infer_channel_from_subcategory(e.subcategory),
        public.infer_channel_from_subcategory(e.category)
      ),
      e.category
    ),
    e.subcategory
  )
WHERE e.channel IS NULL OR e.subcategory IS NULL;

UPDATE public.hot_topics t
SET
  channel = coalesce(
    public.normalize_channel(t.channel),
    public.normalize_channel(t.category),
    public.infer_channel_from_subcategory(t.subcategory),
    public.infer_channel_from_subcategory(t.category)
  ),
  subcategory = coalesce(
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(t.channel),
        public.normalize_channel(t.category),
        public.infer_channel_from_subcategory(t.subcategory),
        public.infer_channel_from_subcategory(t.category)
      ),
      t.subcategory
    ),
    public.normalize_subcategory(
      coalesce(
        public.normalize_channel(t.channel),
        public.normalize_channel(t.category),
        public.infer_channel_from_subcategory(t.subcategory),
        public.infer_channel_from_subcategory(t.category)
      ),
      t.category
    ),
    t.subcategory
  )
WHERE t.channel IS NULL OR t.subcategory IS NULL;

ALTER TABLE public.questions
DROP CONSTRAINT IF EXISTS questions_channel_valid;
ALTER TABLE public.questions
ADD CONSTRAINT questions_channel_valid
CHECK (channel IS NULL OR channel IN ('education-learning', 'career-development', 'lifestyle-services', 'hobbies-skills'));

ALTER TABLE public.experts
DROP CONSTRAINT IF EXISTS experts_channel_valid;
ALTER TABLE public.experts
ADD CONSTRAINT experts_channel_valid
CHECK (channel IS NULL OR channel IN ('education-learning', 'career-development', 'lifestyle-services', 'hobbies-skills'));

ALTER TABLE public.hot_topics
DROP CONSTRAINT IF EXISTS hot_topics_channel_valid;
ALTER TABLE public.hot_topics
ADD CONSTRAINT hot_topics_channel_valid
CHECK (channel IS NULL OR channel IN ('education-learning', 'career-development', 'lifestyle-services', 'hobbies-skills'));

CREATE OR REPLACE FUNCTION public.sync_content_channel_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_channel text;
BEGIN
  v_channel := coalesce(
    public.normalize_channel(NEW.channel),
    public.normalize_channel(NEW.category),
    public.infer_channel_from_subcategory(NEW.subcategory),
    public.infer_channel_from_subcategory(NEW.category)
  );

  NEW.channel := v_channel;

  IF v_channel IS NOT NULL THEN
    NEW.subcategory := coalesce(
      public.normalize_subcategory(v_channel, NEW.subcategory),
      public.normalize_subcategory(v_channel, NEW.category),
      NEW.subcategory
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_questions_channel_fields ON public.questions;
CREATE TRIGGER trg_sync_questions_channel_fields
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.sync_content_channel_fields();

DROP TRIGGER IF EXISTS trg_sync_experts_channel_fields ON public.experts;
CREATE TRIGGER trg_sync_experts_channel_fields
BEFORE INSERT OR UPDATE ON public.experts
FOR EACH ROW
EXECUTE FUNCTION public.sync_content_channel_fields();

DROP TRIGGER IF EXISTS trg_sync_hot_topics_channel_fields ON public.hot_topics;
CREATE TRIGGER trg_sync_hot_topics_channel_fields
BEFORE INSERT OR UPDATE ON public.hot_topics
FOR EACH ROW
EXECUTE FUNCTION public.sync_content_channel_fields();

CREATE INDEX IF NOT EXISTS idx_questions_channel_subcategory_visible_created
ON public.questions(channel, subcategory, created_at DESC)
WHERE is_hidden = false;

CREATE INDEX IF NOT EXISTS idx_experts_channel_subcategory_active_rating
ON public.experts(channel, subcategory, rating DESC)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_hot_topics_channel_subcategory_active_priority
ON public.hot_topics(channel, subcategory, featured_priority DESC, updated_at DESC)
WHERE is_active = true;

CREATE OR REPLACE FUNCTION public.get_channel_featured(
  p_channel text,
  p_subcategory text DEFAULT 'all'
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_channel text := public.normalize_channel(p_channel);
  v_subcategory text := public.normalize_subcategory(public.normalize_channel(p_channel), p_subcategory);
  v_featured jsonb;
BEGIN
  IF v_channel IS NULL THEN
    RAISE EXCEPTION 'Invalid channel: %', p_channel;
  END IF;

  SELECT to_jsonb(x)
  INTO v_featured
  FROM (
    SELECT
      t.id,
      t.title,
      t.description,
      t.cover_image,
      t.channel,
      t.subcategory,
      t.participants_count,
      t.discussions_count,
      t.updated_at
    FROM public.hot_topics t
    WHERE t.is_active = true
      AND t.channel = v_channel
      AND (
        v_subcategory IS NULL
        OR t.subcategory = v_subcategory
        OR t.subcategory IS NULL
      )
    ORDER BY
      CASE
        WHEN v_subcategory IS NOT NULL AND t.subcategory = v_subcategory THEN 0
        WHEN t.subcategory IS NULL THEN 1
        ELSE 2
      END,
      t.featured_priority DESC,
      t.discussions_count DESC,
      t.updated_at DESC
    LIMIT 1
  ) AS x;

  RETURN v_featured;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_channel_feed(
  p_channel text,
  p_subcategory text DEFAULT 'all',
  p_questions_limit integer DEFAULT 20,
  p_experts_limit integer DEFAULT 12
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_channel text := public.normalize_channel(p_channel);
  v_subcategory text := public.normalize_subcategory(public.normalize_channel(p_channel), p_subcategory);
  v_questions_limit integer := greatest(1, least(coalesce(p_questions_limit, 20), 50));
  v_experts_limit integer := greatest(1, least(coalesce(p_experts_limit, 12), 30));
  v_featured jsonb;
  v_questions jsonb;
  v_experts jsonb;
BEGIN
  IF v_channel IS NULL THEN
    RAISE EXCEPTION 'Invalid channel: %', p_channel;
  END IF;

  v_featured := public.get_channel_featured(v_channel, coalesce(v_subcategory, 'all'));

  SELECT coalesce(jsonb_agg(to_jsonb(qrow)), '[]'::jsonb)
  INTO v_questions
  FROM (
    SELECT
      q.id,
      q.title,
      q.content,
      q.channel,
      q.subcategory,
      q.tags,
      q.bounty_points,
      q.view_count,
      q.status,
      q.created_at,
      coalesce(p.nickname, '匿名用户') AS profile_nickname,
      p.avatar_url AS profile_avatar,
      (
        SELECT count(*)
        FROM public.answers a
        WHERE a.question_id = q.id
          AND coalesce(a.is_hidden, false) = false
      )::int AS answers_count
    FROM public.questions q
    LEFT JOIN public.profiles p ON p.user_id = q.user_id
    WHERE coalesce(q.is_hidden, false) = false
      AND q.status IN ('open', 'pending_payment', 'paid', 'solved')
      AND coalesce(q.channel, public.normalize_channel(q.category)) = v_channel
      AND (
        v_subcategory IS NULL
        OR coalesce(
          q.subcategory,
          public.normalize_subcategory(v_channel, q.category)
        ) = v_subcategory
      )
    ORDER BY q.view_count DESC, q.created_at DESC
    LIMIT v_questions_limit
  ) qrow;

  SELECT coalesce(jsonb_agg(to_jsonb(erow)), '[]'::jsonb)
  INTO v_experts
  FROM (
    SELECT
      e.id,
      e.user_id,
      coalesce(e.display_name, p.nickname, '专家') AS nickname,
      coalesce(e.avatar_url, p.avatar_url) AS avatar_url,
      e.title,
      e.bio,
      e.channel,
      e.subcategory,
      e.tags,
      e.rating,
      e.response_rate,
      e.order_count,
      e.consultation_price,
      e.is_verified
    FROM public.experts e
    LEFT JOIN public.profiles p ON p.user_id = e.user_id
    WHERE e.is_active = true
      AND coalesce(e.channel, public.normalize_channel(e.category)) = v_channel
      AND (
        v_subcategory IS NULL
        OR coalesce(
          e.subcategory,
          public.normalize_subcategory(v_channel, e.category)
        ) = v_subcategory
      )
    ORDER BY e.rating DESC, e.response_rate DESC, e.order_count DESC
    LIMIT v_experts_limit
  ) erow;

  RETURN jsonb_build_object(
    'channel', v_channel,
    'subcategory', v_subcategory,
    'featured', v_featured,
    'questions', jsonb_build_object(
      'items', v_questions,
      'next_cursor', null
    ),
    'experts', jsonb_build_object(
      'items', v_experts,
      'next_cursor', null
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_channel_featured(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_channel_feed(text, text, integer, integer) TO anon, authenticated, service_role;

