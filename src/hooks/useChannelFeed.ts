import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  filterQuestionsByCategory,
  mapDemoExpertsByChannel,
  mapDemoQuestionsByChannel,
  mapExpertToUIModel,
  mapQuestionToUIModel,
  mergeUniqueById,
  type UIExpertCardModel,
  type UIQuestionModel,
} from '@/lib/adapters/contentAdapters';
import { demoExperts, demoQuestions } from '@/lib/demoData';

interface ChannelFeedResult {
  channel: string;
  subcategory: string | null;
  featured: Record<string, any> | null;
  questions: UIQuestionModel[];
  experts: UIExpertCardModel[];
}

const isMissingRpcError = (error: unknown, functionName: string) => {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes(`public.${functionName}`) || message.includes('schema cache');
};

const buildFallbackFeed = (
  channel: string,
  subcategory: string,
  questionKeywords: Record<string, string[]>
): ChannelFeedResult => {
  const demoQuestionModels = mapDemoQuestionsByChannel(demoQuestions, channel);
  const demoExpertModels = mapDemoExpertsByChannel(demoExperts, channel, { categoryFallback: 'all' });

  const questions =
    subcategory === 'all'
      ? demoQuestionModels
      : filterQuestionsByCategory(demoQuestionModels, subcategory, questionKeywords);

  const experts =
    subcategory === 'all'
      ? demoExpertModels
      : demoExpertModels.filter((item) => item.category === subcategory || item.category === 'all');

  return {
    channel,
    subcategory: subcategory === 'all' ? null : subcategory,
    featured: null,
    questions,
    experts,
  };
};

export const useChannelFeed = (
  channel: 'education-learning' | 'career-development' | 'lifestyle-services' | 'hobbies-skills',
  subcategory: string,
  options?: { questionKeywords?: Record<string, string[]> }
) => {
  const questionKeywords = options?.questionKeywords || {};

  return useQuery({
    queryKey: ['channel-feed', channel, subcategory],
    queryFn: async () => {
      const rpcResult = await (supabase as any).rpc('get_channel_feed', {
        p_channel: channel,
        p_subcategory: subcategory,
        p_questions_limit: 24,
        p_experts_limit: 16,
      });

      if (rpcResult.error) {
        if (!isMissingRpcError(rpcResult.error, 'get_channel_feed')) {
          throw rpcResult.error;
        }
        return buildFallbackFeed(channel, subcategory, questionKeywords);
      }

      const payload = rpcResult.data as any;

      const questionItems = Array.isArray(payload?.questions?.items)
        ? payload.questions.items
        : [];
      const expertItems = Array.isArray(payload?.experts?.items)
        ? payload.experts.items
        : [];

      const dbQuestions = questionItems.map((item: any) => mapQuestionToUIModel(item));
      const dbExperts = expertItems.map((item: any) => mapExpertToUIModel(item, { categoryFallback: 'all' }));

      const fallback = buildFallbackFeed(channel, subcategory, questionKeywords);

      return {
        channel: String(payload?.channel || channel),
        subcategory: payload?.subcategory || (subcategory === 'all' ? null : subcategory),
        featured: payload?.featured ?? null,
        questions: dbQuestions.length > 0 ? mergeUniqueById(dbQuestions, fallback.questions) : fallback.questions,
        experts: dbExperts.length > 0 ? mergeUniqueById(dbExperts, fallback.experts) : fallback.experts,
      } satisfies ChannelFeedResult;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

