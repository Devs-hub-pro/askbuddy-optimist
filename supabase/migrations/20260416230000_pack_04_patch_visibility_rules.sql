-- Pack 04 patch: 可见性规则显式收口
-- 目标：
-- 1) 明确 can_read_post(...) 对 public/followers/private/hidden/deleted 的最终口径
-- 2) followers 场景严格限定为 作者本人 + 关注者
-- 3) hidden/deleted 不向普通用户公开

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
  v_legacy_follow boolean := false;
BEGIN
  -- 作者本人永远可读自己的内容（包括 private / hidden / deleted）
  IF v_uid IS NOT NULL AND v_uid = p_author_id THEN
    RETURN true;
  END IF;

  -- 非作者用户：hidden / deleted 不公开可读
  IF p_status IN ('hidden', 'deleted') THEN
    RETURN false;
  END IF;

  -- 非 active 状态默认不公开（兼容未来扩展状态）
  IF p_status <> 'active' THEN
    RETURN false;
  END IF;

  -- active + public => 公开可读
  IF COALESCE(p_visibility, 'public') = 'public' THEN
    RETURN true;
  END IF;

  -- 未登录用户到此直接不可见（followers/private）
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  -- active + followers => 仅关注者可见（兼容 follows 与 legacy user_followers）
  IF p_visibility = 'followers' THEN
    IF to_regclass('public.user_followers') IS NOT NULL THEN
      EXECUTE
        'SELECT EXISTS (
           SELECT 1
           FROM public.user_followers uf
           WHERE uf.follower_id = $1
             AND uf.following_id = $2
         )'
      INTO v_legacy_follow
      USING v_uid, p_author_id;
    END IF;

    RETURN EXISTS (
      SELECT 1
      FROM public.follows f
      WHERE f.follower_id = v_uid
        AND f.followee_id = p_author_id
    ) OR v_legacy_follow;
  END IF;

  -- active + private => 非作者不可见
  RETURN false;
END;
$$;

COMMENT ON FUNCTION public.can_read_post(uuid, text, text) IS
'可见性规则：作者本人全可见；hidden/deleted 非作者不可见；active+public 公开；active+followers 仅关注者；active+private 仅作者。';

