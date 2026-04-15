import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from '@/components/SearchBar';
import { isNativeApp } from '@/utils/platform';
import { buildFromState } from '@/utils/navigation';

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
  inactiveCategoryClass = 'bg-white shadow-sm app-soft-border text-slate-700',
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
  const location = useLocation();
  const nativeMode = isNativeApp();
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const searchCollapsedRef = useRef(false);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const nextCollapsed = window.scrollY > 28;
        if (nextCollapsed === searchCollapsedRef.current) return;
        searchCollapsedRef.current = nextCollapsed;
        setIsSearchCollapsed(nextCollapsed);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className={`app-container pb-20 ${pageClassName}`}>
      <div className={`fixed top-0 z-[90] w-full animate-fade-in ${nativeMode ? 'left-0' : 'left-1/2 max-w-md -translate-x-1/2'}`}>
        <div className={`${headerGradientClass} shadow-sm`}>
          <div style={{ height: 'env(safe-area-inset-top)' }} />
          <div className="flex items-center h-12 px-4">
            <button onClick={onBack} className="text-white">
              <ChevronLeft size={24} />
            </button>
            <div className="ml-2 text-base font-medium text-white">{title}</div>
            <div className="flex-1" />
            <button
              className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-200 ${
                isSearchCollapsed ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
              }`}
              onClick={() => navigate(searchNavigateToPath, { state: buildFromState(location) })}
              aria-label="打开搜索"
            >
              <Search size={16} />
            </button>
            <button
              className="text-white"
              onClick={() => navigate('/notifications', { state: buildFromState(location) })}
            >
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-b shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-all duration-200 ${searchStripClass} ${
            isSearchCollapsed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
          }`}
        >
          <div className="px-4 py-3">
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
      </div>

      <div
        className="px-4 pt-4 transition-[padding-top] duration-200"
        style={{
          paddingTop: isSearchCollapsed
            ? 'calc(env(safe-area-inset-top) + 3.5rem)'
            : 'calc(env(safe-area-inset-top) + 8.75rem)',
        }}
      >
        <div className="surface-card rounded-3xl p-4">
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

      <div className="relative mb-5 px-4 pt-3">
        <div className="relative">
          {showRightIndicator && (
            <button
              onClick={() => onScrollCategories('right')}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-md transition-colors hover:bg-slate-100"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          )}

          <div ref={categoryRef} className="w-full overflow-x-auto scrollbar-hide" data-no-swipe-back="true">
            <div className="flex space-x-2 pb-2 pr-4" style={{ minWidth: '100%' }}>
              {categories.map((category) => {
                const active = activeCategory === category.id;
                return (
                  <button
                    type="button"
                    key={category.id}
                    className={`flex-shrink-0 cursor-pointer rounded-full border px-3.5 py-2 transition-colors flex items-center gap-1.5 ${
                      active ? activeCategoryClass : inactiveCategoryClass
                    }`}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    {category.icon}
                    <span className="whitespace-nowrap text-xs font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 px-4">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'everyone' | 'experts')} className="w-full">
          <div className="relative mb-6 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[rgb(205,239,231)] after:content-['']">
            <TabsList className="h-auto w-full bg-transparent p-0">
              <TabsTrigger
                value="everyone"
                className="relative pb-2 text-base font-semibold data-[state=active]:bg-transparent data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=inactive]:text-slate-400"
              >
                大家都在问
                <span className={`absolute bottom-0 left-0 h-[3px] w-full rounded-full opacity-0 transition-opacity data-[state=active]:opacity-100 ${tabUnderlineClass}`} />
              </TabsTrigger>
              <TabsTrigger
                value="experts"
                className="relative pb-2 text-base font-semibold data-[state=active]:bg-transparent data-[state=active]:text-app-text data-[state=active]:shadow-none data-[state=inactive]:text-slate-400"
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
