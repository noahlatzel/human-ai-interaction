const DEFAULT_API_BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/haii/api`
    : 'http://localhost:8000/haii/api';

const normalizeBaseUrl = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);

export const API_BASE_URL = normalizeBaseUrl(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_API_BASE_URL,
);

export const API_PREFIX = '/v1';

export const API_URL = `${API_BASE_URL}${API_PREFIX}`;
