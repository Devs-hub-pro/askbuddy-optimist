import React from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from '@/components/SearchBar';

interface ChannelCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ChannelPageScaffoldProps {
  title: string;
  pageClassName: string;
  headerGradientClass: string;
  searchStripClass: string;
  searchAccentRingClass: string;
  searchInputAccentClass: string;
  searchInputBorderClass: string;
  searchIconClass: string;
  searchNavigateToPath: string;
  featuredBadgeClass: string;
  featuredHintClass: string;
  activeCategoryClass: string;
  inactiveCategoryClass?: string;
  tabUnderlineClass: string;
  categories: ChannelCategory[];
  activeCategory: string;
  categoryRef: React.RefObject<HTMLDivElement>;
  showRightIndicator: boolean;
  featuredTitle: string;
  featuredDescription: string;
  featuredHint: string;
  onBack: () => void;
  onScrollCategories: (direction: 'left' | 'right') => void;
  onSelectCategory: (categoryId: string) => void;
  onViewFeatured?: () => void;
  activeTab: 'everyone' | 'experts';
  onTabChange: (value: 'everyone' | 'experts') => void;
  children: React.ReactNode;
}

const ChannelPageScaffold: React.FC<ChannelPageScaffoldProps> = ({
  title,
  pageClassName,
  headerGradientClass,
  searchStripClass,
  searchAccentRingClass,
  searchInputAccentClass,
  searchInputBorderClass,
  searchIconClass,
  searchNavigateToPath,
  featuredBadgeClass,
  featuredHintClass,
  activeCategoryClass,
  inactiveCategoryClass = 'bg-white shadow-sm border-slate-200 text-slate-700',
  tabUnderlineClass,
  categories,
  activeCategory,
  categoryRef,
  showRightIndicator,
  featuredTitle,
  featuredDescription,
  featuredHint,
  onBack,
  onScrollCategories,
  onSelectCategory,
  onViewFeatured,
  activeTab,
  onTabChange,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`app-container pb-20 ${pageClassName}`}>
<<<<<<< HEAD
      <div className="sticky top-0 z-50 animate-fade-in">
=======
      <div className="fixed left-1/2 top-0 z-[90] w-full max-w-md -translate-x-1/2 animate-fade-in">
>>>>>>> a04765d (Update from local working directory)
        <div className={`${headerGradientClass} shadow-sm`}>
          <div style={{ height: 'env(safe-area-inset-top)' }} />
          <div className="flex items-center h-12 px-4">
            <button onClick={onBack} className="text-white">
              <ChevronLeft size={24} />
            </button>
            <div className="ml-2 text-base font-medium text-white">{title}</div>
            <div className="flex-1" />
            <button className="text-white" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className={`px-4 py-3 border-b shadow-[0_1px_0_rgba(15,23,42,0.03)] ${searchStripClass}`}>
          <SearchBar
            placeholder="搜索问题/达人/话题"
            clickToNavigate
            accentRingClassName={searchAccentRingClass}
            inputAccentClassName={searchInputAccentClass}
            inputBorderClassName={searchInputBorderClass}
            iconClassName={searchIconClass}
            navigateToPath={searchNavigateToPath}
          />
        </div>
      </div>

<<<<<<< HEAD
      <div className="px-4 pt-5">
        <div className="surface-card rounded-3xl p-5">
=======
      <div className="px-4 pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 7.5rem)' }}>
        <div className="surface-card rounded-3xl p-4">
>>>>>>> a04765d (Update from local working directory)
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${featuredBadgeClass}`}>
            本周精选
          </span>
          <h2 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{featuredTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{featuredDescription}</p>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs">
            <span className={`font-medium ${featuredHintClass}`}>{featuredHint}</span>
            {onViewFeatured ? (
              <button className="font-medium text-slate-500 hover:text-slate-700" onClick={onViewFeatured}>
                查看问题
              </button>
            ) : null}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="relative mb-6 px-4 pt-4">
=======
      <div className="relative mb-5 px-4 pt-3">
>>>>>>> a04765d (Update from local working directory)
        <div className="relative">
          {showRightIndicator && (
            <button
              onClick={() => onScrollCategories('right')}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-md transition-colors hover:bg-gray-100"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}

          <ScrollArea className="w-full" orientation="horizontal">
            <div ref={categoryRef} className="flex space-x-2 pb-2 pr-4" style={{ minWidth: '100%' }}>
              {categories.map((category) => {
                const active = activeCategory === category.id;
                return (
                  <div
                    key={category.id}
                    className={`flex-shrink-0 cursor-pointer rounded-full border px-3.5 py-2 transition-colors flex items-center gap-1.5 ${
                      active ? activeCategoryClass : inactiveCategoryClass
                    }`}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    {category.icon}
                    <span className="whitespace-nowrap text-xs font-medium">{category.name}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mb-7 px-4">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'everyone' | 'experts')} className="w-full">
          <div className="relative mb-7 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-100 after:content-['']">
=======
      <div className="mb-6 px-4">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'everyone' | 'experts')} className="w-full">
          <div className="relative mb-6 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-100 after:content-['']">
>>>>>>> a04765d (Update from local working directory)
            <TabsList className="h-auto w-full bg-transparent p-0">
              <TabsTrigger
                value="everyone"
                className="relative pb-2 text-base font-semibold data-[state=active]:bg-transparent data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                大家都在问
                <span className={`absolute bottom-0 left-0 h-[3px] w-full rounded-full opacity-0 transition-opacity data-[state=active]:opacity-100 ${tabUnderlineClass}`} />
              </TabsTrigger>
              <TabsTrigger
                value="experts"
                className="relative pb-2 text-base font-semibold data-[state=active]:bg-transparent data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=inactive]:text-gray-400"
              >
                找TA问问
                <span className={`absolute bottom-0 left-0 h-[3px] w-full rounded-full opacity-0 transition-opacity data-[state=active]:opacity-100 ${tabUnderlineClass}`} />
              </TabsTrigger>
            </TabsList>
          </div>

          {children}
        </Tabs>
      </div>
    </div>
  );
};

export default ChannelPageScaffold;
