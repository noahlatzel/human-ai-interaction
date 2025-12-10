import type { StreakResponse } from '../../../types/progress';

type ProgressCardProps = {
  streakData: StreakResponse | null;
};

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);

const getDefaultWeeklyActivity = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const isToday = date.toDateString() === today.toDateString();

    return {
      date: dateString,
      dayOfWeek: dayNames[i],
      isToday,
      hasActivity: false,
    };
  });
};

export default function ProgressCard({ streakData }: ProgressCardProps) {
  const today = new Date();
  const currentStreak = streakData?.currentStreak ?? 0;
  const weeklyActivity = streakData?.weeklyActivity && streakData.weeklyActivity.length > 0
    ? streakData.weeklyActivity
    : getDefaultWeeklyActivity();

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 shadow-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">Heute</p>
          <p className="text-lg font-bold text-slate-900">{formatDisplayDate(today)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 border border-orange-100 px-4 py-2 text-orange-700 font-semibold">
          <span aria-hidden>🔥</span>
          <span>{currentStreak} {currentStreak === 1 ? 'Tag' : 'Tage'}</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weeklyActivity.map((day) => {
          const isActive = day.isToday;
          const hasActivity = day.hasActivity;
          return (
            <div
              key={day.date}
              className={`rounded-2xl border px-2 py-3 text-center text-sm font-semibold transition ${isActive && hasActivity
                ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                : isActive
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : hasActivity
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
            >
              <div>{day.dayOfWeek}</div>
              {hasActivity && <div aria-hidden className="text-lg">🔥</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
