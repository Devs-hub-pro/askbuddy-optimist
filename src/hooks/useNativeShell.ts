import { useEffect } from 'react';
import { getNativePlatform, isAndroidNative, isNativeApp } from '@/utils/platform';

type AppPluginListener = {
  remove: () => Promise<void> | void;
};

type AppPlugin = {
  addListener?: (event: 'backButton', listener: () => void) => Promise<AppPluginListener> | AppPluginListener;
};

const getAppPlugin = (): AppPlugin | null => {
  if (typeof window === 'undefined') return null;
  const capacitor = (window as any).Capacitor;
  if (!capacitor) return null;
  return capacitor.Plugins?.App ?? null;
};

export const useNativeShell = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const native = isNativeApp();
    const platform = getNativePlatform();

    document.body.dataset.nativeApp = native ? 'true' : 'false';
    document.body.dataset.nativePlatform = platform;

    if (native && isAndroidNative()) {
      document.body.classList.add('platform-android');
    } else {
      document.body.classList.remove('platform-android');
    }

    return () => {
      document.body.classList.remove('platform-android');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isAndroidNative()) return;

    const onViewportResize = () => {
      if (!window.visualViewport || typeof document === 'undefined') return;
      const keyboardOpen = window.innerHeight - window.visualViewport.height > 150;
      document.body.dataset.keyboardOpen = keyboardOpen ? 'true' : 'false';
    };

    onViewportResize();
    window.visualViewport?.addEventListener('resize', onViewportResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', onViewportResize);
      if (typeof document !== 'undefined') {
        delete document.body.dataset.keyboardOpen;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isAndroidNative()) return;

    const appPlugin = getAppPlugin();
    if (!appPlugin?.addListener) return;

    let subscription: AppPluginListener | null = null;

    const setup = async () => {
      try {
        const listener = appPlugin.addListener?.('backButton', () => {
          // H5 history 栈存在时优先回退；根页交由系统接管。
          if (window.history.length > 1) {
            window.history.back();
          }
        });

        if (!listener) return;
        subscription = listener instanceof Promise ? await listener : listener;
      } catch {
        // ignore native plugin binding errors in web mode
      }
    };

    void setup();

    return () => {
      void subscription?.remove?.();
    };
  }, []);
};
