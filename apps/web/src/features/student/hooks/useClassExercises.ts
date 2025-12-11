import { useState, useEffect, useCallback } from 'react';
import type { ClassExercise } from '../../../types/classExercise';
import { getStudentClassExercises } from '../api/getClassExercises';

interface UseClassExercisesResult {
  exercises: ClassExercise[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useClassExercises(): UseClassExercisesResult {
  const [exercises, setExercises] = useState<ClassExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentClassExercises();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load class exercises');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    reload: fetchExercises,
  };
}
