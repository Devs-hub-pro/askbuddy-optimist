-- Pack 06: Orders / Points / Earnings (minimal viable ledger layer)
-- Scope:
-- 1) orders (upgrade to bilateral model on top of legacy table)
-- 2) payments (minimal payment records)
-- 3) point_transactions (ledger linked with point_accounts)
-- 4) earning_transactions (minimal earnings ledger)
--
-- Non-goals in Pack 06:
-- - complex split settlement / payout automation / dispute workflows
-- - third-party webhook verification flow implementation
-- - auto reward distribution for accept-answer / service completion

BEGIN;

-- -------------------------------------------------------------------
-- 0) prerequisites
-- -------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -------------------------------------------------------------------
-- 1) orders: migrate legacy shape -> minimal bilateral order model
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_type text NOT NULL,
  biz_ref_type text,
  biz_ref_id uuid,
  title text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CNY',
  point_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_payment',
  paid_at timestamptz,
  completed_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS biz_ref_type text,
  ADD COLUMN IF NOT EXISTS biz_ref_id uuid,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS point_amount integer,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Ensure amount is numeric(12,2)
DO $$
DECLARE
  v_data_type text;
BEGIN
  SELECT data_type
  INTO v_data_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'amount';

  IF v_data_type IS NOT NULL AND v_data_type <> 'numeric' THEN
    EXECUTE 'ALTER TABLE public.orders ALTER COLUMN amount TYPE numeric(12,2) USING amount::numeric';
  END IF;
END $$;

-- Drop legacy checks before normalization UPDATEs, otherwise legacy values
-- cannot be converted to Pack06 vocabulary under old constraints.
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Backfill from legacy user_id/order_type/status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'user_id'
  ) THEN
    EXECUTE $sql$
      UPDATE public.orders
      SET buyer_id = user_id
      WHERE buyer_id IS NULL
    $sql$;
  END IF;
END $$;

UPDATE public.orders
SET currency = 'CNY'
WHERE currency IS NULL;

UPDATE public.orders
SET point_amount = 0
WHERE point_amount IS NULL;

UPDATE public.orders
SET updated_at = coalesce(updated_at, created_at, now())
WHERE updated_at IS NULL;

-- Normalize legacy order_type values to Pack06 vocabulary
UPDATE public.orders
SET order_type = CASE order_type
  WHEN 'question' THEN 'question_reward'
  WHEN 'consultation' THEN 'skill_service'
  WHEN 'recharge' THEN 'points_recharge'
  WHEN 'withdraw' THEN 'system_adjustment'
  WHEN 'question_reward' THEN 'question_reward'
  WHEN 'skill_service' THEN 'skill_service'
  WHEN 'points_recharge' THEN 'points_recharge'
  WHEN 'system_adjustment' THEN 'system_adjustment'
  ELSE 'system_adjustment'
END;

-- Normalize legacy status values to Pack06 status machine
UPDATE public.orders
SET status = CASE status
  WHEN 'pending' THEN 'pending_payment'
  WHEN 'paid' THEN 'paid'
  WHEN 'completed' THEN 'completed'
  WHEN 'refunded' THEN 'refunded'
  WHEN 'cancelled' THEN 'closed'
  ELSE 'pending_payment'
END;

ALTER TABLE public.orders
  ALTER COLUMN buyer_id SET NOT NULL,
  ALTER COLUMN order_type SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN amount SET NOT NULL,
  ALTER COLUMN amount SET DEFAULT 0,
  ALTER COLUMN currency SET NOT NULL,
  ALTER COLUMN currency SET DEFAULT 'CNY',
  ALTER COLUMN point_amount SET NOT NULL,
  ALTER COLUMN point_amount SET DEFAULT 0,
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();

-- Drop old checks if present
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS pack06_orders_order_type_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS pack06_orders_status_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS pack06_orders_amount_non_negative;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS pack06_orders_point_amount_non_negative;

ALTER TABLE public.orders
  ADD CONSTRAINT pack06_orders_order_type_check CHECK (
    order_type = ANY (
      ARRAY[
        'question_reward',
        'skill_service',
        'points_recharge',
        'system_adjustment'
      ]
    )
  ),
  ADD CONSTRAINT pack06_orders_status_check CHECK (
    status = ANY (
      ARRAY[
        'pending_payment',
        'paid',
        'in_service',
        'completed',
        'refunded',
        'closed'
      ]
    )
  ),
  ADD CONSTRAINT pack06_orders_amount_non_negative CHECK (amount >= 0),
  ADD CONSTRAINT pack06_orders_point_amount_non_negative CHECK (point_amount >= 0);

