import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useUploadPostMedia = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (files: File[]): Promise<string[]> => {
      if (!user) throw new Error('请先登录');

      const urls: string[] = [];

      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from('post-media')
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('post-media')
          .getPublicUrl(path);

        urls.push(urlData.publicUrl);
      }

      return urls;
    },
    onError: (error: Error) => {
      toast({ title: '上传失败', description: error.message, variant: 'destructive' });
    },
  });
};
