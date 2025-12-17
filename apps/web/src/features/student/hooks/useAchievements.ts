import { useState, useEffect, useCallback } from 'react';
import {
    getAchievements,
    getStatistics,
    type Achievement,
    type StatisticsResponse,
} from '../api/getAchievements';

export function useAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [totalUnlocked, setTotalUnlocked] = useState(0);
    const [totalAchievements, setTotalAchievements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAchievements = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAchievements();
            setAchievements(data.achievements);
            setTotalUnlocked(data.totalUnlocked);
            setTotalAchievements(data.totalAchievements);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Laden der Errungenschaften');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAchievements();
    }, [loadAchievements]);

    return {
        achievements,
        totalUnlocked,
        totalAchievements,
        loading,
        error,
        reload: loadAchievements,
    };
}

export function useStatistics() {
    const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getStatistics();
            setStatistics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Laden der Statistiken');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    return {
        statistics,
        loading,
        error,
        reload: loadStatistics,
    };
}
