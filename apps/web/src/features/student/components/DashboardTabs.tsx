type DashboardTabsProps = {
  active: 'practice' | 'class';
  onChange: (tab: 'practice' | 'class') => void;
};

export default function DashboardTabs({ active, onChange }: DashboardTabsProps) {
  const buttonBase =
    'flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition shadow-sm';
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange('practice')}
        className={`${buttonBase} ${
          active === 'practice'
            ? 'bg-slate-900 text-white shadow-lg'
            : 'bg-white/80 text-slate-700 border border-slate-200'
        }`}
      >
        📚 Zuhause üben
      </button>
      <button
        type="button"
        onClick={() => onChange('class')}
        className={`${buttonBase} ${
          active === 'class'
            ? 'bg-slate-900 text-white shadow-lg'
            : 'bg-white/80 text-slate-700 border border-slate-200'
        }`}
      >
        📋 Klassenübungen
      </button>
    </div>
  );
}
