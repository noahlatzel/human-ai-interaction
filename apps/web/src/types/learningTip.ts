export type LearningTipCategory =
    | 'lernen'
    | 'konzentration'
    | 'gedächtnis'
    | 'motivation'
    | 'organisation'
    | 'prüfungen'
    | 'familie';

export interface LearningTip {
    id: string;
    teacher_id: string;
    category: LearningTipCategory;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface LearningTipCreate {
    category: LearningTipCategory;
    title: string;
    content: string;
}

export interface LearningTipUpdate {
    category?: LearningTipCategory;
    title?: string;
    content?: string;
}

export const LEARNING_TIP_CATEGORIES: Record<LearningTipCategory, { label: string; emoji: string; color: string }> = {
    lernen: { label: 'Lernen', emoji: '🎯', color: 'bg-red-50' },
    konzentration: { label: 'Konzentration', emoji: '🧠', color: 'bg-pink-50' },
    gedächtnis: { label: 'Gedächtnis', emoji: '🎪', color: 'bg-purple-50' },
    motivation: { label: 'Motivation', emoji: '💪', color: 'bg-yellow-50' },
    organisation: { label: 'Organisation', emoji: '📝', color: 'bg-blue-50' },
    prüfungen: { label: 'Prüfungen', emoji: '🍓', color: 'bg-rose-50' },
    familie: { label: 'Familie', emoji: '👨‍👩‍👧‍👦', color: 'bg-cyan-50' },
};
