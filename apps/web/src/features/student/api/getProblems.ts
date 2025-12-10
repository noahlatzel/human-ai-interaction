import { apiClient } from '../../../lib/apiClient';
import type { MathWordProblemListResponse } from '../../../types/problem';

export const getProblems = () => apiClient.get<MathWordProblemListResponse>('/math-problems');

/** Get homework problems assigned to the student's class */
export const getHomeworkProblems = () =>
  apiClient.get<MathWordProblemListResponse>('/class-exercises/homework-problems');
