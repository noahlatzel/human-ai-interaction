import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, setAccessTokenGetter } from '../../lib/apiClient';
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from '../../lib/storage';
import type {
  AuthSuccess,
  GuestLoginRequest,
  LoginRequest,
  RegisterRequest,
} from '../../types/auth';
import type { AuthUser } from '../../types/user';
import { guestLogin } from '../../features/auth/api/guest';
import { login } from '../../features/auth/api/login';
import { logout as logoutRequest } from '../../features/auth/api/logout';
import { refresh as refreshRequest } from '../../features/auth/api/refresh';
import { registerUser } from '../../features/auth/api/register';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
};

type AuthContextValue = {
  state: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isGuest: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  registerStudent: (payload: Omit<RegisterRequest, 'role'>) => Promise<AuthUser>;
  registerTeacher: (payload: Omit<RegisterRequest, 'role'>) => Promise<AuthUser>;
  guestLogin: (payload: GuestLoginRequest) => Promise<AuthUser>;
  refresh: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const initialAccessToken = getAccessToken();
const initialRefreshToken = getRefreshToken();
const initialUser = getStoredUser();

const initialState: AuthState = {
  status: 'idle',
  user: initialUser,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  error: null,
};

const deriveErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);
  const initialized = useRef(false);

  const applyAuthSuccess = useCallback((auth: AuthSuccess) => {
    setAccessToken(auth.accessToken);
    setRefreshToken(auth.refreshToken ?? null);
    setStoredUser(auth.user);
    setState({
      status: 'authenticated',
      user: auth.user,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken ?? null,
      error: null,
    });
  }, []);

  const clearAuth = useCallback(() => {
    clearAuthStorage();
    setState({
      status: 'unauthenticated',
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
  }, []);

  useEffect(() => {
    setAccessTokenGetter(() => state.accessToken ?? getAccessToken());
  }, [state.accessToken]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (initialized.current) return;
      initialized.current = true;

      const storedRefresh = getRefreshToken();
      const storedAccess = getAccessToken();
      const storedUser = getStoredUser();

      // If we have an access token and user, assume valid session (skip refresh on load)
      if (storedAccess && storedUser) {
        setState({
          status: 'authenticated',
          user: storedUser,
          accessToken: storedAccess,
          refreshToken: storedRefresh,
          error: null,
        });
        return;
      }

      // No access token but have refresh token? Try to refresh
      if (storedRefresh && !storedAccess) {
        setState((prev) => ({ ...prev, status: 'loading', error: null }));

        try {
          const auth = await refreshRequest({ refreshToken: storedRefresh });
          if (!cancelled) {
            applyAuthSuccess(auth);
          }
        } catch (error) {
          if (!cancelled) {
            console.error('Refresh failed on bootstrap', error);
            clearAuth();
          }
        }
        return;
      }

      // No tokens at all → unauthenticated
      setState((prev) => ({
        ...prev,
        status: 'unauthenticated',
        user: null,
        accessToken: null,
        refreshToken: null,
      }));
    };

    bootstrap();

    return () => {
      cancelled = true;
      setAccessTokenGetter(null);
    };
  }, [applyAuthSuccess, clearAuth]);

  const handleAuthError = useCallback((error: unknown) => {
    const message = deriveErrorMessage(error);
    setState((prev) => ({ ...prev, status: 'unauthenticated', error: message }));
    throw error;
  }, []);

  const loginUser = useCallback(
    async (payload: LoginRequest) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const auth = await login(payload);
        applyAuthSuccess(auth);
        return auth.user;
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    [applyAuthSuccess, handleAuthError],
  );

  const registerStudent = useCallback(
    async (payload: Omit<RegisterRequest, 'role'>) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const auth = await registerUser({ ...payload, role: 'student' });
        applyAuthSuccess(auth);
        return auth.user;
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    [applyAuthSuccess, handleAuthError],
  );

  const registerTeacher = useCallback(
    async (payload: Omit<RegisterRequest, 'role'>) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const auth = await registerUser({ ...payload, role: 'teacher' });
        applyAuthSuccess(auth);
        return auth.user;
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    [applyAuthSuccess, handleAuthError],
  );

  const loginAsGuest = useCallback(
    async (payload: GuestLoginRequest) => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const auth = await guestLogin(payload);
        applyAuthSuccess(auth);
        return auth.user;
      } catch (error) {
        handleAuthError(error);
        throw error;
      }
    },
    [applyAuthSuccess, handleAuthError],
  );

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const auth = await refreshRequest({ refreshToken });
      applyAuthSuccess(auth);
      return auth.user;
    } catch (error) {
      clearAuth();
      handleAuthError(error);
      throw error;
    }
  }, [applyAuthSuccess, clearAuth, handleAuthError]);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      await logoutRequest({ refreshToken });
    } catch (error) {
      console.warn('Logout request failed', error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(() => {
    const role = state.user?.role;
    const isAuthenticated = state.status === 'authenticated' && !!state.user;
    return {
      state,
      isAuthenticated,
      isLoading: state.status === 'loading' || state.status === 'idle',
      isTeacher: role === 'teacher',
      isStudent: role === 'student',
      isGuest: Boolean(state.user?.isGuest),
      login: loginUser,
      registerStudent,
      registerTeacher,
      guestLogin: loginAsGuest,
      refresh: refreshSession,
      logout,
    };
  }, [loginAsGuest, loginUser, logout, refreshSession, registerStudent, registerTeacher, state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
