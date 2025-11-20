const DEFAULT_API_BASE_URL = 'http://localhost:8000';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_API_BASE_URL;

export const API_PREFIX = '/v1';

export const API_URL = `${API_BASE_URL}${API_PREFIX}`;
