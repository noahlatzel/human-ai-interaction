import type { AuthUser } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'teacher' | 'student';
  firstName?: string | null;
  lastName?: string | null;
  teacherId?: string | null;
}

export interface GuestLoginRequest {
  firstName: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string | null;
}

export interface AuthSuccess {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn: number;
  sessionId?: string | null;
  learningSessionId?: string | null;
  user: AuthUser;
}
