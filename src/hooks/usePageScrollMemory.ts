import { useEffect } from 'react';

const KEY_PREFIX = 'page-scroll-memory:';

export const usePageScrollMemory = (key: string) => {
  useEffect(() => {
    const storageKey = `${KEY_PREFIX}${key}`;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const target = Number(saved);
      if (Number.isFinite(target) && target > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: target, behavior: 'auto' });
          });
        });
      }
    }

    const onScroll = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
      window.removeEventListener('scroll', onScroll);
    };
  }, [key]);
};
