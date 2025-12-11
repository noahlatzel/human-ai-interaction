import { apiClient } from '../../../lib/apiClient';
import type { ClassExercise } from '../../../types/classExercise';

/**
 * Fetch classroom exercises (not homework) for the current student.
 * The backend automatically filters to the student's class.
 */
export const getStudentClassExercises = () => {
  return apiClient.get<ClassExercise[]>('class-exercises?exerciseType=classroom');
};
