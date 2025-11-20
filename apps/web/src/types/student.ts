export interface StudentProgressSummary {
  studentId: string;
  firstName?: string | null;
  lastName?: string | null;
  solved: number;
  totalProblems: number;
  completionRate: number;
}

export interface ProgressSummaryResponse {
  totalProblems: number;
  students: StudentProgressSummary[];
}

export type StudentGroup = 'A' | 'B';

export interface DashboardStudent extends StudentProgressSummary {
  group: StudentGroup;
}
