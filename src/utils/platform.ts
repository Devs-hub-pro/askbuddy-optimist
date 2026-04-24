export type NativePlatform = 'android' | 'ios' | 'web';

const getCapacitor = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).Capacitor ?? null;
};

export const isNativeApp = (): boolean => {
  const capacitor = getCapacitor();
  if (!capacitor || typeof capacitor.isNativePlatform !== 'function') return false;

  try {
    return !!capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export const getNativePlatform = (): NativePlatform => {
  if (!isNativeApp()) return 'web';

  const capacitor = getCapacitor();
  if (!capacitor) return 'web';

  try {
    const raw = typeof capacitor.getPlatform === 'function' ? capacitor.getPlatform() : 'web';
    if (raw === 'android' || raw === 'ios') return raw;
  } catch {
    return 'web';
  }

  return 'web';
};

export const isAndroidNative = () => getNativePlatform() === 'android';

export const isIosNative = () => getNativePlatform() === 'ios';
