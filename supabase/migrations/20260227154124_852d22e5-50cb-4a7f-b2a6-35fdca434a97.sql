ALTER TABLE public.orders DROP CONSTRAINT orders_order_type_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_order_type_check CHECK (order_type = ANY (ARRAY['question', 'recharge', 'withdraw', 'consultation']));

ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status = ANY (ARRAY['pending', 'paid', 'cancelled', 'refunded', 'completed']));