-- Pack 08-B Step 2: Search enhancement and naming unification (minimal scope)
-- Scope:
-- 1) add search_app_content_v2(...)
-- 2) add get_search_suggestions_v2(...)
-- 3) ensure posts.content trigram index exists
--
-- Out of scope:
-- - remove legacy search_app_content(...)
-- - legacy follows/posts cleanup
-- - recommendation ranking engine / vector search

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Guard index for post content search (if already present this is a no-op)
CREATE INDEX IF NOT EXISTS idx_posts_content_trgm
  ON public.posts USING gin (content gin_trgm_ops);

CREATE OR REPLACE FUNCTION public.search_app_content_v2(
  p_query text,
  p_limit integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_query text := btrim(coalesce(p_query, ''));
  v_limit integer := greatest(1, least(coalesce(p_limit, 10), 30));
  v_like text;
BEGIN
  IF v_query = '' THEN
    RETURN jsonb_build_object(
      'questions', '[]'::jsonb,
      'experts', '[]'::jsonb,
      'skills', '[]'::jsonb,
      'posts', '[]'::jsonb
    );
  END IF;

  v_like := '%' || v_query || '%';

  RETURN jsonb_build_object(
    'questions',
    COALESCE((
      SELECT jsonb_agg(row_to_json(qr))
      FROM (
        SELECT
          q.id,
          q.title,
          q.description AS content,
          q.reward_points AS bounty_points,
          q.view_count,
          q.created_at,
          q.author_id,
          COALESCE(p.nickname, '匿名用户') AS profile_nickname,
          p.avatar_url AS profile_avatar,
          q.answer_count AS answers_count,
          (
            SELECT qt.tag
            FROM public.question_tags qt
            WHERE qt.question_id = q.id
            ORDER BY qt.created_at ASC
            LIMIT 1
          ) AS category,
          COALESCE((
            SELECT array_agg(qt2.tag ORDER BY qt2.created_at ASC)
            FROM public.question_tags qt2
            WHERE qt2.question_id = q.id
          ), ARRAY[]::text[]) AS tags
        FROM public.questions q
        LEFT JOIN public.profiles p ON p.user_id = q.author_id
        WHERE q.status IN ('open', 'matched', 'solved')
          AND (
            q.title ILIKE v_like
            OR COALESCE(q.description, '') ILIKE v_like
            OR EXISTS (
              SELECT 1
              FROM public.question_tags qt3
              WHERE qt3.question_id = q.id
                AND qt3.tag ILIKE v_like
            )
          )
        ORDER BY
          similarity(COALESCE(q.title, ''), v_query) DESC,
          q.created_at DESC
        LIMIT v_limit
      ) qr
    ), '[]'::jsonb),

    'experts',
    COALESCE((
      SELECT jsonb_agg(row_to_json(er))
      FROM (
        SELECT
          e.id,
          e.user_id,
          COALESCE(p.nickname, '匿名专家') AS nickname,
          p.avatar_url,
          e.headline,
          e.intro,
          e.verification_status,
          e.follower_count,
          e.service_count
        FROM public.experts e
        LEFT JOIN public.profiles p ON p.user_id = e.user_id
        WHERE e.profile_status = 'active'
          AND (
            COALESCE(e.headline, '') ILIKE v_like
            OR COALESCE(e.intro, '') ILIKE v_like
            OR COALESCE(p.nickname, '') ILIKE v_like
          )
        ORDER BY
          similarity(COALESCE(e.headline, ''), v_query) DESC,
          e.updated_at DESC
        LIMIT v_limit
      ) er
    ), '[]'::jsonb),

    'skills',
    COALESCE((
      SELECT jsonb_agg(row_to_json(sr))
      FROM (
        SELECT
          s.id,
          s.expert_id,
          s.title,
          s.description,
          s.pricing_mode,
          s.price_amount,
          s.price_currency,
          s.city,
          s.city_code,
          s.is_remote_supported,
          s.delivery_mode,
          s.created_at,
          sc.name AS category_name,
          COALESCE(p.nickname, '匿名专家') AS expert_nickname,
          p.avatar_url AS expert_avatar
        FROM public.skill_offers s
        LEFT JOIN public.skill_categories sc ON sc.id = s.category_id
        LEFT JOIN public.profiles p ON p.user_id = s.expert_id
        WHERE s.status = 'published'
          AND (
            s.title ILIKE v_like
            OR COALESCE(s.description, '') ILIKE v_like
            OR COALESCE(sc.name, '') ILIKE v_like
          )
        ORDER BY
          similarity(COALESCE(s.title, ''), v_query) DESC,
          s.created_at DESC
        LIMIT v_limit
      ) sr
    ), '[]'::jsonb),

    'posts',
    COALESCE((
      SELECT jsonb_agg(row_to_json(pr))
      FROM (
        SELECT
          po.id,
          po.author_id,
          po.content,
          po.city,
          po.city_code,
          po.created_at,
          po.like_count,
          po.favorite_count,
          po.comment_count,
          COALESCE(p.nickname, '匿名用户') AS author_nickname,
          p.avatar_url AS author_avatar
        FROM public.posts po
        LEFT JOIN public.profiles p ON p.user_id = po.author_id
        WHERE public.can_read_post(po.author_id, po.visibility, po.status)
          AND po.content ILIKE v_like
        ORDER BY po.created_at DESC
        LIMIT v_limit
      ) pr
    ), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_search_suggestions_v2(
  p_query text DEFAULT '',
  p_limit integer DEFAULT 10,
  p_type text DEFAULT 'all'
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_query text := btrim(coalesce(p_query, ''));
  v_limit integer := greatest(1, least(coalesce(p_limit, 10), 30));
  v_type text := lower(coalesce(p_type, 'all'));
  v_like text;
BEGIN
  IF v_type NOT IN ('all', 'question', 'expert', 'skill', 'post') THEN
    v_type := 'all';
  END IF;

  v_like := '%' || v_query || '%';

  RETURN jsonb_build_object(
    'recent_keywords',
    COALESCE((
      SELECT jsonb_agg(r.query_text)
      FROM (
        SELECT sh.query_text, sh.last_used_at
        FROM public.search_history sh
        WHERE v_uid IS NOT NULL
          AND sh.user_id = v_uid
          AND (sh.query_type = v_type OR sh.query_type = 'all' OR v_type = 'all')
          AND (v_query = '' OR sh.query_text ILIKE v_like)
        ORDER BY sh.last_used_at DESC
        LIMIT v_limit
      ) r
    ), '[]'::jsonb),

    'hot_keywords',
    COALESCE((
      SELECT jsonb_agg(h.keyword)
      FROM (
        SELECT hk.keyword, hk.score
        FROM public.hot_keywords hk
        WHERE hk.is_active = true
          AND (hk.keyword_type = v_type OR hk.keyword_type = 'all' OR v_type = 'all')
          AND (v_query = '' OR hk.keyword ILIKE v_like)
        ORDER BY hk.score DESC, hk.updated_at DESC
        LIMIT v_limit
      ) h
    ), '[]'::jsonb),

    'suggestions',
    COALESCE((
      SELECT jsonb_agg(s.term)
      FROM (
        SELECT DISTINCT term
        FROM (
          SELECT sh.query_text AS term, sh.last_used_at AS weight
          FROM public.search_history sh
          WHERE v_uid IS NOT NULL
            AND sh.user_id = v_uid
            AND (sh.query_type = v_type OR sh.query_type = 'all' OR v_type = 'all')
            AND (v_query = '' OR sh.query_text ILIKE v_like)

          UNION ALL

          SELECT hk.keyword AS term, hk.updated_at AS weight
          FROM public.hot_keywords hk
          WHERE hk.is_active = true
            AND (hk.keyword_type = v_type OR hk.keyword_type = 'all' OR v_type = 'all')
            AND (v_query = '' OR hk.keyword ILIKE v_like)

          UNION ALL

          SELECT q.title AS term, q.created_at AS weight
          FROM public.questions q
          WHERE (v_type = 'all' OR v_type = 'question')
            AND q.status IN ('open', 'matched', 'solved')
            AND v_query <> ''
            AND q.title ILIKE v_like

          UNION ALL

          SELECT COALESCE(e.headline, p.nickname) AS term, e.updated_at AS weight
          FROM public.experts e
          LEFT JOIN public.profiles p ON p.user_id = e.user_id
          WHERE (v_type = 'all' OR v_type = 'expert')
            AND e.profile_status = 'active'
            AND v_query <> ''
            AND (
              COALESCE(e.headline, '') ILIKE v_like
              OR COALESCE(p.nickname, '') ILIKE v_like
            )

          UNION ALL

          SELECT s.title AS term, s.created_at AS weight
          FROM public.skill_offers s
          WHERE (v_type = 'all' OR v_type = 'skill')
            AND s.status = 'published'
            AND v_query <> ''
            AND s.title ILIKE v_like

          UNION ALL

          SELECT left(po.content, 24) AS term, po.created_at AS weight
          FROM public.posts po
          WHERE (v_type = 'all' OR v_type = 'post')
            AND v_query <> ''
            AND public.can_read_post(po.author_id, po.visibility, po.status)
            AND po.content ILIKE v_like
        ) c
        WHERE btrim(term) <> ''
        ORDER BY weight DESC
        LIMIT v_limit
      ) s
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_app_content_v2(text, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_search_suggestions_v2(text, integer, text) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.search_app_content_v2(text, integer) IS
'Pack 08-B 搜索统一函数：输出 questions/experts/skills/posts 四类结果（保留 legacy search_app_content 并行）。';

COMMENT ON FUNCTION public.get_search_suggestions_v2(text, integer, text) IS
'Pack 08-B 搜索建议函数：输出 recent_keywords/hot_keywords/suggestions（热词优先由 hot_keywords 运营配置驱动）。';
