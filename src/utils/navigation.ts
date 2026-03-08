import type { Location, NavigateFunction } from 'react-router-dom';

type LocationLike = Pick<Location, 'pathname' | 'search' | 'hash' | 'state'>;

const normalizeInternalPath = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/')) return null;
  return value;
};

const extractFromState = (state: unknown): string | null => {
  if (!state || typeof state !== 'object') return null;
  const candidate = state as Record<string, unknown>;

  const direct = normalizeInternalPath(candidate.fromPath);
  if (direct) return direct;

  const from = candidate.from;
  if (typeof from === 'string') {
    return normalizeInternalPath(from);
  }

  if (from && typeof from === 'object') {
    const fromObj = from as Record<string, unknown>;
    const pathname = normalizeInternalPath(fromObj.pathname);
    if (!pathname) return null;
    const search = typeof fromObj.search === 'string' ? fromObj.search : '';
    const hash = typeof fromObj.hash === 'string' ? fromObj.hash : '';
    return `${pathname}${search}${hash}`;
  }

  return null;
};

const getHistoryIndex = () => {
  if (typeof window === 'undefined') return 0;
  const idx = (window.history.state as { idx?: unknown } | null)?.idx;
  return typeof idx === 'number' ? idx : 0;
};

const getCurrentEntryState = () => {
  if (typeof window === 'undefined') return null;
  const state = window.history.state as { usr?: unknown } | null;
  return state?.usr ?? null;
};

export const buildFromState = (location: Pick<LocationLike, 'pathname' | 'search' | 'hash'>) => ({
  from: {
    pathname: location.pathname,
    search: location.search || '',
    hash: location.hash || '',
  },
});

export const navigateToAuthWithReturn = (navigate: NavigateFunction, location: Pick<LocationLike, 'pathname' | 'search' | 'hash'>) => {
  navigate('/auth', { state: buildFromState(location) });
};

export const getReturnPathFromAuthState = (state: unknown, fallbackPath = '/profile') => {
  const from = extractFromState(state);
  return from || fallbackPath;
};

export const navigateBackOr = (
  navigate: NavigateFunction,
  fallbackPath: string,
  options?: { location?: LocationLike | null }
) => {
  const stateFromLocation = options?.location?.state ?? null;
  const stateFromEntry = getCurrentEntryState();
  const fromTarget = extractFromState(stateFromLocation) || extractFromState(stateFromEntry);
  const currentPath = options?.location?.pathname;

  if (fromTarget && fromTarget !== currentPath) {
    navigate(fromTarget, { replace: true });
    return;
  }

  if (getHistoryIndex() > 0) {
    navigate(-1);
    return;
  }

  navigate(fallbackPath, { replace: true });
};
