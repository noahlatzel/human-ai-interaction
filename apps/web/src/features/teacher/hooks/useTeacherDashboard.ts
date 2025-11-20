import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { createStudent } from '../api/createStudent';
import { createMathProblem } from '../api/createMathProblem';
import { deleteMathProblem } from '../api/deleteMathProblem';
import { getMathProblems } from '../api/getMathProblems';
import { getTeacherOverview } from '../api/getTeacherOverview';
import type { MathWordProblem, MathWordProblemCreate } from '../../../types/problem';
import type { DashboardStudent, ProgressSummaryResponse, StudentGroup } from '../../../types/student';
import type { CreateStudentRequest } from '../../../types/teacher';

type DashboardState = {
  students: DashboardStudent[];
  totalProblems: number;
  problems: MathWordProblem[];
};

type UseTeacherDashboardResult = {
  students: DashboardStudent[];
  totalProblems: number;
  problems: MathWordProblem[];
  loading: boolean;
  problemsLoading: boolean;
  error: string | null;
  problemError: string | null;
  refreshStudents: () => Promise<void>;
  refreshProblems: () => Promise<void>;
  createStudent: (payload: Omit<CreateStudentRequest, 'role'>) => Promise<void>;
  deleteStudent: (studentId: string) => void;
  toggleGroup: (studentId: string) => void;
  createProblem: (payload: MathWordProblemCreate) => Promise<void>;
  deleteProblem: (problemId: string) => Promise<void>;
};

const deriveError = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unerwarteter Fehler';
};

const mergeGroups = (
  next: ProgressSummaryResponse,
  previousStudents: DashboardStudent[],
): DashboardStudent[] => {
  const groupMap = new Map(previousStudents.map((s) => [s.studentId, s.group]));
  return next.students.map((student) => ({
    ...student,
    group: groupMap.get(student.studentId) ?? 'A',
  }));
};

export function useTeacherDashboard(): UseTeacherDashboardResult {
  const [state, setState] = useState<DashboardState>({
    students: [],
    totalProblems: 0,
    problems: [],
  });
  const [loading, setLoading] = useState(true);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problemError, setProblemError] = useState<string | null>(null);

  const refreshStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTeacherOverview();
      setState((prev) => ({
        ...prev,
        totalProblems: result.totalProblems,
        students: mergeGroups(result, prev.students),
      }));
    } catch (err) {
      setError(deriveError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProblems = useCallback(async () => {
    setProblemsLoading(true);
    setProblemError(null);
    try {
      const result = await getMathProblems();
      setState((prev) => ({
        ...prev,
        problems: result.problems,
      }));
    } catch (err) {
      setProblemError(deriveError(err));
    } finally {
      setProblemsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStudents();
    refreshProblems();
  }, [refreshProblems, refreshStudents]);

  const handleCreateStudent = useCallback(
    async (payload: Omit<CreateStudentRequest, 'role'>) => {
      await createStudent(payload);
      await refreshStudents();
    },
    [refreshStudents],
  );

  const handleDeleteStudent = useCallback((studentId: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.studentId !== studentId),
    }));
  }, []);

  const handleToggleGroup = useCallback((studentId: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.studentId === studentId
          ? { ...s, group: (s.group === 'A' ? 'B' : 'A') as StudentGroup }
          : s,
      ),
    }));
  }, []);

  const handleCreateProblem = useCallback(
    async (payload: MathWordProblemCreate) => {
      await createMathProblem(payload);
      await refreshProblems();
    },
    [refreshProblems],
  );

  const handleDeleteProblem = useCallback(
    async (problemId: string) => {
      await deleteMathProblem(problemId);
      setState((prev) => ({
        ...prev,
        problems: prev.problems.filter((p) => p.id !== problemId),
      }));
    },
    [],
  );

  return useMemo(
    () => ({
      students: state.students,
      totalProblems: state.totalProblems,
      problems: state.problems,
      loading,
      problemsLoading,
      error,
      problemError,
      refreshStudents,
      refreshProblems,
      createStudent: handleCreateStudent,
      deleteStudent: handleDeleteStudent,
      toggleGroup: handleToggleGroup,
      createProblem: handleCreateProblem,
      deleteProblem: handleDeleteProblem,
    }),
    [
      error,
      handleCreateProblem,
      handleCreateStudent,
      handleDeleteProblem,
      handleDeleteStudent,
      handleToggleGroup,
      loading,
      problemError,
      problemsLoading,
      refreshProblems,
      refreshStudents,
      state.problems,
      state.students,
      state.totalProblems,
    ],
  );
}
