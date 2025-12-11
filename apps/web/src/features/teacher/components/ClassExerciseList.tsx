import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { ClassExercise } from '../../../types/classExercise';

type ClassExerciseListProps = {
  exercises: ClassExercise[];
  loading: boolean;
  onCreate: () => void;
  onDelete: (id: string) => void;
};

export default function ClassExerciseList({
  exercises,
  loading,
  onCreate,
  onDelete,
}: ClassExerciseListProps) {
  if (loading) {
    return <div className="text-center py-8 text-slate-500">Lade Übungen...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Übungen</h3>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
        >
          + Neue Übung
        </button>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500">Noch keine Übungen erstellt.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
                  {format(new Date(exercise.scheduledAt), 'dd', { locale: de })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      exercise.exerciseType === 'homework'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {exercise.exerciseType === 'homework' ? '📚 Hausaufgabe' : '📋 Klassenübung'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {exercise.topic}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {format(new Date(exercise.scheduledAt), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{exercise.title}</h3>
                  <p className="text-xs text-slate-500">
                    {exercise.problems.length} {exercise.problems.length === 1 ? 'Aufgabe' : 'Aufgaben'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDelete(exercise.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                title="Löschen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
