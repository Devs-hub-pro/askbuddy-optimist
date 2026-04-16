-- Migration Pack 04: 搜索与发现基础层
-- 依据:
-- - docs/backend-phase1-schema-plan.md
-- - docs/backend-phase1-field-dictionary-v1.1.md
-- - docs/backend-phase1-migration-plan.md
--
-- 范围:
-- 1) search_history
-- 2) hot_keywords
-- 3) posts (收口)
-- 4) post_media
-- 5) follows (用户关注用户)
-- 6) post_likes / post_comments / post_favorites (最小互动占位)
-- 7) 必要索引
-- 8) 基础 RLS
-- 9) 轻量 trigger/function（updated_at、计数、轻量约束）
--
-- 非范围:
-- 复杂推荐算法、个性化排序服务、消息通知联动、复杂评论树、复杂标签平台、Edge Functions

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 复用 Pack01 函数，不存在时兜底创建
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'update_updated_at_column'
      AND n.nspname = 'public'
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.update_updated_at_column()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $inner$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $inner$;
    $fn$;
  END IF;
END $$;

-- 1) search_history
CREATE TABLE IF NOT EXISTS public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text text NOT NULL,
  query_type text NOT NULL DEFAULT 'all',
  query_text_norm text GENERATED ALWAYS AS (lower(btrim(query_text))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT search_history_query_type_check CHECK (
    query_type IN ('all', 'question', 'expert', 'skill', 'post')
  ),
  CONSTRAINT search_history_query_not_blank CHECK (length(btrim(query_text)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_search_history_user_query_unique
  ON public.search_history(user_id, query_type, query_text_norm);
CREATE INDEX IF NOT EXISTS idx_search_history_user_last_used
  ON public.search_history(user_id, last_used_at DESC);

-- 2) hot_keywords
CREATE TABLE IF NOT EXISTS public.hot_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  keyword_type text NOT NULL DEFAULT 'all',
  score numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hot_keywords_keyword_type_check CHECK (
    keyword_type IN ('all', 'question', 'expert', 'skill', 'post')
  ),
  CONSTRAINT hot_keywords_score_non_negative CHECK (score >= 0),
  CONSTRAINT hot_keywords_keyword_not_blank CHECK (length(btrim(keyword)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_hot_keywords_active_score
  ON public.hot_keywords(is_active, score DESC);
CREATE INDEX IF NOT EXISTS idx_hot_keywords_type_score
  ON public.hot_keywords(keyword_type, score DESC);

-- 3) posts（兼容收口）
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  city text,
  city_code text,
  visibility text NOT NULL DEFAULT 'public',
  status text NOT NULL DEFAULT 'active',
  like_count integer NOT NULL DEFAULT 0,
  favorite_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT posts_visibility_check CHECK (visibility IN ('public', 'followers', 'private')),
  CONSTRAINT posts_status_check CHECK (status IN ('active', 'hidden', 'deleted')),
  CONSTRAINT posts_like_count_non_negative CHECK (like_count >= 0),
  CONSTRAINT posts_favorite_count_non_negative CHECK (favorite_count >= 0),
  CONSTRAINT posts_comment_count_non_negative CHECK (comment_count >= 0)
);

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS city_code text,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS favorite_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 兼容旧字段 user_id / likes_count / comments_count
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'user_id'
  ) THEN
    EXECUTE '
      UPDATE public.posts
      SET author_id = user_id
      WHERE author_id IS NULL AND user_id IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'likes_count'
  ) THEN
    EXECUTE '
      UPDATE public.posts
      SET like_count = likes_count
      WHERE like_count = 0 AND likes_count IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'comments_count'
  ) THEN
    EXECUTE '
      UPDATE public.posts
      SET comment_count = comments_count
      WHERE comment_count = 0 AND comments_count IS NOT NULL
    ';
  END IF;
END $$;

