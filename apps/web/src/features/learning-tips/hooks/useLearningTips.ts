import { useState, useEffect, useCallback } from 'react';
import type { LearningTip, LearningTipCreate, LearningTipUpdate } from '../../../types/learningTip';
import { learningTipApi } from '../api';

export function useLearningTips() {
    const [tips, setTips] = useState<LearningTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTips = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await learningTipApi.getAll();
            setTips(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Laden der Tipps');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTips();
    }, [loadTips]);

    const createTip = useCallback(async (data: LearningTipCreate) => {
        const newTip = await learningTipApi.create(data);
        setTips((prev) => [...prev, newTip]);
        return newTip;
    }, []);

    const updateTip = useCallback(async (id: string, data: LearningTipUpdate) => {
        const updatedTip = await learningTipApi.update(id, data);
        setTips((prev) => prev.map((tip) => (tip.id === id ? updatedTip : tip)));
        return updatedTip;
    }, []);

    const deleteTip = useCallback(async (id: string) => {
        await learningTipApi.delete(id);
        setTips((prev) => prev.filter((tip) => tip.id !== id));
    }, []);

    return {
        tips,
        loading,
        error,
        reload: loadTips,
        createTip,
        updateTip,
        deleteTip,
    };
}
