import { apiClient } from '../../../lib/apiClient';
import type { ProgressPayload, ProgressSetRequest } from '../../../types/progress';

export const submitProgress = (payload: ProgressSetRequest) =>
  apiClient.post<ProgressPayload, ProgressSetRequest>('/progress', payload);
