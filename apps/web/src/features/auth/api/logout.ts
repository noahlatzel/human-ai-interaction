import { apiClient } from '../../../lib/apiClient';
import type { LogoutRequest } from '../../../types/auth';

export const logout = (payload: LogoutRequest = {}) =>
  apiClient.post<unknown, LogoutRequest>('/auth/logout', payload);
