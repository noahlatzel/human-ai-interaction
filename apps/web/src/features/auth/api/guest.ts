import { apiClient } from '../../../lib/apiClient';
import type { AuthSuccess, GuestLoginRequest } from '../../../types/auth';

export const guestLogin = (payload: GuestLoginRequest) =>
  apiClient.post<AuthSuccess, GuestLoginRequest>('/auth/guest', payload);