-- -------------------------------------------------------------------
-- 2) payments: minimal payment records
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_channel text NOT NULL DEFAULT 'manual',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CNY',
  status text NOT NULL DEFAULT 'pending',
  external_txn_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack06_payments_status_check CHECK (
    status = ANY (ARRAY['pending', 'paid', 'failed', 'refunded'])
  ),
  CONSTRAINT pack06_payments_amount_non_negative CHECK (amount >= 0)
);

-- -------------------------------------------------------------------
-- 3) point_transactions: immutable point ledger
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  point_account_id uuid NOT NULL REFERENCES public.point_accounts(user_id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  direction text NOT NULL,
  amount integer NOT NULL,
  balance_after integer,
  biz_type text NOT NULL,
  biz_id uuid,
  note text,
  status text NOT NULL DEFAULT 'completed',
  idempotency_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack06_point_tx_direction_check CHECK (
    direction = ANY (ARRAY['credit', 'debit'])
  ),
  CONSTRAINT pack06_point_tx_amount_positive CHECK (amount > 0),
  CONSTRAINT pack06_point_tx_status_check CHECK (
    status = ANY (ARRAY['pending', 'completed', 'failed', 'reversed'])
  ),
  CONSTRAINT pack06_point_tx_balance_non_negative CHECK (
    balance_after IS NULL OR balance_after >= 0
  )
);

-- -------------------------------------------------------------------
-- 4) earning_transactions: minimal earnings ledger
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.earning_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  biz_type text NOT NULL,
  biz_id uuid,
  direction text NOT NULL DEFAULT 'income',
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack06_earnings_direction_check CHECK (
    direction = ANY (ARRAY['income', 'expense', 'adjustment'])
  ),
  CONSTRAINT pack06_earnings_status_check CHECK (
    status = ANY (ARRAY['pending', 'available', 'settled', 'reversed'])
  ),
  CONSTRAINT pack06_earnings_amount_non_negative CHECK (amount >= 0)
);

