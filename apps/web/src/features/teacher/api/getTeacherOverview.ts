import { apiClient } from '../../../lib/apiClient';
import type { ProgressSummaryResponse } from '../../../types/student';

export const getTeacherOverview = () =>
  apiClient.get<ProgressSummaryResponse>('/progress/students');
