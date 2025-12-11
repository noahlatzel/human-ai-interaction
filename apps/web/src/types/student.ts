import type { Gender } from './user';

export interface StudentProgressSummary {
  studentId: string;
  firstName?: string | null;
  lastName?: string | null;
  classId?: string | null;
  classGrade?: number | null;
  classLabel?: string | null;
  solved: number;
  totalProblems: number;
  completionRate: number;
  gender?: Gender;
}

export interface ProgressSummaryResponse {
  totalProblems: number;
  students: StudentProgressSummary[];
}

export type StudentGroup = 'A' | 'B';

export interface DashboardStudent extends StudentProgressSummary {
  group: StudentGroup;
}
