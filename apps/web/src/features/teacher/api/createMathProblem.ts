import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblem, MathWordProblemCreate } from '../../../types/problem';

export const createMathProblem = (payload: MathWordProblemCreate) =>
  apiClient.post<MathWordProblem, MathWordProblemCreate>('/math-problems', payload);
