-- Pack 08-A: Ledger path cleanup (minimal, non-breaking)
-- Goal:
-- 1) Deprecate profiles.points_balance as display-only legacy field (if still exists)
-- 2) Constrain legacy points_transactions to compatibility read path
-- 3) Re-assert canonical ledger path:
--    point_accounts + point_transactions + earning_transactions
--
-- Non-goals:
-- - Do not drop legacy tables/columns
-- - Do not introduce Pack 08-B RPC/business flow changes
-- - Do not change Pack 01~07 data model contracts

BEGIN;

-- -------------------------------------------------------------------
-- 0) Canonical ledger path annotations
-- -------------------------------------------------------------------
COMMENT ON TABLE public.point_accounts IS
'Canonical points account snapshot (source of truth for current balances) since Pack06.';

COMMENT ON TABLE public.point_transactions IS
'Canonical immutable points ledger since Pack06. Use together with point_accounts.';

COMMENT ON TABLE public.earning_transactions IS
'Canonical earnings ledger since Pack06.';

-- -------------------------------------------------------------------
-- 1) Deprecate profiles.points_balance (if column still exists)
--    Keep for compatibility read only; block client-side writes.
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'points_balance'
  ) THEN
    EXECUTE $sql$
      COMMENT ON COLUMN public.profiles.points_balance IS
      'DEPRECATED since Pack08-A: not accounting source of truth. Keep only for legacy compatibility/read. Canonical ledger path is public.point_accounts + public.point_transactions + public.earning_transactions.';
    $sql$;

    EXECUTE $sql$
      CREATE OR REPLACE FUNCTION public.pack08_guard_profiles_points_balance_deprecated()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE
        v_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
      BEGIN
        IF NEW.points_balance IS DISTINCT FROM OLD.points_balance
           AND v_role IN ('authenticated', 'anon') THEN
          RAISE EXCEPTION 'profiles.points_balance is deprecated; use point_accounts + point_transactions instead';
        END IF;
        RETURN NEW;
      END;
      $fn$;
    $sql$;

    EXECUTE 'DROP TRIGGER IF EXISTS trg_pack08_guard_profiles_points_balance_deprecated ON public.profiles';
    EXECUTE $sql$
      CREATE TRIGGER trg_pack08_guard_profiles_points_balance_deprecated
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.pack08_guard_profiles_points_balance_deprecated();
    $sql$;
  END IF;
END $$;

-- -------------------------------------------------------------------
-- 2) Legacy points_transactions -> compatibility read layer
--    Keep table, keep owner read; remove direct client write path.
-- -------------------------------------------------------------------
DO $$
DECLARE
  p record;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'points_transactions'
  ) THEN
    EXECUTE $sql$
      COMMENT ON TABLE public.points_transactions IS
      'LEGACY compatibility ledger. Deprecated as primary write path since Pack08-A. Client writes are blocked; canonical writes must go to public.point_transactions.';
    $sql$;

    -- Ensure RLS is enabled for legacy table.
    EXECUTE 'ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY';

    -- Replace any previous permissive/legacy policies with strict owner-read only.
    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'points_transactions'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.points_transactions', p.policyname);
    END LOOP;

    EXECUTE $sql$
      CREATE POLICY pack08_legacy_points_tx_owner_read
      ON public.points_transactions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
    $sql$;

    -- Explicitly remove direct DML privileges for client roles.
    EXECUTE 'REVOKE INSERT, UPDATE, DELETE ON TABLE public.points_transactions FROM authenticated, anon';
    -- Keep read capability subject to RLS policy.
    EXECUTE 'GRANT SELECT ON TABLE public.points_transactions TO authenticated';
  END IF;
END $$;

COMMIT;

