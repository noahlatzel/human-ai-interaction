import type { AuthUser } from '../types/user';

const ACCESS_TOKEN_KEY = 'haii.auth.accessToken';
const REFRESH_TOKEN_KEY = 'haii.auth.refreshToken';
const USER_KEY = 'haii.auth.user';

const isBrowser = typeof window !== 'undefined';
const memoryStore: Record<string, string> = {};

const setItem = (key: string, value: string | null) => {
  if (isBrowser) {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  if (value === null) {
    delete memoryStore[key];
  } else {
    memoryStore[key] = value;
  }
};

const getItem = (key: string): string | null => {
  if (isBrowser) {
    return window.localStorage.getItem(key);
  }
  return memoryStore[key] ?? null;
};

export const setAccessToken = (token: string | null) => setItem(ACCESS_TOKEN_KEY, token);
export const getAccessToken = () => getItem(ACCESS_TOKEN_KEY);

export const setRefreshToken = (token: string | null) => setItem(REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY);

export const setStoredUser = (user: AuthUser | null) =>
  setItem(USER_KEY, user ? JSON.stringify(user) : null);
export const getStoredUser = (): AuthUser | null => {
  const raw = getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.error('Failed to parse stored user', error);
    return null;
  }
};

export const clearAuthStorage = () => {
  setAccessToken(null);
  setRefreshToken(null);
  setStoredUser(null);
};
