import { useEffect } from 'react';

type LifecycleHandlers = {
  onBackground: () => void;
  onForeground: () => void;
};

export const useCallLifecycle = ({ onBackground, onForeground }: LifecycleHandlers) => {
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onBackground();
      } else if (document.visibilityState === 'visible') {
        onForeground();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [onBackground, onForeground]);

  useEffect(() => {
    const appPlugin = (window as any)?.Capacitor?.Plugins?.App;
    if (!appPlugin?.addListener) return;

    let pauseHandle: { remove: () => Promise<void> | void } | null = null;
    let resumeHandle: { remove: () => Promise<void> | void } | null = null;

    const bind = async () => {
      pauseHandle = await appPlugin.addListener('pause', onBackground);
      resumeHandle = await appPlugin.addListener('resume', onForeground);
    };

    void bind();
    return () => {
      void pauseHandle?.remove?.();
      void resumeHandle?.remove?.();
    };
  }, [onBackground, onForeground]);
};
