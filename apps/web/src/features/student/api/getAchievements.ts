import { apiClient } from '../../../lib/apiClient';

export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementCategory = 'home_practice' | 'class_exercises' | 'own_exercises' | 'total' | 'streak' | 'special';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    rarity: AchievementRarity;
    threshold: number;
    progress: number;
    unlocked: boolean;
    unlockedAt: string | null;
}

export interface AchievementsResponse {
    achievements: Achievement[];
    totalUnlocked: number;
    totalAchievements: number;
}

export interface StatisticsResponse {
    homePracticeSolved: number;
    classExercisesSolved: number;
    ownExercisesSolved: number;
    totalSolved: number;
    achievementsUnlocked: number;
    achievementsTotal: number;
}

export async function getAchievements(): Promise<AchievementsResponse> {
    return apiClient.get<AchievementsResponse>('/achievements');
}

export async function getStatistics(): Promise<StatisticsResponse> {
    return apiClient.get<StatisticsResponse>('/achievements/statistics');
}
