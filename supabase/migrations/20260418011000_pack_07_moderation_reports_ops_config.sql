-- Pack 07: Moderation / Reports / Ops Config (minimal backend foundation)
-- Scope:
-- 1) content_reports
-- 2) moderation_queue
-- 3) audit_logs
-- 4) system_configs
-- 5) recommendation_slots
--
-- Principles:
-- - keep RBAC lightweight (service-role/server-side first)
-- - no complex CMS / risk-control engines / recommendation engines
-- - no Pack08 scope

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -------------------------------------------------------------------
-- 0) shared helper functions
-- -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------------
-- 1) content_reports (user report intake + owner visibility)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  resolution text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack07_reports_target_type_check CHECK (
    target_type = ANY (
      ARRAY[
        'question',
        'answer',
        'post',
        'skill_offer',
        'expert',
        'message',
        'user_verification'
      ]
    )
  ),
  CONSTRAINT pack07_reports_status_check CHECK (
    status = ANY (ARRAY['pending', 'in_review', 'resolved', 'rejected'])
  )
);

ALTER TABLE public.content_reports
  ADD COLUMN IF NOT EXISTS reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS target_type text,
  ADD COLUMN IF NOT EXISTS target_id uuid,
  ADD COLUMN IF NOT EXISTS reason text,
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS resolution text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Normalize legacy status values if present
UPDATE public.content_reports
SET status = CASE status
  WHEN 'reviewing' THEN 'in_review'
  ELSE status
END
WHERE status IN ('reviewing');

UPDATE public.content_reports
SET status = 'pending'
WHERE status IS NULL;

-- Re-apply constraints safely
ALTER TABLE public.content_reports DROP CONSTRAINT IF EXISTS pack07_reports_target_type_check;
ALTER TABLE public.content_reports DROP CONSTRAINT IF EXISTS pack07_reports_status_check;
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
        'user_verification'
      ]
    )
  ),
  ADD CONSTRAINT pack07_reports_status_check CHECK (
    status = ANY (ARRAY['pending', 'in_review', 'resolved', 'rejected'])
  );

-- -------------------------------------------------------------------
-- 2) moderation_queue (review task queue, service-side processing)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_report_id uuid REFERENCES public.content_reports(id) ON DELETE SET NULL,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  queue_status text NOT NULL DEFAULT 'pending',
  priority smallint NOT NULL DEFAULT 50,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT pack07_mod_queue_item_type_check CHECK (
    item_type = ANY (
      ARRAY[
        'question',
        'answer',
        'post',
        'skill_offer',
        'expert',
        'message',
        'user_verification'
      ]
    )
  ),
  CONSTRAINT pack07_mod_queue_status_check CHECK (
    queue_status = ANY (ARRAY['pending', 'in_review', 'processed', 'closed'])
  )
);

-- -------------------------------------------------------------------
-- 3) audit_logs (security/ops audit trail, not public)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  severity text NOT NULL DEFAULT 'info',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack07_audit_severity_check CHECK (
    severity = ANY (ARRAY['info', 'warning', 'error', 'critical'])
  )
);

-- -------------------------------------------------------------------
-- 4) system_configs (public subset only via is_public=true)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_configs (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Seed baseline config keys (idempotent)
INSERT INTO public.system_configs (key, value, description, is_public)
VALUES
  ('search.public_defaults', '{"max_results": 10}', '前台搜索基础配置', true),
  ('ops.review_defaults', '{"default_priority": 50}', '审核队列默认配置', false)
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------------------
-- 5) recommendation_slots (ops-curated slots, public reads are filtered)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendation_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  title text,
  subtitle text,
  image_url text,
  priority smallint NOT NULL DEFAULT 50,
  is_active boolean NOT NULL DEFAULT true,
  start_at timestamptz,
  end_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT pack07_rec_slot_target_type_check CHECK (
    target_type = ANY (
      ARRAY[
        'question',
        'answer',
        'post',
        'skill_offer',
        'expert',
        'topic'
      ]
    )
  ),
  CONSTRAINT pack07_rec_slot_window_check CHECK (
    end_at IS NULL OR start_at IS NULL OR end_at > start_at
  )
);

