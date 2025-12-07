import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblemListResponse } from '../../../types/problem';

export const getMathProblems = (grade?: number) =>
  apiClient.get<MathWordProblemListResponse>('/math-problems', grade ? { grade } : undefined);
