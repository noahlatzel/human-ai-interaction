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
    description: 'Schaue dir deine Erfolge an',
    icon: '🎖️',
    color: 'from-blue-50 to-indigo-50 border-blue-100',
  },
  {
    id: 'leaderboard',
    title: 'Bestenliste',
    description: 'Vergleiche dich mit anderen',
    icon: '📊',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
  },
  {
    id: 'tips',
    title: 'Tipps & Tricks',
    description: 'Lerne effektive Lernstrategien',
    icon: '💡',
    color: 'from-amber-50 to-yellow-50 border-amber-100',
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Tausche dich mit anderen aus',
    icon: '👥',
    color: 'from-pink-50 to-rose-50 border-pink-100',
  },
];

export default function DiscoverMock() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4">
        <p className="text-sm font-semibold text-slate-700">Entdecken (Mock)</p>
        <p className="text-sm text-slate-600">
          Entdecke neue Möglichkeiten. Diese Kacheln sind noch Platzhalter, bis die Features angebunden sind.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {discoverItems.map((item) => (
          <button
            key={item.id}
            type="button"
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