ALTER TABLE public.posts
  ALTER COLUMN author_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'posts_visibility_check'
      AND conrelid = 'public.posts'::regclass
  ) THEN
    ALTER TABLE public.posts
      ADD CONSTRAINT posts_visibility_check CHECK (visibility IN ('public', 'followers', 'private'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'posts_status_check'
      AND conrelid = 'public.posts'::regclass
  ) THEN
    ALTER TABLE public.posts
      ADD CONSTRAINT posts_status_check CHECK (status IN ('active', 'hidden', 'deleted'));
  END IF;
END $$;

-- 4) post_media
CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image',
  storage_path text,
  media_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_media_type_check CHECK (media_type IN ('image', 'video', 'cover')),
  CONSTRAINT post_media_source_check CHECK (
    storage_path IS NOT NULL OR media_url IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_post_media_post_sort
  ON public.post_media(post_id, sort_order ASC, created_at ASC);

-- 5) follows（用户关注用户）
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CONSTRAINT follows_self_follow_check CHECK (follower_id <> followee_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON public.follows(followee_id);

-- 历史 user_followers 回填 follows（幂等）
DO $$
BEGIN
  IF to_regclass('public.user_followers') IS NOT NULL THEN
    INSERT INTO public.follows (follower_id, followee_id, created_at)
    SELECT uf.follower_id, uf.following_id, COALESCE(uf.created_at, now())
    FROM public.user_followers uf
    ON CONFLICT (follower_id, followee_id) DO NOTHING;
  END IF;
END $$;

-- 6) 互动最小占位：post_likes / post_favorites / post_comments
-- post_likes：若旧表存在则补约束；若不存在则创建
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);

-- post_favorites：最小收藏占位
CREATE TABLE IF NOT EXISTS public.post_favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_favorites_post ON public.post_favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_post_favorites_user ON public.post_favorites(user_id);

-- post_comments：若旧表存在则补 author_id/status；否则创建
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_comments_status_check CHECK (status IN ('active', 'hidden', 'deleted'))
);

ALTER TABLE public.post_comments
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'post_comments' AND column_name = 'user_id'
  ) THEN
    EXECUTE '
      UPDATE public.post_comments
      SET author_id = user_id
      WHERE author_id IS NULL AND user_id IS NOT NULL
    ';
  END IF;
END $$;

