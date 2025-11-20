import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { getProblems } from '../api/getProblems';
import { getDifficultyMeta, mapOperations } from '../../problems/utils';
import type { MathWordProblem, MathWordProblemWithMeta } from '../../../types/problem';

type UseStudentProblemsResult = {
  problems: MathWordProblemWithMeta[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const normalizeProblem = (problem: MathWordProblem): MathWordProblemWithMeta => {
  const difficulty = getDifficultyMeta(problem.difficulty);
  return {
    ...problem,
    operations: mapOperations(problem.operations),
    difficultyLabel: difficulty.label,
    difficultyValue: difficulty.value,
  };
};

const deriveError = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unerwarteter Fehler';
};

export function useStudentProblems(): UseStudentProblemsResult {
  const [state, setState] = useState<MathWordProblemWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProblems();
      setState(result.problems.map(normalizeProblem));
    } catch (err) {
      setError(deriveError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return useMemo(
    () => ({
      problems: state,
      loading,
      error,
      reload: load,
    }),
    [error, load, loading, state],
  );
}
