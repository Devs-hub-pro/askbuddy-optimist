
-- Fix overly permissive INSERT policy on notifications
-- Drop the old policy and create a more restrictive one
DROP POLICY "系统可以创建通知" ON public.notifications;

-- Only allow authenticated users to insert notifications for themselves (triggers use SECURITY DEFINER)
CREATE POLICY "系统可以创建通知" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
