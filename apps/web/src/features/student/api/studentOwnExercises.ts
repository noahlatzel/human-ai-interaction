import { apiClient } from '../../../lib/apiClient';
import type {
  StudentOwnExercise,
  StudentOwnExerciseCreate,
  StudentOwnExerciseUpdate,
} from '../../../types/studentOwnExercise';

export const studentOwnExercisesApi = {
  list: () => apiClient.get<StudentOwnExercise[]>('/student-own-exercises'),
  get: (id: string) => apiClient.get<StudentOwnExercise>(`/student-own-exercises/${id}`),
  create: (data: StudentOwnExerciseCreate) =>
    apiClient.post<StudentOwnExercise, StudentOwnExerciseCreate>('/student-own-exercises', data),
  update: (id: string, data: StudentOwnExerciseUpdate) =>
    apiClient.patch<StudentOwnExercise, StudentOwnExerciseUpdate>(
      `/student-own-exercises/${id}`,
      data,
    ),
  delete: (id: string) => apiClient.delete<void>(`/student-own-exercises/${id}`),
  solve: (id: string, success: boolean) =>
    apiClient.post<{ message: string; new_achievements: string[] }, { success: boolean }>(
      `/student-own-exercises/${id}/solve`,
      { success },
    ),
};
