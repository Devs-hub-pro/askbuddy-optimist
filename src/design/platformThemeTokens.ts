import { getNativePlatform } from '@/utils/platform';

export type PlatformDesignToken = {
  pageHorizontalPadding: string;
  headerHeight: number;
  bottomNavHeight: number;
  cardRadius: string;
};

export const IOS_TOKENS: PlatformDesignToken = {
  pageHorizontalPadding: '1rem',
  headerHeight: 48,
  bottomNavHeight: 56,
  cardRadius: '1.5rem',
};

export const ANDROID_TOKENS: PlatformDesignToken = {
  pageHorizontalPadding: '1rem',
  headerHeight: 52,
  bottomNavHeight: 64,
  cardRadius: '1rem',
};

export const getPlatformDesignTokens = (): PlatformDesignToken => {
  const platform = getNativePlatform();
  if (platform === 'android') return ANDROID_TOKENS;
  return IOS_TOKENS;
};
