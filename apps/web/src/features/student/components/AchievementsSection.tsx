import { useState } from 'react';
import { useAchievements } from '../hooks/useAchievements';
import type { Achievement, AchievementCategory } from '../api/getAchievements';

// Map backend categories to display names
const categoryConfig: Record<AchievementCategory | 'all', { name: string; icon: string }> = {
  all: { name: 'Alle', icon: '🏆' },
  home_practice: { name: 'Zuhause üben', icon: '🏠' },
  class_exercises: { name: 'Klassenübungen', icon: '📚' },
  own_exercises: { name: 'Eigene Aufgaben', icon: '✏️' },
  total: { name: 'Gesamt', icon: '🎯' },
  streak: { name: 'Aktivität', icon: '🔥' },
  special: { name: 'Spezial', icon: '✨' },
};

const categories: Array<{ id: AchievementCategory | 'all'; name: string; icon: string }> = [
  { id: 'all', ...categoryConfig.all },
  { id: 'home_practice', ...categoryConfig.home_practice },
  { id: 'class_exercises', ...categoryConfig.class_exercises },
  { id: 'own_exercises', ...categoryConfig.own_exercises },
  { id: 'total', ...categoryConfig.total },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'from-amber-700 to-amber-900';
    case 'silver': return 'from-slate-400 to-slate-600';
    case 'gold': return 'from-yellow-400 to-amber-500';
    case 'diamond': return 'from-cyan-400 to-blue-500';
    default: return 'from-gray-400 to-gray-600';
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'border-amber-700';
    case 'silver': return 'border-slate-400';
    case 'gold': return 'border-yellow-400';
    case 'diamond': return 'border-cyan-400';
    default: return 'border-gray-400';
  }
};

const getRarityLabel = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return '🥉 Bronze';
    case 'silver': return '🥈 Silber';
    case 'gold': return '🥇 Gold';
    case 'diamond': return '💎 Diamant';
    default: return rarity;
  }
};

export default function AchievementsSection({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const { achievements, totalUnlocked, totalAchievements, loading, error, reload } = useAchievements();

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-lg">Zurück zur Übersicht</span>
        </button>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-lg">Zurück zur Übersicht</span>
        </button>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700 font-semibold mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = totalAchievements > 0
    ? Math.round((totalUnlocked / totalAchievements) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 mb-6"
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

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 rounded-3xl p-8 shadow-lg border-4 border-white">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <span className="text-5xl">🏆</span>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2">Errungenschaften</h2>
            <p className="text-lg text-white/90 font-medium">Sammle Trophäen und feiere deine Erfolge!</p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Dein Fortschritt</h3>
          <div className="text-3xl font-black text-amber-600">{totalUnlocked}/{totalAchievements}</div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 mt-2 text-center">
          {progressPercentage}% aller Errungenschaften freigeschaltet!
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-slate-600 font-medium">Keine Errungenschaften in dieser Kategorie</p>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`rounded-2xl p-5 border-2 transition-all ${achievement.unlocked
          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)} shadow-lg hover:scale-105`
          : 'bg-slate-100 border-slate-300 opacity-60'
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-md ${achievement.unlocked ? 'bg-white' : 'bg-slate-200'
          }`}>
          {achievement.unlocked ? achievement.icon : '🔒'}
        </div>
        {achievement.unlocked && (
          <div className="px-2 py-1 bg-white/90 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
            {getRarityLabel(achievement.rarity)}
          </div>
        )}
      </div>

      <h4 className={`text-lg font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-slate-600'
        }`}>
        {achievement.title}
      </h4>
      <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/90' : 'text-slate-500'
        }`}>
        {achievement.description}
      </p>

      {/* Progress bar for achievements with threshold */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={achievement.unlocked ? 'text-white/90' : 'text-slate-600'}>
            Fortschritt
          </span>
          <span className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-700'}`}>
            {achievement.progress}/{achievement.threshold}
          </span>
        </div>
        <div className={`w-full rounded-full h-2 overflow-hidden ${achievement.unlocked ? 'bg-white/30' : 'bg-slate-300'
          }`}>
          <div
            className={`h-full rounded-full ${achievement.unlocked ? 'bg-white' : 'bg-amber-500'
              }`}
            style={{ width: `${Math.min((achievement.progress / achievement.threshold) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
