import { apiClient } from '../../../lib/apiClient';
import type { AuthUser } from '../../../types/user';

export type UpdateUserPayload = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export const updateUser = (data: UpdateUserPayload) => {
  return apiClient.patch<AuthUser>('me', data);
};

export const getUser = () => {
  return apiClient.get<AuthUser>(`me?t=${Date.now()}`);
};
