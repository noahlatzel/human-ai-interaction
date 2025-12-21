import { apiClient } from '../../../lib/apiClient';
import type { ExtractProblemsRequest, ExtractProblemsResponse } from '../../../types/problem';

export const extractProblems = (payload: ExtractProblemsRequest) =>
  apiClient.post<ExtractProblemsResponse, ExtractProblemsRequest>('/math-helper/extract', payload);
