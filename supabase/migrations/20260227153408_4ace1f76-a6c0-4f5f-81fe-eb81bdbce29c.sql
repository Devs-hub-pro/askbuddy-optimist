
-- Create drafts table for saving question drafts
CREATE TABLE public.drafts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  content text DEFAULT '',
  category text,
  tags text[] DEFAULT '{}',
  bounty_points integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的草稿" ON public.drafts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以创建草稿" ON public.drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的草稿" ON public.drafts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的草稿" ON public.drafts FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON public.drafts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create talent_certifications table
CREATE TABLE public.talent_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  cert_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  details jsonb DEFAULT '{}',
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.talent_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的认证" ON public.talent_certifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "用户可以申请认证" ON public.talent_certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的认证" ON public.talent_certifications FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.talent_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
