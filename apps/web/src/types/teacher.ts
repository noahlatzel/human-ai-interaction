import type { AuthUser, Gender } from './user';

export interface CreateStudentRequest {
  email: string;
  password: string;
  role: 'student';
  firstName?: string | null;
  lastName?: string | null;
  classId?: string | null;
  grade?: number | null;
  gender?: Gender;
}

export interface UpdateStudentRequest {
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
}

export interface CreateStudentResponse {
  user: AuthUser;
}

export interface TeacherClass {
  id: string;
  grade: number;
  suffix: string;
  label: string;
  studentCount: number;
}

export interface ClassStudentsResponse {
  classId: string;
  students: AuthUser[];
}
