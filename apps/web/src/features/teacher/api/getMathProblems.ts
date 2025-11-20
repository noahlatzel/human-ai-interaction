import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblemListResponse } from '../../../types/problem';

export const getMathProblems = () =>
  apiClient.get<MathWordProblemListResponse>('/math-problems');
