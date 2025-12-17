import { useState, useEffect, useCallback } from 'react';
import type { ClassExercise } from '../../../types/classExercise';
import { apiClient } from '../../../lib/apiClient';

interface UseHomeworkExercisesResult {
    exercises: ClassExercise[];
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

/**
 * Fetch homework exercises for the current student.
 * The backend automatically filters to the student's class.
 */
const getHomeworkExercises = () => {
    return apiClient.get<ClassExercise[]>('class-exercises?exerciseType=homework');
};

export function useHomeworkExercises(): UseHomeworkExercisesResult {
    const [exercises, setExercises] = useState<ClassExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHomeworkExercises();
            setExercises(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load homework exercises');
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
