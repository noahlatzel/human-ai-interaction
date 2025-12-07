import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { createMathProblem } from '../api/createMathProblem';
import { createStudent } from '../api/createStudent';
import { deleteMathProblem } from '../api/deleteMathProblem';
import { getMathProblems } from '../api/getMathProblems';
import { getTeacherOverview } from '../api/getTeacherOverview';
import {
  addStudentToClass,
  createClassroom,
  deleteClassStudent,
  getClassStudents,
  listClasses,
} from '../api/classes';
import type { MathWordProblem, MathWordProblemCreate } from '../../../types/problem';
import type { DashboardStudent, StudentGroup } from '../../../types/student';
import type { CreateStudentRequest, TeacherClass } from '../../../types/teacher';

type DashboardState = {
  classes: TeacherClass[];
  students: DashboardStudent[];
  totalProblems: number;
  problems: MathWordProblem[];
  selectedClassId: string | null;
};

type UseTeacherDashboardResult = {
  classes: TeacherClass[];
  selectedClassId: string | null;
  students: DashboardStudent[];
  totalProblems: number;
  problems: MathWordProblem[];
  loadingClasses: boolean;
  loadingStudents: boolean;
  problemsLoading: boolean;
  classError: string | null;
  studentError: string | null;
  problemError: string | null;
  selectClass: (classId: string | null) => Promise<void>;
  refreshClasses: () => Promise<void>;
  refreshStudents: (classId?: string | null) => Promise<void>;
  refreshProblems: () => Promise<void>;
  createClass: (grade: number, suffix?: string | null) => Promise<void>;
  createStudent: (payload: Omit<CreateStudentRequest, 'role'>) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
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
  next: DashboardStudent[],
  previousStudents: DashboardStudent[],
): DashboardStudent[] => {
  const groupMap = new Map(previousStudents.map((s) => [s.studentId, s.group]));
  return next.map((student) => ({
    ...student,
    group: groupMap.get(student.studentId) ?? 'A',
  }));
};

export function useTeacherDashboard(): UseTeacherDashboardResult {
  const [state, setState] = useState<DashboardState>({
    classes: [],
    students: [],
    totalProblems: 0,
    problems: [],
    selectedClassId: null,
  });
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [classError, setClassError] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [problemError, setProblemError] = useState<string | null>(null);

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

  const refreshClasses = useCallback(async () => {
    setLoadingClasses(true);
    setClassError(null);
    try {
      const result = await listClasses();
      setState((prev) => {
        const nextSelected =
          prev.selectedClassId && result.classes.some((cls) => cls.id === prev.selectedClassId)
            ? prev.selectedClassId
            : result.classes[0]?.id ?? null;
        return {
          ...prev,
          classes: result.classes,
          selectedClassId: nextSelected,
        };
      });
    } catch (err) {
      setClassError(deriveError(err));
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  const refreshStudents = useCallback(
    async (classId?: string | null) => {
      const targetClassId = classId ?? state.selectedClassId;
      if (!targetClassId) {
        setState((prev) => ({ ...prev, students: [], totalProblems: 0 }));
        return;
      }
      setLoadingStudents(true);
      setStudentError(null);
      try {
        const currentClass = state.classes.find((cls) => cls.id === targetClassId);
        const [roster, progress] = await Promise.all([
          getClassStudents(targetClassId),
          getTeacherOverview(),
        ]);
        const progressMap = new Map(progress.students.map((s) => [s.studentId, s]));

        setState((prev) => {
          const nextStudents: DashboardStudent[] = roster.students.map((student) => {
            const stats = progressMap.get(student.id);
            return {
              studentId: student.id,
              firstName: student.firstName ?? undefined,
              lastName: student.lastName ?? undefined,
              classId: student.classId ?? targetClassId,
              classLabel: student.classLabel ?? currentClass?.label,
              classGrade: student.classGrade ?? currentClass?.grade,
              solved: stats?.solved ?? 0,
              totalProblems: stats?.totalProblems ?? 0,
              completionRate: stats?.completionRate ?? 0,
              group: 'A',
            };
          });

          const merged = mergeGroups(nextStudents, prev.students);
          const classProblemCount =
            merged.length === 0
              ? progress.totalProblems
              : Math.max(progress.totalProblems, Math.max(...merged.map((s) => s.totalProblems)));

          return {
            ...prev,
            students: merged,
            totalProblems: classProblemCount,
            selectedClassId: targetClassId,
          };
        });
      } catch (err) {
        setStudentError(deriveError(err));
        setState((prev) => ({ ...prev, students: [] }));
      } finally {
        setLoadingStudents(false);
      }
    },
    [state.classes, state.selectedClassId],
  );

  const selectClass = useCallback(
    async (classId: string | null) => {
      setState((prev) => ({ ...prev, selectedClassId: classId }));
      await refreshStudents(classId);
    },
    [refreshStudents],
  );

  const createClass = useCallback(
    async (grade: number, suffix?: string | null) => {
      const created = await createClassroom({ grade, suffix: suffix ?? '' });
      setState((prev) => ({ ...prev, selectedClassId: created.id }));
      await refreshClasses();
      await refreshStudents(created.id);
    },
    [refreshClasses, refreshStudents],
  );

  const handleCreateStudent = useCallback(
    async (payload: Omit<CreateStudentRequest, 'role'>) => {
      if (payload.classId) {
        await addStudentToClass(payload.classId, payload);
      } else {
        await createStudent(payload);
      }
      await refreshStudents(payload.classId ?? state.selectedClassId);
    },
    [refreshStudents, state.selectedClassId],
  );

  const handleDeleteStudent = useCallback(
    async (studentId: string) => {
      const targetClassId = state.selectedClassId;
      if (!targetClassId) {
        throw new Error('Keine Klasse ausgewählt');
      }
      await deleteClassStudent(targetClassId, studentId);
      setState((prev) => {
        const remaining = prev.students.filter((s) => s.studentId !== studentId);
        const nextTotal = remaining.length
          ? Math.max(...remaining.map((s) => s.totalProblems))
          : 0;
        return { ...prev, students: remaining, totalProblems: nextTotal };
      });
    },
    [state.selectedClassId],
  );

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

  useEffect(() => {
    refreshClasses();
    refreshProblems();
  }, [refreshClasses, refreshProblems]);

  useEffect(() => {
    if (state.selectedClassId) {
      refreshStudents(state.selectedClassId);
    } else {
      setLoadingStudents(false);
    }
  }, [refreshStudents, state.selectedClassId]);

  return useMemo(
    () => ({
      classes: state.classes,
      selectedClassId: state.selectedClassId,
      students: state.students,
      totalProblems: state.totalProblems,
      problems: state.problems,
      loadingClasses,
      loadingStudents,
      problemsLoading,
      classError,
      studentError,
      problemError,
      selectClass,
      refreshClasses,
      refreshStudents,
      refreshProblems,
      createClass,
      createStudent: handleCreateStudent,
      deleteStudent: handleDeleteStudent,
      toggleGroup: handleToggleGroup,
      createProblem: handleCreateProblem,
      deleteProblem: handleDeleteProblem,
    }),
    [
      classError,
      createClass,
      handleCreateProblem,
      handleCreateStudent,
      handleDeleteProblem,
      handleDeleteStudent,
      handleToggleGroup,
      loadingClasses,
      loadingStudents,
      problemError,
      problemsLoading,
      refreshClasses,
      refreshProblems,
      refreshStudents,
      selectClass,
      state.classes,
      state.problems,
      state.selectedClassId,
      state.students,
      state.totalProblems,
      studentError,
    ],
  );
}