-- -------------------------------------------------------------------
-- 6) indexes
-- -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pack07_reports_reporter_created
  ON public.content_reports(reporter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack07_reports_status_created
  ON public.content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack07_reports_target
  ON public.content_reports(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_pack07_mod_queue_status_priority_created
  ON public.moderation_queue(queue_status, priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_pack07_mod_queue_item
  ON public.moderation_queue(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_pack07_mod_queue_assignee
  ON public.moderation_queue(assigned_to, queue_status);

CREATE INDEX IF NOT EXISTS idx_pack07_audit_created
  ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack07_audit_action_created
  ON public.audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack07_audit_entity
  ON public.audit_logs(entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pack07_system_configs_public_key
  ON public.system_configs(is_public, key);

CREATE INDEX IF NOT EXISTS idx_pack07_rec_slots_public_window
  ON public.recommendation_slots(slot_key, is_active, start_at, end_at, priority DESC);
CREATE INDEX IF NOT EXISTS idx_pack07_rec_slots_target
  ON public.recommendation_slots(target_type, target_id)
  WHERE target_id IS NOT NULL;

-- -------------------------------------------------------------------
-- 7) RLS
-- -------------------------------------------------------------------
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_slots ENABLE ROW LEVEL SECURITY;

-- Drop only Pack07 policy names for re-run safety
DROP POLICY IF EXISTS "pack07_reports_owner_select" ON public.content_reports;
DROP POLICY IF EXISTS "pack07_reports_owner_insert" ON public.content_reports;
DROP POLICY IF EXISTS "pack07_reports_service_update" ON public.content_reports;

DROP POLICY IF EXISTS "pack07_mod_queue_service_select" ON public.moderation_queue;
DROP POLICY IF EXISTS "pack07_mod_queue_service_mutate" ON public.moderation_queue;

DROP POLICY IF EXISTS "pack07_audit_logs_service_select" ON public.audit_logs;
DROP POLICY IF EXISTS "pack07_audit_logs_service_insert" ON public.audit_logs;

DROP POLICY IF EXISTS "pack07_system_configs_public_select" ON public.system_configs;
DROP POLICY IF EXISTS "pack07_system_configs_service_manage" ON public.system_configs;

DROP POLICY IF EXISTS "pack07_recommendation_slots_public_select" ON public.recommendation_slots;
DROP POLICY IF EXISTS "pack07_recommendation_slots_service_manage" ON public.recommendation_slots;

-- content_reports: user can insert/read own reports; updates are service-side
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

-- moderation_queue: only service-role/server-side
CREATE POLICY "pack07_mod_queue_service_select"
  ON public.moderation_queue
  FOR SELECT
  USING (public.is_service_role());

CREATE POLICY "pack07_mod_queue_service_mutate"
  ON public.moderation_queue
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- audit_logs: only service-role/server-side
CREATE POLICY "pack07_audit_logs_service_select"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_service_role());

CREATE POLICY "pack07_audit_logs_service_insert"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (public.is_service_role());

-- system_configs: only is_public=true is readable by normal clients
CREATE POLICY "pack07_system_configs_public_select"
  ON public.system_configs
  FOR SELECT
  USING (is_public = true OR public.is_service_role());

CREATE POLICY "pack07_system_configs_service_manage"
  ON public.system_configs
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- recommendation_slots:
-- public read is restricted to active + in-window; all writes service-side only
CREATE POLICY "pack07_recommendation_slots_public_select"
  ON public.recommendation_slots
  FOR SELECT
  USING (
    public.is_service_role()
    OR (
      is_active = true
      AND (start_at IS NULL OR start_at <= now())
      AND (end_at IS NULL OR end_at > now())
    )
  );

CREATE POLICY "pack07_recommendation_slots_service_manage"
  ON public.recommendation_slots
  FOR ALL
  USING (public.is_service_role())
  WITH CHECK (public.is_service_role());

-- -------------------------------------------------------------------
-- 8) triggers
-- -------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_pack07_reports_updated_at ON public.content_reports;
CREATE TRIGGER trg_pack07_reports_updated_at
  BEFORE UPDATE ON public.content_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack07_mod_queue_updated_at ON public.moderation_queue;
CREATE TRIGGER trg_pack07_mod_queue_updated_at
  BEFORE UPDATE ON public.moderation_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack07_system_configs_updated_at ON public.system_configs;
CREATE TRIGGER trg_pack07_system_configs_updated_at
  BEFORE UPDATE ON public.system_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack07_recommendation_slots_updated_at ON public.recommendation_slots;
CREATE TRIGGER trg_pack07_recommendation_slots_updated_at
  BEFORE UPDATE ON public.recommendation_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.content_reports IS
  'Pack07 report intake. Normal users can submit/read own reports only.';
COMMENT ON TABLE public.moderation_queue IS
  'Pack07 moderation work queue. Service-side read/write only.';
COMMENT ON TABLE public.audit_logs IS
  'Pack07 audit trail. Service-side read/write only.';
COMMENT ON TABLE public.system_configs IS
  'Pack07 system configs. Public clients can read only is_public=true rows.';
COMMENT ON TABLE public.recommendation_slots IS
  'Pack07 recommendation slots. Public clients can read only active and in-window rows.';

COMMIT;
