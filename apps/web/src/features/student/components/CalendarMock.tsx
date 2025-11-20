import { useMemo, useState } from 'react';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

type Event = {
  id: number;
  day: number;
  title: string;
  description: string;
  time: string;
  color: 'blue' | 'orange' | 'purple';
};

const EVENT_COLOR: Record<Event['color'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
};

export default function CalendarMock() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getMonthName = (date: Date) => date.toLocaleString('de-DE', { month: 'long' });
  const getYear = (date: Date) => date.getFullYear();

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  const events: Event[] = useMemo(
    () => [
      {
        id: 1,
        day: 15,
        title: 'Mathe Test',
        description: 'Kapitel 3: Brüche',
        time: '10:00',
        color: 'blue',
      },
      {
        id: 2,
        day: 22,
        title: 'Hausaufgaben Abgabe',
        description: 'Geometrie Arbeitsblatt',
        time: '14:00',
        color: 'orange',
      },
      {
        id: 3,
        day: 28,
        title: 'Projekt Präsentation',
        description: 'Gruppenprojekt Mathematik',
        time: '09:00',
        color: 'purple',
      },
    ],
    [currentDate],
  );

  const startOffset = firstDayOfMonth(currentDate) === 0 ? 6 : firstDayOfMonth(currentDate) - 1;
  const totalDays = daysInMonth(currentDate);

  const renderDays = () => {
    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(
        <div
          key={`empty-${i}`}
          className="rounded-2xl border border-slate-100 bg-white/60 aspect-square"
          aria-hidden
        />,
      );
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const isToday = isCurrentMonth && day === today.getDate();
      const hasEvent = events.some((evt) => evt.day === day);
      const eventColor = hasEvent ? events.find((evt) => evt.day === day)?.color ?? 'blue' : null;
      cells.push(
        <div
          key={day}
          className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 text-sm font-semibold transition ${
            isToday
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow'
              : 'border-slate-100 bg-white/80 text-slate-700'
          }`}
        >
          <span>{day}.</span>
          {hasEvent ? (
            <span
              className={`w-2 h-2 rounded-full ${
                eventColor === 'blue'
                  ? 'bg-blue-500'
                  : eventColor === 'orange'
                    ? 'bg-orange-500'
                    : 'bg-purple-500'
              }`}
            />
          ) : null}
        </div>
      );
    }
    return cells;
  };

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4">
        <p className="text-sm font-semibold text-slate-700">Kalender (Mock)</p>
        <p className="text-sm text-slate-600">
          Monatsansicht mit Beispielterminen aus dem alten Design. Navigation ist lokal, Daten sind Platzhalter.
        </p>
      </div>
      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ‹
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">
              {getMonthName(currentDate)} {getYear(currentDate)}
            </p>
            <button
              type="button"
              onClick={goToToday}
              className="text-sm text-emerald-700 font-semibold hover:underline"
            >
              Heute
            </button>
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-slate-500">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Nächste Termine</p>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${EVENT_COLOR[event.color]}`}
            >
              <div className="text-lg font-bold">{event.day}.</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs">{event.description}</p>
              </div>
              <div className="text-sm font-semibold">{event.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
