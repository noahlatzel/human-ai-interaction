const weekdayShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

type ProgressCardProps = {
  streak: number;
};

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);

export default function ProgressCard({ streak }: ProgressCardProps) {
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday-first

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 shadow-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">Heute</p>
          <p className="text-lg font-bold text-slate-900">{formatDisplayDate(today)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 border border-orange-100 px-4 py-2 text-orange-700 font-semibold">
          <span aria-hidden>🔥</span>
          <span>{streak} Tage</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekdayShort.map((label, index) => {
          const isActive = index === dayIndex;
          const isCompleted = index < dayIndex;
          return (
            <div
              key={label}
              className={`rounded-2xl border px-2 py-3 text-center text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                  : isCompleted
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div>{label}</div>
              {(isActive || isCompleted) && <div aria-hidden className="text-lg">🔥</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