ALTER TABLE public.post_comments
  ALTER COLUMN author_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'post_comments_status_check'
      AND conrelid = 'public.post_comments'::regclass
  ) THEN
    ALTER TABLE public.post_comments
      ADD CONSTRAINT post_comments_status_check CHECK (status IN ('active', 'hidden', 'deleted'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_post_comments_post_created
  ON public.post_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_post_comments_author_created
  ON public.post_comments(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_status_created
  ON public.post_comments(post_id, status, created_at ASC);

-- posts 查询索引
CREATE INDEX IF NOT EXISTS idx_posts_author_created
  ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_created
  ON public.posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_city_status_created
  ON public.posts(city_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility_status_created
  ON public.posts(visibility, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_content_trgm
  ON public.posts USING gin (content gin_trgm_ops);

-- 轻量函数：判断当前用户是否可读帖子
CREATE OR REPLACE FUNCTION public.can_read_post(
  p_author_id uuid,
  p_visibility text,
  p_status text
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF p_status <> 'active' THEN
    RETURN v_uid IS NOT NULL AND v_uid = p_author_id;
  END IF;

  IF p_visibility = 'public' THEN
    RETURN true;
  END IF;

  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  IF v_uid = p_author_id THEN
    RETURN true;
  END IF;

  IF p_visibility = 'followers' THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.follows f
      WHERE f.follower_id = v_uid
        AND f.followee_id = p_author_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.user_followers uf
      WHERE uf.follower_id = v_uid
        AND uf.following_id = p_author_id
    );
  END IF;

  RETURN false;
END;
$$;

-- 轻量函数：帖子计数刷新（点赞/收藏/评论）
CREATE OR REPLACE FUNCTION public.refresh_post_engagement_counts(p_post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_like_count integer := 0;
  v_favorite_count integer := 0;
  v_comment_count integer := 0;
BEGIN
  SELECT count(*) INTO v_like_count
  FROM public.post_likes
  WHERE post_id = p_post_id;

  SELECT count(*) INTO v_favorite_count
  FROM public.post_favorites
  WHERE post_id = p_post_id;

  SELECT count(*) INTO v_comment_count
  FROM public.post_comments
  WHERE post_id = p_post_id
    AND status = 'active';

  UPDATE public.posts
  SET like_count = v_like_count,
      favorite_count = v_favorite_count,
      comment_count = v_comment_count,
      -- 兼容历史字段
      likes_count = v_like_count,
      comments_count = v_comment_count,
      updated_at = now()
  WHERE id = p_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_post_engagement_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.refresh_post_engagement_counts(COALESCE(NEW.post_id, NEW.id));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.refresh_post_engagement_counts(COALESCE(NEW.post_id, OLD.post_id));
    RETURN NEW;
  ELSE
    PERFORM public.refresh_post_engagement_counts(COALESCE(OLD.post_id, OLD.id));
    RETURN OLD;
  END IF;
END;
$$;

-- 移除旧触发器，避免双重计数
DROP TRIGGER IF EXISTS on_post_like_insert ON public.post_likes;
DROP TRIGGER IF EXISTS on_post_like_delete ON public.post_likes;
DROP TRIGGER IF EXISTS on_post_comment_insert ON public.post_comments;
DROP TRIGGER IF EXISTS on_post_comment_delete ON public.post_comments;

DROP TRIGGER IF EXISTS trg_post_likes_counts_pack04 ON public.post_likes;
CREATE TRIGGER trg_post_likes_counts_pack04
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_post_engagement_counts();

DROP TRIGGER IF EXISTS trg_post_favorites_counts_pack04 ON public.post_favorites;
CREATE TRIGGER trg_post_favorites_counts_pack04
  AFTER INSERT OR DELETE ON public.post_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_post_engagement_counts();

DROP TRIGGER IF EXISTS trg_post_comments_counts_pack04 ON public.post_comments;
CREATE TRIGGER trg_post_comments_counts_pack04
  AFTER INSERT OR UPDATE OR DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_post_engagement_counts();

-- search_history 轻量去重更新函数（最近搜索）
CREATE OR REPLACE FUNCTION public.upsert_search_history(
  p_query_text text,
  p_query_type text DEFAULT 'all'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'auth required';
  END IF;

  INSERT INTO public.search_history (user_id, query_text, query_type)
  VALUES (v_uid, p_query_text, p_query_type)
  ON CONFLICT (user_id, query_type, query_text_norm)
  DO UPDATE
    SET last_used_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- posts 兼容触发器：确保 author_id/user_id 同步（兼容现有前端仍写 user_id）
CREATE OR REPLACE FUNCTION public.trg_posts_sync_author_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.author_id IS NULL AND NEW.user_id IS NOT NULL THEN
    NEW.author_id := NEW.user_id;
  END IF;
  IF NEW.user_id IS NULL AND NEW.author_id IS NOT NULL THEN
    NEW.user_id := NEW.author_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_posts_sync_author_user ON public.posts;
CREATE TRIGGER trg_posts_sync_author_user
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_posts_sync_author_user();

-- post_comments 兼容触发器：author_id/user_id 同步
CREATE OR REPLACE FUNCTION public.trg_post_comments_sync_author_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.author_id IS NULL AND NEW.user_id IS NOT NULL THEN
    NEW.author_id := NEW.user_id;
  END IF;
  IF NEW.user_id IS NULL AND NEW.author_id IS NOT NULL THEN
    NEW.user_id := NEW.author_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_post_comments_sync_author_user ON public.post_comments;
CREATE TRIGGER trg_post_comments_sync_author_user
  BEFORE INSERT OR UPDATE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_post_comments_sync_author_user();

-- 更新时戳触发器
DROP TRIGGER IF EXISTS trg_hot_keywords_updated_at_pack04 ON public.hot_keywords;
CREATE TRIGGER trg_hot_keywords_updated_at_pack04
  BEFORE UPDATE ON public.hot_keywords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS trg_posts_updated_at_pack04 ON public.posts;
CREATE TRIGGER trg_posts_updated_at_pack04
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_comments_updated_at ON public.post_comments;
DROP TRIGGER IF EXISTS trg_post_comments_updated_at_pack04 ON public.post_comments;
CREATE TRIGGER trg_post_comments_updated_at_pack04
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hot_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 清理旧 policy（避免冲突）
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'search_history' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.search_history', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hot_keywords' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.hot_keywords', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.posts', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_media' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.post_media', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'follows' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.follows', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_likes' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.post_likes', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_favorites' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.post_favorites', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_comments' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.post_comments', r.policyname);
  END LOOP;
END $$;

-- search_history: owner-only
DROP POLICY IF EXISTS "pack04_search_history_owner_select" ON public.search_history;
CREATE POLICY "pack04_search_history_owner_select"
  ON public.search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack04_search_history_owner_insert" ON public.search_history;
CREATE POLICY "pack04_search_history_owner_insert"
  ON public.search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack04_search_history_owner_update" ON public.search_history;
CREATE POLICY "pack04_search_history_owner_update"
  ON public.search_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pack04_search_history_owner_delete" ON public.search_history;
CREATE POLICY "pack04_search_history_owner_delete"
  ON public.search_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- hot_keywords: 公开读 active，写由 service role / migration / seed
DROP POLICY IF EXISTS "pack04_hot_keywords_public_read" ON public.hot_keywords;
CREATE POLICY "pack04_hot_keywords_public_read"
  ON public.hot_keywords
  FOR SELECT
  USING (is_active = true);

COMMENT ON TABLE public.hot_keywords IS
'Pack04 一期策略：热词面向业务端公开只读，写入由 service role / migration / seed 执行。';

-- posts: 公开读可见内容；作者本人可读写全部
CREATE POLICY "pack04_posts_public_read"
  ON public.posts
  FOR SELECT
  USING (public.can_read_post(author_id, visibility, status));

CREATE POLICY "pack04_posts_owner_insert"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "pack04_posts_owner_update"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "pack04_posts_owner_delete"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- post_media: 随帖子可见性公开读；仅帖子作者可管理
CREATE POLICY "pack04_post_media_public_read"
  ON public.post_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_media_owner_insert"
  ON public.post_media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "pack04_post_media_owner_update"
  ON public.post_media
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND p.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "pack04_post_media_owner_delete"
  ON public.post_media
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND p.author_id = auth.uid()
    )
  );

-- follows: 本人管理自己的关注关系
CREATE POLICY "pack04_follows_owner_select"
  ON public.follows
  FOR SELECT
  TO authenticated
  USING (auth.uid() = follower_id OR auth.uid() = followee_id);

CREATE POLICY "pack04_follows_owner_insert"
  ON public.follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "pack04_follows_owner_delete"
  ON public.follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- post_likes: 公开读可见帖子互动；本人可赞/取消赞
CREATE POLICY "pack04_post_likes_read_visible"
  ON public.post_likes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_likes_owner_insert"
  ON public.post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_likes_owner_delete"
  ON public.post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- post_favorites: 公开读可见帖子收藏关系；本人可收藏/取消
CREATE POLICY "pack04_post_favorites_read_visible"
  ON public.post_favorites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_favorites_owner_insert"
  ON public.post_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_favorites_owner_delete"
  ON public.post_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- post_comments: 公开读可见帖子下 active 评论 + 作者本人可读自己的所有评论
CREATE POLICY "pack04_post_comments_read_visible"
  ON public.post_comments
  FOR SELECT
  USING (
    (
      status = 'active'
      AND EXISTS (
        SELECT 1
        FROM public.posts p
        WHERE p.id = post_id
          AND public.can_read_post(p.author_id, p.visibility, p.status)
      )
    )
    OR auth.uid() = author_id
  );

CREATE POLICY "pack04_post_comments_owner_insert"
  ON public.post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = post_id
        AND public.can_read_post(p.author_id, p.visibility, p.status)
    )
  );

CREATE POLICY "pack04_post_comments_owner_update"
  ON public.post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "pack04_post_comments_owner_delete"
  ON public.post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

COMMENT ON TABLE public.posts IS
'Pack04: 发现流基础内容表。定位为经验/见解流基础层，不包含复杂分发与社区运营系统。';
COMMENT ON TABLE public.follows IS
'Pack04: 用户关注用户关系（独立于专家关注）。';
