export type UserRole = 'admin' | 'teacher' | 'student';
export type Gender = 'male' | 'female';

export interface AuthUser {
  id: string;
  email?: string | null;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  classId?: string | null;
  classGrade?: number | null;
  classLabel?: string | null;
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
  xp?: number;
  solvedTasks?: number;
  gender?: Gender;
}
