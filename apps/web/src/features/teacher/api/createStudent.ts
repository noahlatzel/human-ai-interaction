import { apiClient } from '../../../lib/apiClient';
import type { CreateStudentRequest, CreateStudentResponse } from '../../../types/teacher';

export const createStudent = (payload: Omit<CreateStudentRequest, 'role'>) =>
  apiClient.post<CreateStudentResponse, CreateStudentRequest>('/users', {
    ...payload,
    role: 'student',
  });
