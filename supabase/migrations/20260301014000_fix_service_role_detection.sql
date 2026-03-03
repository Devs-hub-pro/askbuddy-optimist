-- Fix service role detection for RPCs invoked with a service key.

CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_claim_role text;
  v_claims_raw text;
  v_claims jsonb;
BEGIN
  v_claim_role := coalesce(current_setting('request.jwt.claim.role', true), '');
  v_claims_raw := nullif(current_setting('request.jwt.claims', true), '');

  IF v_claims_raw IS NOT NULL THEN
    v_claims := v_claims_raw::jsonb;
  ELSE
    v_claims := '{}'::jsonb;
  END IF;

  RETURN
    v_claim_role = 'service_role'
    OR coalesce(v_claims ->> 'role', '') = 'service_role'
    OR session_user = 'service_role';
END;
$$;
