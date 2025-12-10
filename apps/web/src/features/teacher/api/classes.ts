import { apiClient } from '../../../lib/apiClient';
import type {
  ClassStudentsResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  TeacherClass,
  UpdateStudentRequest,
} from '../../../types/teacher';
// Removed unused AuthUser type, backend returns UserPayload

type CreateClassPayload = {
  grade: number;
  suffix?: string | null;
};

export const createClassroom = (payload: CreateClassPayload) =>
  apiClient.post<TeacherClass, CreateClassPayload>('/classes', {
    grade: payload.grade,
    suffix: payload.suffix ?? '',
  });

export const listClasses = () =>
  apiClient.get<{ classes: TeacherClass[] }>('/classes');

export const getClassStudents = (classId: string) =>
  apiClient.get<ClassStudentsResponse>(`/classes/${classId}/students`);

export const addStudentToClass = (
  classId: string,
  payload: Omit<CreateStudentRequest, 'role'>,
) =>
  apiClient.post<CreateStudentResponse, CreateStudentRequest>(
    `/classes/${classId}/students`,
    { ...payload, role: 'student' },
  );

export const updateStudentInClass = (
  classId: string,
  studentId: string,
  payload: UpdateStudentRequest,
) =>
  apiClient.patch<any, UpdateStudentRequest>(
    `/classes/${classId}/students/${studentId}`,
    payload,
  );

export const deleteClassStudent = (classId: string, studentId: string) =>
  apiClient.delete<void>(`/classes/${classId}/students/${studentId}`);
