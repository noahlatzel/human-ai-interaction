import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../lib/apiClient';
import { getStreak } from '../api/getStreak';
import type { StreakResponse } from '../../../types/progress';

type UseStreakResult = {
    streak: StreakResponse | null;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
};

const deriveError = (error: unknown) => {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unerwarteter Fehler beim Laden des Streaks';
};

export function useStreak(): UseStreakResult {
    const [state, setState] = useState<StreakResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getStreak();
            setState(result);
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
            streak: state,
            loading,
            error,
            reload: load,
        }),
        [error, load, loading, state],
    );
}
