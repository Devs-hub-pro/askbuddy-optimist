export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;

  const capacitor = (window as any).Capacitor;
  if (capacitor && typeof capacitor.isNativePlatform === 'function') {
    try {
      return !!capacitor.isNativePlatform();
    } catch {
      return false;
    }
  }

  return false;
};
