import { useState } from 'react';
import type { LearningTipCategory, LearningTipCreate, LearningTipUpdate } from '../../../types/learningTip';
import { LEARNING_TIP_CATEGORIES } from '../../../types/learningTip';

interface TipFormProps {
    initialData?: LearningTipUpdate & { category?: LearningTipCategory };
    onSubmit: (data: LearningTipCreate | LearningTipUpdate) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
    isSubmitting?: boolean;
}

export default function TipForm({ initialData, onSubmit, onCancel, isEdit = false, isSubmitting = false }: TipFormProps) {
    const [category, setCategory] = useState<LearningTipCategory>(initialData?.category || 'lernen');
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setLoading(true);
        try {
            await onSubmit({ category, title, content });
        } finally {
            setLoading(false);
        }
    };

    const disabled = loading || isSubmitting;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">{isEdit ? 'Tipp bearbeiten' : 'Neuer Tipp'}</h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategorie</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LearningTipCategory)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={disabled}
                >
                    {Object.entries(LEARNING_TIP_CATEGORIES).map(([key, cat]) => (
                        <option key={key} value={key}>
                            {cat.emoji} {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titel</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Pausen richtig nutzen"
                    required
                    maxLength={100}
                    disabled={disabled}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Inhalt</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y"
                    placeholder="Beschreibe deinen Tipp..."
                    required
                    maxLength={1000}
                    disabled={disabled}
                />
                <p className="text-sm text-slate-500 mt-1">{content.length}/1000 Zeichen</p>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={disabled}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {disabled ? 'Wird gespeichert...' : isEdit ? 'Speichern' : 'Erstellen'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={disabled}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Abbrechen
                </button>
            </div>
        </form>
    );
}
