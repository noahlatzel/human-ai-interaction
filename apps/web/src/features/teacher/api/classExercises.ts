import { apiClient } from '../../../lib/apiClient';
import type {
  ClassExercise,
  CreateClassExerciseRequest,
  UpdateClassExerciseRequest,
} from '../../../types/classExercise';

export const getClassExercises = (classId: string) => {
  return apiClient.get<ClassExercise[]>(`class-exercises?classId=${classId}`);
};

export const createClassExercise = (data: CreateClassExerciseRequest) => {
  return apiClient.post<ClassExercise, CreateClassExerciseRequest>('class-exercises', data);
};

export const updateClassExercise = (id: string, data: UpdateClassExerciseRequest) => {
  return apiClient.patch<ClassExercise, UpdateClassExerciseRequest>(`class-exercises/${id}`, data);
};

export const deleteClassExercise = (id: string) => {
  return apiClient.delete(`class-exercises/${id}`);
};
