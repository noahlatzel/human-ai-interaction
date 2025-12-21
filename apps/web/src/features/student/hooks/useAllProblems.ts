import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { getProblems } from '../api/getProblems';
import type { MathWordProblem } from '../../../types/problem';

type UseAllProblemsResult = {
  problems: MathWordProblem[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const deriveError = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Unerwarteter Fehler';
};

export function useAllProblems(): UseAllProblemsResult {
  const [state, setState] = useState<MathWordProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProblems();
      setState(result.problems);
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
