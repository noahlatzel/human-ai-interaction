import type { AuthUser } from './user';

export interface CreateStudentRequest {
  email: string;
  password: string;
  role: 'student';
  firstName?: string | null;
  lastName?: string | null;
  teacherId?: string | null;
}

export interface CreateStudentResponse {
  user: AuthUser;
}
