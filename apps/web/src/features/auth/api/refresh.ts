import { apiClient } from '../../../lib/apiClient';
import type { AuthSuccess, RefreshRequest } from '../../../types/auth';

export const refresh = (payload: RefreshRequest) =>
  apiClient.post<AuthSuccess, RefreshRequest>('/auth/refresh', payload);
