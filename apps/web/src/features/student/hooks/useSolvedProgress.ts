import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../lib/apiClient';

interface UseSolvedProgressResult {
    solvedProblemIds: Set<string>;
    solvedOwnExerciseIds: Set<string>;
    loading: boolean;
    reload: () => Promise<void>;
}

export function useSolvedProgress(): UseSolvedProgressResult {
    const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
    const [solvedOwnExerciseIds, setSolvedOwnExerciseIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchProgress = useCallback(async () => {
        setLoading(true);
        try {
            const [problemIds, ownExerciseIds] = await Promise.all([
                apiClient.get<string[]>('progress/my-solved'),
                apiClient.get<string[]>('student-own-exercises/solved'),
            ]);
            setSolvedProblemIds(new Set(problemIds));
            setSolvedOwnExerciseIds(new Set(ownExerciseIds));
        } catch {
            // Silently fail - user may not have any progress yet
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProgress();
    }, [fetchProgress]);

    return {
        solvedProblemIds,
        solvedOwnExerciseIds,
        loading,
        reload: fetchProgress,
    };
}
