import { Clock } from 'lucide-react';
import type { ClassExercise } from '../../../types/classExercise';

type AppointmentsSidebarProps = {
    exercises: ClassExercise[];
};

const formatAppointmentDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const isUpcoming = (dateString: string): boolean => {
    const exerciseDate = new Date(dateString);
    exerciseDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return exerciseDate >= today;
};

export default function AppointmentsSidebar({ exercises }: AppointmentsSidebarProps) {
    // Sort exercises chronologically (next appointment first)
    const sortedExercises = [...exercises].sort((a, b) => {
        const dateA = new Date(a.scheduledAt).getTime();
        const dateB = new Date(b.scheduledAt).getTime();
        return dateA - dateB;
    });

    return (
        <div className="rounded-3xl bg-white/90 backdrop-blur border border-white/70 shadow-lg p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="text-xl font-bold text-slate-900">Termine</h3>
            </div>

            {sortedExercises.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-500">Keine Termine vorhanden</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {sortedExercises.map((exercise) => {
                        const upcoming = isUpcoming(exercise.scheduledAt);
                        const isHomework = exercise.exerciseType === 'homework';

                        return (
                            <div
                                key={exercise.id}
                                className={`
                                    rounded-xl border p-3 transition
                                    ${upcoming
                                        ? 'bg-white border-slate-200'
                                        : 'bg-slate-50 border-slate-100 opacity-60'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-2">
                                    {/* Colored dot indicator */}
                                    <div
                                        className={`
                                            w-3 h-3 rounded-full flex-shrink-0 mt-1
                                            ${isHomework ? 'bg-red-500' : 'bg-blue-500'}
                                        `}
                                        aria-label={isHomework ? 'Hausaufgabe' : 'Klassenübung'}
                                    />

                                    <div className="flex-1 min-w-0">
                                        {/* Exercise type label */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`
                                                    text-xs font-semibold px-2 py-0.5 rounded-full
                                                    ${isHomework
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }
                                                `}
                                            >
                                                {isHomework ? 'Hausaufgabe' : 'Klassenübung'}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <p className="text-sm font-semibold text-slate-900 mb-1">
                                            {formatAppointmentDate(exercise.scheduledAt)}
                                        </p>

                                        {/* Title */}
                                        {exercise.title && (
                                            <p className="text-sm text-slate-700 font-medium mb-1 truncate">
                                                {exercise.title}
                                            </p>
                                        )}

                                        {/* Problem count */}
                                        <p className="text-xs text-slate-500">
                                            {exercise.problems.length} {exercise.problems.length === 1 ? 'Aufgabe' : 'Aufgaben'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
