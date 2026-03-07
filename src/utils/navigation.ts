<<<<<<< HEAD
import { NavigateFunction } from 'react-router-dom';
=======
import type { NavigateFunction } from 'react-router-dom';
>>>>>>> a04765d (Update from local working directory)

export const navigateBackOr = (navigate: NavigateFunction, fallbackPath: string) => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    navigate(-1);
    return;
  }
  navigate(fallbackPath);
};

