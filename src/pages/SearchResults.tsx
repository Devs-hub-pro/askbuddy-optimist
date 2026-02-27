import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, Search, User, MessageCircle, Sparkles, Eye, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from "@/components/SearchBar";
import BottomNav from "@/components/BottomNav";
import { useSearch, popularSearchTerms, type SearchQuestion, type SearchTopic, type SearchUser } from '@/hooks/useSearch';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'topics' | 'users'>('all');

  const { data: results, isLoading } = useSearch(debouncedQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL
  useEffect(() => {
    if (debouncedQuery) {
      const newParams = new URLSearchParams(location.search);
      newParams.set('q', debouncedQuery);
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    }
  }, [debouncedQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleTopicSelect = (topic: string) => {
    setSearchQuery(topic);
    setDebouncedQuery(topic);
  };

  const totalResults = (results?.questions.length || 0) + (results?.topics.length || 0) + (results?.users.length || 0);
  const noResults = debouncedQuery.trim() && !isLoading && totalResults === 0;

  return (
    <div className="app-container bg-gradient-to-b from-white to-blue-50/30 min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-app-teal shadow-sm">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-white font-medium text-base">搜索</div>
          <button className="text-white"><Bell size={20} /></button>
        </div>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="搜索问题/话题/用户"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="p-4">
        {/* No query: show popular terms */}
        {!debouncedQuery.trim() && (
          <>
            <div className="flex items-center mb-4">
              <Search size={20} className="text-app-teal mr-2" />
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

        {/* Loading */}
        {isLoading && debouncedQuery.trim() && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm space-y-3">
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
        {noResults && (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配结果</h3>
              <p className="text-gray-500 max-w-xs mb-4">
                尝试使用不同的关键词，或者直接提问
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                返回主页
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {debouncedQuery.trim() && !isLoading && totalResults > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">"{debouncedQuery}" 的搜索结果</h2>
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
                    questions={results.questions.slice(0, 3)}
                    onViewMore={() => setActiveTab('questions')}
                    showMore={results.questions.length > 3}
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
                  />
                )}
              </TabsContent>

              {/* Questions tab */}
              <TabsContent value="questions" className="mt-0 space-y-3">
                {results?.questions.map((q) => (
                  <QuestionCard key={q.id} question={q} navigate={navigate} />
                ))}
                {results?.questions.length === 0 && <EmptyHint text="没有匹配的问题" />}
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
                  <UserCard key={u.id} user={u} />
                ))}
                {results?.users.length === 0 && <EmptyHint text="没有匹配的用户" />}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <BottomNav />
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
    <div
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
      onClick={() => navigate(`/question/${q.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base text-gray-800 flex-1">{q.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs ml-2 flex-shrink-0">
          <Eye size={14} />
          <span>{q.view_count}</span>
        </div>
      </div>
      {q.content && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{q.content}</p>
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
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MessageCircle size={12} />
            {q.answers_count || 0}
          </span>
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
  <div
    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    onClick={() => navigate(`/topic/${t.id}`)}
  >
    {t.cover_image && (
      <img src={t.cover_image} alt={t.title} className="w-full h-32 object-cover" />
    )}
    <div className="p-3">
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{t.title}</h3>
      {t.description && (
        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{t.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MessageCircle size={12} />
          {t.discussions_count} 讨论
        </span>
        {t.category && (
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">{t.category}</span>
        )}
      </div>
    </div>
  </div>
);

const UserCard = ({ user: u }: { user: SearchUser }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 border border-gray-100">
    <Avatar className="w-12 h-12">
      <AvatarImage src={u.avatar_url || ''} />
      <AvatarFallback>{(u.nickname || '用')[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-sm text-gray-800">{u.nickname || '匿名用户'}</h3>
      {u.bio && <p className="text-xs text-gray-500 line-clamp-1">{u.bio}</p>}
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
}: {
  users: SearchUser[];
  onViewMore: () => void;
  showMore: boolean;
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
        <UserCard key={u.id} user={u} />
      ))}
    </div>
  </div>
);

export default SearchResults;
