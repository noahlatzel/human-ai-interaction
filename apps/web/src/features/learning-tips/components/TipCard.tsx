import type { LearningTip } from '../../../types/learningTip';
import { LEARNING_TIP_CATEGORIES } from '../../../types/learningTip';

interface TipCardProps {
    tip: LearningTip;
    onClick: () => void;
}

export default function TipCard({ tip, onClick }: TipCardProps) {
    const category = LEARNING_TIP_CATEGORIES[tip.category];

    return (
        <button
            onClick={onClick}
            className="w-full p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left hover:-translate-y-1"
        >
            <div className="flex items-start gap-4">
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${category?.color || 'bg-slate-100'}`}
                >
                    {category?.emoji || '💡'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-500 mb-1">{category?.label || tip.category}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{tip.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{tip.content}</p>
                </div>
            </div>
        </button>
    );
}
