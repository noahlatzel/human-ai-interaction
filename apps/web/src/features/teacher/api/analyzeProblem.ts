import { apiClient } from '../../../lib/apiClient';
import type { AnalyzeProblemRequest, AnalyzeProblemResponse } from '../../../types/problem';

export const analyzeProblem = (payload: AnalyzeProblemRequest) =>
  apiClient.post<AnalyzeProblemResponse, AnalyzeProblemRequest>('/math-helper/analyze', payload);
