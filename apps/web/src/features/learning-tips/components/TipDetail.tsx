import type { LearningTip } from '../../../types/learningTip';
import { LEARNING_TIP_CATEGORIES } from '../../../types/learningTip';

interface TipDetailProps {
    tip: LearningTip;
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

export default function TipDetail({ tip, onBack, onEdit, onDelete, showActions = false }: TipDetailProps) {
    const category = LEARNING_TIP_CATEGORIES[tip.category];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </div>
                <span className="text-lg">Zurück</span>
            </button>

            <div className={`rounded-3xl border border-white/70 backdrop-blur shadow-lg p-8 ${category?.color || 'bg-slate-100'}`}>
                <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/90 flex items-center justify-center text-4xl shadow-sm">
                        {category?.emoji || '💡'}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-slate-600 mb-2">{category?.label || tip.category}</div>
                        <h2 className="text-3xl font-bold text-slate-900">{tip.title}</h2>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 whitespace-pre-wrap">{tip.content}</p>
                </div>

                {showActions && (onEdit || onDelete) && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Bearbeiten
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Löschen
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
