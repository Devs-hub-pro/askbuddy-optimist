export interface ChannelThemePreset {
  pageClassName: string;
  headerGradientClass: string;
  searchStripClass: string;
  searchAccentRingClass: string;
  searchInputAccentClass: string;
  searchInputBorderClass: string;
  searchIconClass: string;
  featuredBadgeClass: string;
  featuredHintClass: string;
  activeCategoryClass: string;
  tabUnderlineClass: string;
  searchNavigateToPath: string;
}

export const CHANNEL_THEME_PRESETS: Record<'education' | 'career' | 'lifestyle' | 'hobbies', ChannelThemePreset> = {
  education: {
    pageClassName: 'bg-gradient-to-b from-[rgb(248,253,251)] via-white to-white',
    headerGradientClass: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    searchStripClass: 'bg-blue-50/90 border-blue-100/90',
    searchAccentRingClass: 'ring-blue-400/25',
    searchInputAccentClass: 'focus-visible:ring-blue-400/20 focus-visible:border-blue-200',
    searchInputBorderClass: 'border-blue-200/80',
    searchIconClass: 'text-blue-400',
    featuredBadgeClass: 'bg-blue-50 text-blue-600',
    featuredHintClass: 'text-blue-600',
    activeCategoryClass: 'bg-blue-500 text-white shadow-sm border-blue-500',
    tabUnderlineClass: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    searchNavigateToPath: '/search?channel=education',
  },
  career: {
    pageClassName: 'bg-gradient-to-b from-[rgb(248,253,251)] via-white to-white',
    headerGradientClass: 'bg-gradient-to-r from-green-500 to-teal-500',
    searchStripClass: 'bg-emerald-50/90 border-emerald-100/90',
    searchAccentRingClass: 'ring-emerald-400/25',
    searchInputAccentClass: 'focus-visible:ring-emerald-400/20 focus-visible:border-emerald-200',
    searchInputBorderClass: 'border-emerald-200/80',
    searchIconClass: 'text-emerald-500',
    featuredBadgeClass: 'bg-green-50 text-green-600',
    featuredHintClass: 'text-green-600',
    activeCategoryClass: 'bg-green-500 text-white shadow-sm border-green-500',
    tabUnderlineClass: 'bg-gradient-to-r from-green-500 to-teal-500',
    searchNavigateToPath: '/search?channel=career',
  },
  lifestyle: {
    pageClassName: 'bg-gradient-to-b from-[rgb(248,253,251)] via-white to-white',
    headerGradientClass: 'bg-gradient-to-r from-orange-500 to-amber-500',
    searchStripClass: 'bg-orange-50/90 border-orange-100/90',
    searchAccentRingClass: 'ring-orange-400/25',
    searchInputAccentClass: 'focus-visible:ring-orange-400/20 focus-visible:border-orange-200',
    searchInputBorderClass: 'border-orange-200/80',
    searchIconClass: 'text-orange-400',
    featuredBadgeClass: 'bg-orange-50 text-orange-600',
    featuredHintClass: 'text-orange-600',
    activeCategoryClass: 'bg-orange-500 text-white shadow-sm border-orange-500',
    tabUnderlineClass: 'bg-gradient-to-r from-app-orange to-amber-500',
    searchNavigateToPath: '/search?channel=lifestyle',
  },
  hobbies: {
    pageClassName: 'bg-gradient-to-b from-[rgb(248,253,251)] via-white to-white',
    headerGradientClass: 'bg-gradient-to-r from-pink-500 to-rose-500',
    searchStripClass: 'bg-rose-50/90 border-rose-100/90',
    searchAccentRingClass: 'ring-rose-400/25',
    searchInputAccentClass: 'focus-visible:ring-rose-400/20 focus-visible:border-rose-200',
    searchInputBorderClass: 'border-rose-200/80',
    searchIconClass: 'text-rose-400',
    featuredBadgeClass: 'bg-rose-50 text-rose-600',
    featuredHintClass: 'text-rose-600',
    activeCategoryClass: 'bg-rose-500 text-white shadow-sm border-rose-500',
    tabUnderlineClass: 'bg-gradient-to-r from-rose-500 to-pink-500',
    searchNavigateToPath: '/search?channel=hobbies',
  },
};
