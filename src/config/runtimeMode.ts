import { isAndroidNative } from '@/utils/platform';

const truthy = new Set(['1', 'true', 'yes', 'on']);

const readUrlFlag = (name: string) => {
  if (typeof window === 'undefined') return false;
  const value = new URLSearchParams(window.location.search).get(name);
  if (!value) return false;
  return truthy.has(value.toLowerCase());
};

const readStorageFlag = (name: string) => {
  if (typeof window === 'undefined') return false;
  const value = window.localStorage.getItem(name);
  if (!value) return false;
  return truthy.has(value.toLowerCase());
};

export const isAndroidMockMode = () => {
  if (!isAndroidNative()) return false;

  const envEnabled = truthy.has(String(import.meta.env.VITE_ANDROID_MOCK_DEFAULT || '').toLowerCase());
  return envEnabled || readStorageFlag('android_mock_mode') || readUrlFlag('mock');
};
