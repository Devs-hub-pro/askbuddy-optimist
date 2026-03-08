import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, Search, User, MessageCircle, Sparkles, Eye, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from "@/components/SearchBar";
import { useSearch, popularSearchTerms, type SearchQuestion, type SearchTopic, type SearchUser } from '@/hooks/useSearch';
import { demoExperts, demoQuestions } from '@/lib/demoData';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { navigateBackOr } from '@/utils/navigation';
import PageStateCard from '@/components/common/PageStateCard';

const SEARCH_HISTORY_KEY = 'searchHistory';
const channelThemes = {
  education: {
    title: '教育学习搜索',
    headerClass: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    pageClass: 'bg-gradient-to-b from-blue-50/70 via-white to-white',
    searchStripClass: 'bg-blue-50/90 border-b border-blue-100/90',
    accentRingClass: 'ring-blue-400/25',
    inputAccentClass: 'focus-visible:ring-blue-400/20 focus-visible:border-blue-200',
    inputBorderClass: 'border-blue-200/80',
    iconClass: 'text-blue-500',
    historyChipClass: 'border-blue-100 text-blue-700',
    suggestionClass: 'bg-blue-50 text-blue-600',
    backTo: '/education',
  },
  career: {
    title: '职业发展搜索',
    headerClass: 'bg-gradient-to-r from-green-500 to-teal-500',
    pageClass: 'bg-gradient-to-b from-emerald-50/70 via-white to-white',
    searchStripClass: 'bg-emerald-50/90 border-b border-emerald-100/90',
    accentRingClass: 'ring-emerald-400/25',
    inputAccentClass: 'focus-visible:ring-emerald-400/20 focus-visible:border-emerald-200',
    inputBorderClass: 'border-emerald-200/80',
    iconClass: 'text-emerald-500',
    historyChipClass: 'border-emerald-100 text-emerald-700',
    suggestionClass: 'bg-emerald-50 text-emerald-600',
    backTo: '/career',
  },
  lifestyle: {
    title: '生活服务搜索',
    headerClass: 'bg-gradient-to-r from-orange-500 to-amber-500',
    pageClass: 'bg-gradient-to-b from-orange-50/70 via-white to-white',
    searchStripClass: 'bg-orange-50/90 border-b border-orange-100/90',
    accentRingClass: 'ring-orange-400/25',
    inputAccentClass: 'focus-visible:ring-orange-400/20 focus-visible:border-orange-200',
    inputBorderClass: 'border-orange-200/80',
    iconClass: 'text-orange-500',
    historyChipClass: 'border-orange-100 text-orange-700',
    suggestionClass: 'bg-orange-50 text-orange-600',
    backTo: '/lifestyle',
  },
  hobbies: {
    title: '兴趣技能搜索',
    headerClass: 'bg-gradient-to-r from-pink-500 to-rose-500',
    pageClass: 'bg-gradient-to-b from-rose-50/70 via-white to-white',
    searchStripClass: 'bg-rose-50/90 border-b border-rose-100/90',
    accentRingClass: 'ring-rose-400/25',
    inputAccentClass: 'focus-visible:ring-rose-400/20 focus-visible:border-rose-200',
    inputBorderClass: 'border-rose-200/80',
    iconClass: 'text-rose-500',
    historyChipClass: 'border-rose-100 text-rose-700',
    suggestionClass: 'bg-rose-50 text-rose-600',
    backTo: '/hobbies',
  },
  default: {
    title: '搜索',
    headerClass: 'app-header-bg',
    pageClass: 'bg-gradient-to-b from-white to-blue-50/30',
    searchStripClass: 'app-header-soft-bg app-soft-border border-b',
    accentRingClass: 'ring-app-teal/25',
    inputAccentClass: 'focus-visible:ring-app-teal/25 focus-visible:border-app-teal/30',
    inputBorderClass: 'app-soft-border border',
    iconClass: 'text-app-teal',
    historyChipClass: 'app-soft-border border text-slate-700',
    suggestionClass: 'app-soft-surface-bg app-accent-text',
    backTo: '/',
  },
} as const;

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const channel = searchParams.get('channel') || 'default';
  const theme = channelThemes[channel as keyof typeof channelThemes] || channelThemes.default;
  const tabStorageKey = `tab:search:${channel}`;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'topics' | 'users'>(() => {
    const cached = sessionStorage.getItem(`tab:search:${channel}`);
    if (cached === 'questions' || cached === 'topics' || cached === 'users') return cached;
    return 'all';
  });
  const [questionSort, setQuestionSort] = useState<'relevance' | 'latest' | 'hot'>('relevance');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>('全部');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const contentTopOffset = 'calc(env(safe-area-inset-top) + 8rem)';

  const { data: results, isLoading, error, refetch } = useSearch(debouncedQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    if (debouncedQuery) {
      newParams.set('q', debouncedQuery);
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
      setRecentSearches((current) => {
        const next = [debouncedQuery, ...current.filter((item) => item !== debouncedQuery)].slice(0, 8);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    } else if (searchParams.get('q')) {
      newParams.delete('q');
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    }
  }, [debouncedQuery, location.pathname, location.search, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === 'string'));
      }
    } catch {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(tabStorageKey, activeTab);
  }, [activeTab, tabStorageKey]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleTopicSelect = (topic: string) => {
    setSearchQuery(topic);
    setDebouncedQuery(topic);
  };

  const totalResults = (results?.questions.length || 0) + (results?.topics.length || 0) + (results?.users.length || 0);
  const noResults = debouncedQuery.trim() && !isLoading && totalResults === 0;
  const showError = debouncedQuery.trim() && !!error;
  const showSuggestions = searchQuery.trim().length > 0 && searchQuery !== debouncedQuery;

  const suggestionTerms = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return [] as string[];

    const candidates = [
      ...recentSearches,
      ...popularSearchTerms,
      ...demoQuestions.flatMap((item) => [item.title, ...(item.tags || [])]),
      ...demoExperts.flatMap((item) => [item.title || '', ...(item.tags || [])]),
    ];

    return candidates
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.toLowerCase().includes(keyword))
      .filter((item, index, arr) => arr.findIndex((entry) => entry.toLowerCase() === item.toLowerCase()) === index)
      .slice(0, 6);
  }, [searchQuery, recentSearches]);

  const questionCategoryOptions = useMemo(() => {
    const categories = (results?.questions || [])
      .map((item) => (item.category || '').trim())
      .filter((item) => item.length > 0)
      .filter((item, index, arr) => arr.findIndex((entry) => entry === item) === index)
      .slice(0, 6);
    return ['全部', ...categories];
  }, [results?.questions]);

  useEffect(() => {
    if (!questionCategoryOptions.includes(questionCategoryFilter)) {
      setQuestionCategoryFilter('全部');
    }
  }, [questionCategoryFilter, questionCategoryOptions]);

  const filteredSortedQuestions = useMemo(() => {
    const source = [...(results?.questions || [])];
    const byCategory = questionCategoryFilter === '全部'
      ? source
      : source.filter((item) => (item.category || '').trim() === questionCategoryFilter);

    if (questionSort === 'latest') {
      return byCategory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (questionSort === 'hot') {
      return byCategory.sort((a, b) => {
        const aHot = Number(a.view_count || 0) + Number(a.answers_count || 0) * 6 + Number(a.bounty_points || 0);
        const bHot = Number(b.view_count || 0) + Number(b.answers_count || 0) * 6 + Number(b.bounty_points || 0);
        return bHot - aHot;
      });
    }
    return byCategory;
  }, [questionCategoryFilter, questionSort, results?.questions]);

  return (
    <div className={`app-container min-h-[100dvh] pb-8 ${theme.pageClass}`}>
      {/* Header */}
      <div className={`fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 shadow-sm ${theme.headerClass}`}>
        <div style={{ height: 'env(safe-area-inset-top)' }} />
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => navigateBackOr(navigate, theme.backTo)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">{theme.title}</div>
          <button className="text-white" onClick={() => navigate('/notifications')}><Bell size={20} /></button>
        </div>

        <div className={`shadow-[0_1px_0_rgba(15,23,42,0.03)] ${theme.searchStripClass}`}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="搜索问题/话题/用户"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            accentRingClassName={theme.accentRingClass}
            inputAccentClassName={theme.inputAccentClass}
            inputBorderClassName={theme.inputBorderClass}
            iconClassName={theme.iconClass}
            className="py-2.5"
          />
        </div>
      </div>

      <div className="p-4" style={{ paddingTop: contentTopOffset }}>
        {showSuggestions && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium text-muted-foreground">搜索建议</p>
            <div className="space-y-1">
              {suggestionTerms.length > 0 ? (
                suggestionTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-muted"
                    onClick={() => handleTopicSelect(term)}
                  >
                    <span className="line-clamp-1">{term}</span>
                    <Search size={14} className="text-slate-400" />
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">继续输入查看更多建议</p>
              )}
            </div>
          </div>
        )}

        {/* No query: show popular terms */}
        {!debouncedQuery.trim() && (
          <>
            {recentSearches.length > 0 && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Search size={18} className={`mr-2 ${theme.iconClass}`} />
                    <h2 className="text-base font-semibold">最近搜索</h2>
                  </div>
                  <button
                    className="text-xs text-muted-foreground"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem(SEARCH_HISTORY_KEY);
                    }}
                  >
                    清空
                  </button>
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                  {recentSearches.map((topic, i) => (
                    <button
                      key={`${topic}-${i}`}
                      onClick={() => handleTopicSelect(topic)}
                      className={`rounded-full border bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-gray-50 ${theme.historyChipClass}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mb-4 flex items-center">
              <Search size={20} className={`mr-2 ${theme.iconClass}`} />
              <h2 className="text-lg font-bold">热门搜索</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {popularSearchTerms.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleTopicSelect(topic)}
                  className="bg-white text-gray-700 text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        )}

        {showError && (
          <PageStateCard
            variant="error"
            compact
            title="搜索暂时不可用"
            description={error instanceof Error ? error.message : '请检查网络后重试'}
            actionLabel="重试"
            onAction={() => refetch()}
          />
        )}

        {/* Loading */}
        {isLoading && debouncedQuery.trim() && !showError && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card rounded-2xl p-4 shadow-sm space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {noResults && !showError && (
          <div className="surface-card rounded-2xl p-6 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配结果</h3>
              <p className="text-gray-500 max-w-xs mb-4">
                尝试使用不同的关键词，或者直接提问
              </p>
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {popularSearchTerms.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTopicSelect(term)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${theme.suggestionClass}`}
                  >
                    试试搜 {term}
                  </button>
                ))}
              </div>
              <Button onClick={() => navigate(theme.backTo)} variant="outline" className="app-soft-border app-accent-text border hover:app-soft-surface-bg">
                返回上页
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {debouncedQuery.trim() && !isLoading && !showError && totalResults > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">"{debouncedQuery}" 的搜索结果</h2>
            </div>

            <div className="mb-4 space-y-2 rounded-2xl border border-slate-100 bg-white/90 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">问题排序</p>
                <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
                  {[
                    { key: 'relevance', label: '综合' },
                    { key: 'latest', label: '最新' },
                    { key: 'hot', label: '最热' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setQuestionSort(item.key as 'relevance' | 'latest' | 'hot')}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                        questionSort === item.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {questionCategoryOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestionCategoryFilter(item)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      questionCategoryFilter === item
                        ? 'app-soft-border app-soft-surface-bg app-accent-text'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="w-full bg-gray-100 p-1 rounded-full mb-4">
                <TabsTrigger value="all" className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  全部({totalResults})
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  问题({results?.questions.length || 0})
                </TabsTrigger>
                <TabsTrigger value="topics" className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  话题({results?.topics.length || 0})
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-1 rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  用户({results?.users.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* All tab */}
              <TabsContent value="all" className="mt-0 space-y-4">
                {results && results.questions.length > 0 && (
                  <QuestionSection
                    questions={filteredSortedQuestions.slice(0, 3)}
                    onViewMore={() => setActiveTab('questions')}
                    showMore={filteredSortedQuestions.length > 3}
                    navigate={navigate}
                  />
                )}
                {results && results.topics.length > 0 && (
                  <TopicSection
                    topics={results.topics.slice(0, 2)}
                    onViewMore={() => setActiveTab('topics')}
                    showMore={results.topics.length > 2}
                    navigate={navigate}
                  />
                )}
                {results && results.users.length > 0 && (
                  <UserSection
                    users={results.users.slice(0, 3)}
                    onViewMore={() => setActiveTab('users')}
                    showMore={results.users.length > 3}
                    navigate={navigate}
                  />
                )}
              </TabsContent>

              {/* Questions tab */}
              <TabsContent value="questions" className="mt-0 space-y-3">
                {filteredSortedQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} navigate={navigate} />
                ))}
                {filteredSortedQuestions.length === 0 && <EmptyHint text="当前筛选下没有匹配的问题" />}
              </TabsContent>

              {/* Topics tab */}
              <TabsContent value="topics" className="mt-0 space-y-3">
                {results?.topics.map((t) => (
                  <TopicCard key={t.id} topic={t} navigate={navigate} />
                ))}
                {results?.topics.length === 0 && <EmptyHint text="没有匹配的话题" />}
              </TabsContent>

              {/* Users tab */}
              <TabsContent value="users" className="mt-0 space-y-3">
                {results?.users.map((u) => (
                  <UserCard key={u.id} user={u} navigate={navigate} />
                ))}
                {results?.users.length === 0 && <EmptyHint text="没有匹配的用户" />}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

    </div>
  );
};

// --- Sub-components ---

const EmptyHint = ({ text }: { text: string }) => (
  <div className="text-center py-8 text-gray-400 text-sm">{text}</div>
);

const QuestionCard = ({ question: q, navigate }: { question: SearchQuestion; navigate: ReturnType<typeof useNavigate> }) => {
  const timeAgo = formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: zhCN });
  return (
    <div className="surface-card rounded-2xl p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <button type="button" className="flex-1 text-left" onClick={() => navigate(`/question/${q.id}`)}>
          <h3 className="font-semibold text-base text-gray-800">{q.title}</h3>
        </button>
        <div className="flex items-center gap-1 text-gray-500 text-xs ml-2 flex-shrink-0">
          <Eye size={14} />
          <span>{q.view_count}</span>
        </div>
      </div>
      {q.content && (
        <button type="button" className="mb-3 block w-full text-left" onClick={() => navigate(`/question/${q.id}`)}>
          <p className="line-clamp-2 text-sm text-gray-600">{q.content}</p>
        </button>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={q.profile_avatar || ''} />
            <AvatarFallback className="text-xs">{(q.profile_nickname || '匿')[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">{q.profile_nickname}</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-2">
          {q.bounty_points > 0 && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-100">
              <Award size={12} />
              {q.bounty_points}
            </span>
          )}
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-xs text-gray-500"
            onClick={() => navigate(`/question/${q.id}`)}
          >
            <MessageCircle size={12} />
            {q.answers_count || 0}
          </button>
        </div>
      </div>
      {q.tags && q.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {q.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const TopicCard = ({ topic: t, navigate }: { topic: SearchTopic; navigate: ReturnType<typeof useNavigate> }) => (
  <div className="surface-card overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md">
    {t.cover_image && (
      <button type="button" className="block w-full" onClick={() => navigate(`/topic/${t.id}`)}>
        <img src={t.cover_image} alt={t.title} className="h-32 w-full object-cover" />
      </button>
    )}
    <div className="p-3">
      <button type="button" className="text-left" onClick={() => navigate(`/topic/${t.id}`)}>
        <h3 className="mb-1 text-sm font-semibold text-gray-800">{t.title}</h3>
      </button>
      {t.description && (
        <button type="button" className="mb-2 block text-left" onClick={() => navigate(`/topic/${t.id}`)}>
          <p className="line-clamp-1 text-xs text-gray-500">{t.description}</p>
        </button>
      )}
      <div className="flex items-center justify-between gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1 text-gray-500">
          <MessageCircle size={12} />
          {t.discussions_count} 讨论
        </span>
        <div className="flex items-center gap-2">
          {t.category && <span className="rounded-full bg-gray-100 px-2 py-0.5">{t.category}</span>}
          <button
            type="button"
            className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600"
            onClick={() => navigate(`/topic/${t.id}`)}
          >
            查看
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UserCard = ({ user: u, navigate }: { user: SearchUser; navigate: ReturnType<typeof useNavigate> }) => (
  <div className="surface-card flex items-center gap-3 rounded-2xl p-4 shadow-sm">
    <Avatar className="w-12 h-12">
      <AvatarImage src={u.avatar_url || ''} />
      <AvatarFallback>{(u.nickname || '用')[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-sm text-gray-800">{u.nickname || '匿名用户'}</h3>
      {u.bio && <p className="text-xs text-gray-500 line-clamp-1">{u.bio}</p>}
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
        onClick={() => navigate(`/chat/${u.user_id}`)}
      >
        私信
      </button>
    </div>
  </div>
);

const QuestionSection = ({
  questions,
  onViewMore,
  showMore,
  navigate,
}: {
  questions: SearchQuestion[];
  onViewMore: () => void;
  showMore: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-base font-semibold flex items-center">
        <Sparkles size={16} className="text-yellow-500 mr-1" />
        相关问题
      </h3>
      {showMore && (
        <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={onViewMore}>
          查看更多
        </Button>
      )}
    </div>
    <div className="space-y-3">
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} navigate={navigate} />
      ))}
    </div>
  </div>
);

const TopicSection = ({
  topics,
  onViewMore,
  showMore,
  navigate,
}: {
  topics: SearchTopic[];
  onViewMore: () => void;
  showMore: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-base font-semibold">🔥 相关话题</h3>
      {showMore && (
        <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={onViewMore}>
          查看更多
        </Button>
      )}
    </div>
    <div className="space-y-3">
      {topics.map((t) => (
        <TopicCard key={t.id} topic={t} navigate={navigate} />
      ))}
    </div>
  </div>
);

const UserSection = ({
  users,
  onViewMore,
  showMore,
  navigate,
}: {
  users: SearchUser[];
  onViewMore: () => void;
  showMore: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-base font-semibold">👤 相关用户</h3>
      {showMore && (
        <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={onViewMore}>
          查看更多
        </Button>
      )}
    </div>
    <div className="space-y-3">
      {users.map((u) => (
        <UserCard key={u.id} user={u} navigate={navigate} />
      ))}
    </div>
  </div>
);

export default SearchResults;
