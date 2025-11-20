export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthUser {
  id: string;
  email?: string | null;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  teacherId?: string | null;
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
}
