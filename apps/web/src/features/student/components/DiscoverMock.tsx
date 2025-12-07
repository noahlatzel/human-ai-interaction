import { useState } from 'react';
import NewTopicsSection from './NewTopicsSection';
import ChallengesSection from './ChallengesSection';
import AchievementsSection from './AchievementsSection';
import TipsSection from './TipsSection';

const discoverItems = [
  {
    id: 'new-topics',
    title: 'Neue Themen',
    description: 'Entdecke neue mathematische Konzepte',
    icon: '🌟',
    color: 'from-orange-50 to-amber-50 border-orange-100',
  },
  {
    id: 'challenges',
    title: 'Herausforderungen',
    description: 'Teste dein Wissen mit spannenden Challenges',
    icon: '🏆',
    color: 'from-purple-50 to-pink-50 border-purple-100',
  },
  {
    id: 'achievements',
    title: 'Errungenschaften',
    description: 'Sammle Trophäen und feiere deine Erfolge',
    icon: '🎖️',
    color: 'from-amber-50 to-yellow-50 border-amber-100',
  },
  {
    id: 'tips',
    title: 'Tipps & Tricks',
    description: 'Lerne effektive Lernstrategien',
    icon: '💡',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
  },
];

export default function DiscoverMock() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (selectedSection === 'new-topics') {
    return <NewTopicsSection onBack={() => setSelectedSection(null)} />;
  }

  if (selectedSection === 'challenges') {
    return <ChallengesSection onBack={() => setSelectedSection(null)} />;
  }

  if (selectedSection === 'achievements') {
    return <AchievementsSection onBack={() => setSelectedSection(null)} />;
  }

  if (selectedSection === 'tips') {
    return <TipsSection onBack={() => setSelectedSection(null)} />;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4">
        <p className="text-sm font-semibold text-slate-700">Entdecken</p>
        <p className="text-sm text-slate-600">
          Hier kannst du neue Dinge lernen, dich mit anderen messen und deine Erfolge feiern.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {discoverItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedSection(item.id)}
            className={`rounded-3xl border bg-gradient-to-br ${item.color} shadow-sm hover:shadow-lg transition p-4 text-left space-y-2`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <p className="text-base font-semibold text-slate-900">{item.title}</p>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
