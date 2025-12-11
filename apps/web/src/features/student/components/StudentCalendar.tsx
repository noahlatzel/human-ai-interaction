import { useState } from 'react';
import { Flame } from 'lucide-react';
import type { StreakResponse } from '../../../types/progress';

type StudentCalendarProps = {
    streakData: StreakResponse | null;
};

type CalendarDay = {
    date: Date;
    dateString: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasActivity: boolean;
};

const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTH_NAMES = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
];

const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getMonthGrid = (year: number, month: number, activitySet: Set<string>): CalendarDay[] => {
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = formatDateString(today);

    const days: CalendarDay[] = [];

    // Fill current month days only
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateString = formatDateString(date);
        days.push({
            date,
            dateString,
            isCurrentMonth: true,
            isToday: dateString === todayString,
            hasActivity: activitySet.has(dateString),
        });
    }

    return days;
};

export default function StudentCalendar({ streakData }: StudentCalendarProps) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    const activitySet = new Set(streakData?.activityHistory ?? []);
    const monthGrid = getMonthGrid(currentYear, currentMonth, activitySet);

    // Debug: Log streak data to console
    console.log('StudentCalendar - streakData:', streakData);
    console.log('StudentCalendar - activityHistory:', streakData?.activityHistory);
    console.log('StudentCalendar - activitySet size:', activitySet.size);

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleToday = () => {
        const now = new Date();
        setCurrentYear(now.getFullYear());
        setCurrentMonth(now.getMonth());
    };

    return (
        <div className="rounded-3xl bg-white/90 backdrop-blur border border-white/70 shadow-lg p-5">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                    ← Zurück
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                        {MONTH_NAMES[currentMonth]} {currentYear}
                    </h3>
                    <button
                        type="button"
                        onClick={handleToday}
                        className="text-sm text-blue-600 hover:underline mt-1"
                    >
                        Heute
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                    Weiter →
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="text-center text-sm font-semibold text-slate-600 py-2">
                        {label}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {monthGrid.map((day, index) => (
                    <div
                        key={`${day.dateString}-${index}`}
                        className={`
                relative aspect-square rounded-xl border p-2 flex flex-col items-center justify-center text-sm font-semibold transition
                ${day.isToday
                                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500'
                                : day.isCurrentMonth
                                    ? day.hasActivity
                                        ? 'bg-orange-50/50 border-orange-200 text-slate-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    : 'bg-slate-50 border-slate-100 text-slate-400'
                            }
              `}
                    >
                        <span className="text-xs">{day.date.getDate()}</span>
                        {day.hasActivity && (
                            <Flame className="w-4 h-4 mt-1 text-orange-500 fill-orange-500" aria-label="Activity recorded" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
