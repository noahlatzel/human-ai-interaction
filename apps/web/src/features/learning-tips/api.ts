import { apiClient } from '../../lib/apiClient';
import type {
    LearningTip,
    LearningTipCreate,
    LearningTipUpdate,
} from '../../types/learningTip';

export const learningTipApi = {
    async getAll(): Promise<LearningTip[]> {
        return await apiClient.get<LearningTip[]>('/learning-tips');
    },

    async create(data: LearningTipCreate): Promise<LearningTip> {
        return await apiClient.post<LearningTip>('/learning-tips', data);
    },

    async update(id: string, data: LearningTipUpdate): Promise<LearningTip> {
        return await apiClient.patch<LearningTip>(`/learning-tips/${id}`, data);
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/learning-tips/${id}`);
    },
};
