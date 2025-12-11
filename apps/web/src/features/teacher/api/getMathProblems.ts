import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblemListResponse } from '../../../types/problem';

export const getMathProblems = (grade?: number) => {
  const query = grade !== undefined ? `?grade=${encodeURIComponent(grade)}` : '';
  return apiClient.get<MathWordProblemListResponse>(`/math-problems${query}`);
};