-- -------------------------------------------------------------------
-- 5) indexes
-- -------------------------------------------------------------------
-- orders
CREATE INDEX IF NOT EXISTS idx_pack06_orders_buyer_created
  ON public.orders(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_orders_seller_created
  ON public.orders(seller_id, created_at DESC)
  WHERE seller_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pack06_orders_status_created
  ON public.orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_orders_type_created
  ON public.orders(order_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_orders_biz_ref
  ON public.orders(biz_ref_type, biz_ref_id)
  WHERE biz_ref_type IS NOT NULL AND biz_ref_id IS NOT NULL;

-- payments
CREATE INDEX IF NOT EXISTS idx_pack06_payments_order_id
  ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_pack06_payments_payer_created
  ON public.payments(payer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_payments_status_created
  ON public.payments(status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pack06_payments_external_txn
  ON public.payments(external_txn_id)
  WHERE external_txn_id IS NOT NULL;

-- point_transactions
CREATE INDEX IF NOT EXISTS idx_pack06_point_tx_user_created
  ON public.point_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_point_tx_account_created
  ON public.point_transactions(point_account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_point_tx_biz
  ON public.point_transactions(biz_type, biz_id)
  WHERE biz_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pack06_point_tx_direction
  ON public.point_transactions(direction);
CREATE INDEX IF NOT EXISTS idx_pack06_point_tx_order_id
  ON public.point_transactions(order_id)
  WHERE order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pack06_point_tx_idempotency
  ON public.point_transactions(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- earning_transactions
CREATE INDEX IF NOT EXISTS idx_pack06_earnings_user_created
  ON public.earning_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_earnings_status_created
  ON public.earning_transactions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pack06_earnings_order_id
  ON public.earning_transactions(order_id)
  WHERE order_id IS NOT NULL;

-- -------------------------------------------------------------------
-- 6) RLS
-- -------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earning_transactions ENABLE ROW LEVEL SECURITY;

-- Clear legacy policies to avoid over-permissive access from old migrations
-- orders legacy policies from early migrations
DROP POLICY IF EXISTS "用户可以查看自己的订单" ON public.orders;
DROP POLICY IF EXISTS "用户可以创建订单" ON public.orders;
DROP POLICY IF EXISTS "用户可以更新自己的订单" ON public.orders;

-- pack06 policies (re-run safety)
DROP POLICY IF EXISTS "pack06_orders_participants_select" ON public.orders;
DROP POLICY IF EXISTS "pack06_orders_buyer_insert" ON public.orders;
DROP POLICY IF EXISTS "pack06_payments_participants_select" ON public.payments;
DROP POLICY IF EXISTS "pack06_point_tx_owner_select" ON public.point_transactions;
DROP POLICY IF EXISTS "pack06_earnings_owner_select" ON public.earning_transactions;

-- orders: buyer/seller can read; buyer can create. status updates reserved for service role.
CREATE POLICY "pack06_orders_participants_select"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = buyer_id
    OR auth.uid() = seller_id
  );

CREATE POLICY "pack06_orders_buyer_insert"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id
    AND (seller_id IS NULL OR seller_id <> buyer_id OR order_type = 'points_recharge')
  );

-- payments: participants can read; writes are server-side/service-role only.
CREATE POLICY "pack06_payments_participants_select"
  ON public.payments
  FOR SELECT
  USING (
    auth.uid() = payer_id
    OR EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = payments.order_id
        AND (auth.uid() = o.buyer_id OR auth.uid() = o.seller_id)
    )
  );

-- point ledger: owner read only, insert/update/delete reserved for service role.
CREATE POLICY "pack06_point_tx_owner_select"
  ON public.point_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- earnings ledger: owner read only, writes reserved for service role.
CREATE POLICY "pack06_earnings_owner_select"
  ON public.earning_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 7) helper functions & triggers (lightweight only)
-- -------------------------------------------------------------------
-- Ensure point_transactions.user_id is consistent with referenced point_accounts.user_id
CREATE OR REPLACE FUNCTION public.pack06_validate_point_transaction_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner_id uuid;
BEGIN
  SELECT pa.user_id
  INTO v_owner_id
  FROM public.point_accounts pa
  WHERE pa.user_id = NEW.point_account_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Invalid point_account_id: %', NEW.point_account_id;
  END IF;

  IF NEW.user_id IS DISTINCT FROM v_owner_id THEN
    RAISE EXCEPTION 'point_transactions.user_id must match point_accounts.user_id';
  END IF;

  RETURN NEW;
END;
$$;

-- Sync order paid timestamp/status from payment status=paid (minimal consistency)
CREATE OR REPLACE FUNCTION public.pack06_sync_order_status_from_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' THEN
    UPDATE public.orders
    SET
      status = CASE
        WHEN status = 'pending_payment' THEN 'paid'
        ELSE status
      END,
      paid_at = coalesce(NEW.paid_at, now()),
      updated_at = now()
    WHERE id = NEW.order_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pack06_orders_updated_at ON public.orders;
CREATE TRIGGER trg_pack06_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack06_payments_updated_at ON public.payments;
CREATE TRIGGER trg_pack06_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack06_earnings_updated_at ON public.earning_transactions;
CREATE TRIGGER trg_pack06_earnings_updated_at
  BEFORE UPDATE ON public.earning_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pack06_point_tx_validate_owner ON public.point_transactions;
CREATE TRIGGER trg_pack06_point_tx_validate_owner
  BEFORE INSERT OR UPDATE ON public.point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.pack06_validate_point_transaction_owner();

DROP TRIGGER IF EXISTS trg_pack06_payment_sync_order ON public.payments;
CREATE TRIGGER trg_pack06_payment_sync_order
  AFTER INSERT OR UPDATE OF status, paid_at ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.pack06_sync_order_status_from_payment();

-- -------------------------------------------------------------------
-- 8) comments (boundary notes)
-- -------------------------------------------------------------------
COMMENT ON TABLE public.orders IS
  'Pack06 minimal bilateral orders. Complex settlement/refund workflows are out of scope.';
COMMENT ON TABLE public.payments IS
  'Pack06 minimal payment records. External gateway callback processing is out of scope.';
COMMENT ON TABLE public.point_transactions IS
  'Pack06 immutable point ledger entries; system writes via service role/server-side logic.';
COMMENT ON TABLE public.earning_transactions IS
  'Pack06 minimal earnings ledger for MyEarnings and basic settlement visibility.';

COMMENT ON COLUMN public.orders.order_type IS
  'Allowed: question_reward, skill_service, points_recharge, system_adjustment';
COMMENT ON COLUMN public.orders.status IS
  'Allowed: pending_payment, paid, in_service, completed, refunded, closed';
COMMENT ON COLUMN public.point_transactions.direction IS
  'credit or debit';
COMMENT ON COLUMN public.earning_transactions.direction IS
  'income, expense, adjustment';

COMMIT;
