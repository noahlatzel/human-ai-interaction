import { useState } from 'react';
import { useLearningTips } from '../../learning-tips/hooks/useLearningTips';
import TipCard from '../../learning-tips/components/TipCard';
import TipDetail from '../../learning-tips/components/TipDetail';
import { LEARNING_TIP_CATEGORIES } from '../../../types/learningTip';
import type { LearningTip, LearningTipCategory } from '../../../types/learningTip';

export default function TipsSection({ onBack }: { onBack: () => void }) {
  const { tips, loading, error } = useLearningTips();
  const [selectedTip, setSelectedTip] = useState<LearningTip | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LearningTipCategory | 'alle'>('alle');

  const filteredTips = selectedCategory === 'alle'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  if (selectedTip) {
    return (
      <TipDetail
        tip={selectedTip}
        onBack={() => setSelectedTip(null)}
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
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
        <span className="text-lg">Zurück zur Übersicht</span>
      </button>

      <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-100 to-teal-100 backdrop-blur shadow-lg p-8 text-center">
        <div className="inline-block p-4 rounded-2xl bg-white mb-4 text-4xl">
          💡
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tipps & Tricks</h2>
        <p className="text-slate-700">Lerne, wie du noch besser lernen kannst!</p>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('alle')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'alle'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            Alle
          </button>
          {Object.entries(LEARNING_TIP_CATEGORIES).map(([key, { label, emoji }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as LearningTipCategory)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === key
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Keine Tipps vorhanden.</p>
            <p className="text-sm text-slate-400 mt-1">
              {selectedCategory !== 'alle'
                ? 'Probiere eine andere Kategorie!'
                : 'Dein Lehrer hat noch keine Tipps erstellt.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} onClick={() => setSelectedTip(tip)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
