import { apiClient } from '../../../lib/apiClient';
import type { StreakResponse } from '../../../types/progress';

export const getStreak = () => apiClient.get<StreakResponse>('/progress/streak');
