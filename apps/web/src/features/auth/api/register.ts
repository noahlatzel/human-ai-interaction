import { apiClient } from '../../../lib/apiClient';
import type { AuthSuccess, RegisterRequest } from '../../../types/auth';

export const registerUser = (payload: RegisterRequest) =>
  apiClient.post<AuthSuccess, RegisterRequest>('/auth/register', payload);
