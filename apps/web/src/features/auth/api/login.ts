import { apiClient } from '../../../lib/apiClient';
import type { AuthSuccess, LoginRequest } from '../../../types/auth';

export const login = (payload: LoginRequest) =>
  apiClient.post<AuthSuccess, LoginRequest>('/auth/login', payload);
