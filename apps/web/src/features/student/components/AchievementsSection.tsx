import { useState } from 'react';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  goal?: number;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  category: string;
};

export default function AchievementsSection({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const achievements: Achievement[] = [
    // Lern-Erfolge
    {
      id: 'first-step',
      title: 'Erster Schritt',
      description: 'Löse deine erste Aufgabe',
      icon: '🎯',
      unlocked: true,
      rarity: 'bronze',
      category: 'learning'
    },
    {
      id: 'ten-tasks',
      title: 'Fleißiger Anfänger',
      description: 'Löse 10 Aufgaben',
      icon: '📚',
      unlocked: true,
      progress: 10,
      goal: 10,
      rarity: 'bronze',
      category: 'learning'
    },
    {
      id: 'fifty-tasks',
      title: 'Fleißiger Rechner',
      description: 'Löse 50 Aufgaben',
      icon: '🎓',
      unlocked: true,
      progress: 50,
      goal: 50,
      rarity: 'silver',
      category: 'learning'
    },
    {
      id: 'hundred-tasks',
      title: 'Mathe-Champion',
      description: 'Löse 100 Aufgaben',
      icon: '👑',
      unlocked: false,
      progress: 73,
      goal: 100,
      rarity: 'gold',
      category: 'learning'
    },
    {
      id: 'perfect-ten',
      title: 'Perfektionist',
      description: 'Löse 10 Aufgaben ohne Fehler',
      icon: '💯',
      unlocked: true,
      rarity: 'silver',
      category: 'learning'
    },
    {
      id: 'twenty-streak',
      title: 'Unaufhaltsam',
      description: '20 Aufgaben in Folge richtig',
      icon: '🔥',
      unlocked: false,
      progress: 12,
      goal: 20,
      rarity: 'gold',
      category: 'learning'
    },
    
    // Streak-Erfolge
    {
      id: 'week-warrior',
      title: 'Wochenkrieger',
      description: '7 Tage in Folge geübt',
      icon: '🗓️',
      unlocked: true,
      progress: 7,
      goal: 7,
      rarity: 'silver',
      category: 'streak'
    },
    {
      id: 'month-champion',
      title: 'Monats-Champion',
      description: '30 Tage in Folge aktiv',
      icon: '📅',
      unlocked: false,
      progress: 18,
      goal: 30,
      rarity: 'diamond',
      category: 'streak'
    },
    {
      id: 'early-bird',
      title: 'Früher Vogel',
      description: 'Vor 9 Uhr morgens geübt',
      icon: '🌅',
      unlocked: true,
      rarity: 'bronze',
      category: 'streak'
    },
    
    // Challenge-Erfolge
    {
      id: 'speed-gold',
      title: 'Blitz-König',
      description: 'Gold-Badge im Blitz-Rechnen',
      icon: '⚡',
      unlocked: false,
      progress: 25,
      goal: 30,
      rarity: 'gold',
      category: 'challenges'
    },
    {
      id: 'puzzle-master',
      title: 'Rätsel-Meister',
      description: 'Alle Zahlen-Rätsel gelöst',
      icon: '🧩',
      unlocked: false,
      progress: 7,
      goal: 10,
      rarity: 'silver',
      category: 'challenges'
    },
    {
      id: 'word-hero',
      title: 'Textaufgaben-Held',
      description: '20 Textaufgaben gemeistert',
      icon: '📖',
      unlocked: true,
      progress: 20,
      goal: 20,
      rarity: 'silver',
      category: 'challenges'
    },
    
    // Entdeckungs-Erfolge
    {
      id: 'curious',
      title: 'Neugierig',
      description: '3 neue Themen entdeckt',
      icon: '🔍',
      unlocked: true,
      progress: 3,
      goal: 3,
      rarity: 'bronze',
      category: 'discovery'
    },
    {
      id: 'explorer',
      title: 'Entdecker',
      description: 'Alle neuen Themen ausprobiert',
      icon: '🗺️',
      unlocked: false,
      progress: 6,
      goal: 8,
      rarity: 'gold',
      category: 'discovery'
    },
    {
      id: 'geometry-expert',
      title: 'Formen-Experte',
      description: 'Geometrie-Spiel gemeistert',
      icon: '🔷',
      unlocked: true,
      rarity: 'silver',
      category: 'discovery'
    },
    
    // Punktzahl-Erfolge
    {
      id: 'thousand-points',
      title: 'Punktesammler',
      description: '1000 Gesamtpunkte erreicht',
      icon: '⭐',
      unlocked: true,
      progress: 1000,
      goal: 1000,
      rarity: 'silver',
      category: 'points'
    },
    {
      id: 'five-thousand-points',
      title: 'Punkte-Champion',
      description: '5000 Gesamtpunkte erreicht',
      icon: '🌟',
      unlocked: false,
      progress: 3247,
      goal: 5000,
      rarity: 'gold',
      category: 'points'
    },
    
    // Spezial-Erfolge
    {
      id: 'weekend-hero',
      title: 'Wochenend-Held',
      description: 'Am Wochenende freiwillig geübt',
      icon: '🎮',
      unlocked: true,
      rarity: 'bronze',
      category: 'special'
    },
    {
      id: 'speed-demon',
      title: 'Schnelldenker',
      description: '5 Aufgaben in unter 30 Sekunden',
      icon: '💨',
      unlocked: true,
      rarity: 'silver',
      category: 'special'
    },
    {
      id: 'versatile',
      title: 'Vielseitig',
      description: 'Aufgaben aus allen 4 Rechenarten',
      icon: '🎯',
      unlocked: true,
      rarity: 'gold',
      category: 'special'
    },
  ];

  const categories = [
    { id: 'all', name: 'Alle', icon: '🏆' },
    { id: 'learning', name: 'Lernen', icon: '📚' },
    { id: 'streak', name: 'Aktivität', icon: '🔥' },
    { id: 'challenges', name: 'Challenges', icon: '⚡' },
    { id: 'discovery', name: 'Entdecken', icon: '🔍' },
    { id: 'points', name: 'Punkte', icon: '⭐' },
    { id: 'special', name: 'Spezial', icon: '✨' },
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

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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
          <div className="text-3xl font-black text-amber-600">{unlockedCount}/{totalCount}</div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 mt-2 text-center">
          {Math.round((unlockedCount / totalCount) * 100)}% aller Errungenschaften freigeschaltet!
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
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
          <div
            key={achievement.id}
            className={`rounded-2xl p-5 border-2 transition-all ${
              achievement.unlocked
                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)} shadow-lg hover:scale-105`
                : 'bg-slate-100 border-slate-300 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-md ${
                achievement.unlocked ? 'bg-white' : 'bg-slate-200'
              }`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              {achievement.unlocked && (
                <div className="px-2 py-1 bg-white/90 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                  {achievement.rarity === 'bronze' && '🥉 Bronze'}
                  {achievement.rarity === 'silver' && '🥈 Silber'}
                  {achievement.rarity === 'gold' && '🥇 Gold'}
                  {achievement.rarity === 'diamond' && '💎 Diamant'}
                </div>
              )}
            </div>
            
            <h4 className={`text-lg font-bold mb-1 ${
              achievement.unlocked ? 'text-white' : 'text-slate-600'
            }`}>
              {achievement.title}
            </h4>
            <p className={`text-sm mb-3 ${
              achievement.unlocked ? 'text-white/90' : 'text-slate-500'
            }`}>
              {achievement.description}
            </p>
            
            {achievement.progress !== undefined && achievement.goal && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={achievement.unlocked ? 'text-white/90' : 'text-slate-600'}>
                    Fortschritt
                  </span>
                  <span className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-700'}`}>
                    {achievement.progress}/{achievement.goal}
                  </span>
                </div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${
                  achievement.unlocked ? 'bg-white/30' : 'bg-slate-300'
                }`}>
                  <div 
                    className={`h-full rounded-full ${
                      achievement.unlocked ? 'bg-white' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
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
