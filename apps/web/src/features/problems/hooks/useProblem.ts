import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { getProblems } from '../../student/api/getProblems';
import type { MathWordProblem } from '../../../types/problem';

type UseProblemResult = {
  problem: MathWordProblem | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refresh: () => Promise<void>;
};

const deriveError = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unerwarteter Fehler';
};

export function useProblem(problemId: string, seedProblems?: MathWordProblem[]): UseProblemResult {
  const [problem, setProblem] = useState<MathWordProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const findProblem = useCallback(
    (problems?: MathWordProblem[]) => problems?.find((p) => p.id === problemId) ?? null,
    [problemId],
  );

  const fetchProblem = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const next = findProblem(seedProblems);
      if (next) {
        setProblem(next);
        return;
      }
      const result = await getProblems();
      const found = findProblem(result.problems);
      if (!found) {
        setProblem(null);
        setNotFound(true);
        return;
      }
      setProblem(found);
    } catch (err) {
      setError(deriveError(err));
    } finally {
      setLoading(false);
    }
  }, [findProblem, seedProblems]);

  useEffect(() => {
    if (!problemId) {
      setProblem(null);
      setNotFound(true);
      setLoading(false);
      return;
    }
    void fetchProblem();
  }, [fetchProblem, problemId]);

  return useMemo(
    () => ({
      problem,
      loading,
      error,
      notFound,
      refresh: fetchProblem,
    }),
    [error, fetchProblem, loading, notFound, problem],
  );
}
