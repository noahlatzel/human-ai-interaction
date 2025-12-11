import { apiClient } from '../../../lib/apiClient';
import type { ClassExercise } from '../../../types/classExercise';

/**
 * Get class exercises for the authenticated student.
 * No classId parameter needed - the backend uses the student's class automatically.
 */
export const getStudentClassExercises = () => {
    return apiClient.get<ClassExercise[]>('class-exercises');
};
