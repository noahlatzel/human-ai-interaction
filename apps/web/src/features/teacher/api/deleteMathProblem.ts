import { apiClient } from '../../../lib/apiClient';

export const deleteMathProblem = (problemId: string) =>
  apiClient.delete(`/math-problems/${problemId}`);
