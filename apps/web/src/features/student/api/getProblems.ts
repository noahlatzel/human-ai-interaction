import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblemListResponse } from '../../../types/problem';

export const getProblems = () => apiClient.get<MathWordProblemListResponse>('/math-problems');
