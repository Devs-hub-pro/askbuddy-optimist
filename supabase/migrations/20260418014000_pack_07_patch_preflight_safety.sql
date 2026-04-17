-- Pack 07 preflight safety patch
-- Goal: tighten compatibility and boundary safety without rewriting Pack 07.

BEGIN;

-- -------------------------------------------------------------------
-- 1) content_reports compatibility safety:
--    legacy constraints may block status/target normalization.
-- -------------------------------------------------------------------
ALTER TABLE public.content_reports
  DROP CONSTRAINT IF EXISTS content_reports_status_check,
  DROP CONSTRAINT IF EXISTS content_reports_target_type_check,
  DROP CONSTRAINT IF EXISTS pack07_reports_status_check,
  DROP CONSTRAINT IF EXISTS pack07_reports_target_type_check;

-- Normalize legacy values to Pack07 canonical vocabulary.
UPDATE public.content_reports
SET status = CASE status
  WHEN 'reviewing' THEN 'in_review'
  ELSE status
END
WHERE status IN ('reviewing');

UPDATE public.content_reports
SET target_type = CASE target_type
  WHEN 'discussion' THEN 'post'
  WHEN 'profile' THEN 'expert'
  WHEN 'user_verification' THEN 'user_verifications'
  ELSE target_type
END
WHERE target_type IN ('discussion', 'profile', 'user_verification');

UPDATE public.content_reports
SET status = 'pending'
WHERE status IS NULL;

-- Re-apply Pack07 constraints (canonical set).
ALTER TABLE public.content_reports
  ADD CONSTRAINT pack07_reports_target_type_check CHECK (
    target_type = ANY (
      ARRAY[
        'question',
        'answer',
        'post',
        'skill_offer',
        'expert',
        'message',
        'user_verifications'
      ]
    )
  ),
  ADD CONSTRAINT pack07_reports_status_check CHECK (
    status = ANY (ARRAY['pending', 'in_review', 'resolved', 'rejected'])
  );

-- -------------------------------------------------------------------
-- 2) policy boundary hardening:
--    remove legacy moderator/admin policies from old migration to enforce
--    service-role/server-side processing path in Pack07.
-- -------------------------------------------------------------------
DROP POLICY IF EXISTS "用户可查看自己举报" ON public.content_reports;
DROP POLICY IF EXISTS "登录用户可提交举报" ON public.content_reports;
DROP POLICY IF EXISTS "管理员可处理举报" ON public.content_reports;

-- Recreate Pack07 expected policies idempotently.
DROP POLICY IF EXISTS "pack07_reports_owner_select" ON public.content_reports;
DROP POLICY IF EXISTS "pack07_reports_owner_insert" ON public.content_reports;
DROP POLICY IF EXISTS "pack07_reports_service_update" ON public.content_reports;

CREATE POLICY "pack07_reports_owner_select"
  ON public.content_reports
  FOR SELECT
  USING (auth.uid() = reporter_id OR public.is_service_role());

CREATE POLICY "pack07_reports_owner_insert"
  ON public.content_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "pack07_reports_service_update"
  ON public.content_reports
  FOR UPDATE
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- -------------------------------------------------------------------
-- 3) moderation_queue target/item naming alignment
-- -------------------------------------------------------------------
ALTER TABLE public.moderation_queue
  DROP CONSTRAINT IF EXISTS pack07_mod_queue_item_type_check;

ALTER TABLE public.moderation_queue
  ADD CONSTRAINT pack07_mod_queue_item_type_check CHECK (
    item_type = ANY (
      ARRAY[
        'question',
        'answer',
        'post',
        'skill_offer',
        'expert',
        'message',
        'user_verifications'
      ]
    )
  );

-- -------------------------------------------------------------------
-- 4) recommendation_slots public exposure hardening
--    Keep row-level public filtering from Pack07 and avoid leaking
--    backend notes/operator fields to anon/authenticated roles.
-- -------------------------------------------------------------------
REVOKE SELECT (notes, created_by, updated_by)
ON TABLE public.recommendation_slots
FROM anon, authenticated;

COMMIT;
