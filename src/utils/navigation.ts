import type { NavigateFunction } from 'react-router-dom';

export const navigateBackOr = (navigate: NavigateFunction, fallbackPath: string) => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    navigate(-1);
    return;
  }
  navigate(fallbackPath);
};
