import { useState } from 'react';
import { format } from 'date-fns';
import type { MathWordProblem } from '../../../types/problem';
import type { CreateClassExerciseRequest, ExerciseType } from '../../../types/classExercise';

type CreateClassExerciseFormProps = {
  classId: string;
  availableProblems: MathWordProblem[];
  onSubmit: (data: CreateClassExerciseRequest) => Promise<void>;
  onCancel: () => void;
};

export default function CreateClassExerciseForm({
  classId,
  availableProblems,
  onSubmit,
  onCancel,
}: CreateClassExerciseFormProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('08:00');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('classroom');
  const [selectedProblemIds, setSelectedProblemIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProblemIds.size === 0) {
      // You might want to show an error here
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      await onSubmit({
        classId,
        title,
        topic,
        description,
        scheduledAt,
        problemIds: Array.from(selectedProblemIds),
        exerciseType,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProblem = (id: string) => {
    const next = new Set(selectedProblemIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedProblemIds(next);
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Neue Übung erstellen</h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exercise Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Übungstyp</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setExerciseType('classroom')}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                exerciseType === 'classroom'
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              📋 Klassenübung
            </button>
            <button
              type="button"
              onClick={() => setExerciseType('homework')}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                exerciseType === 'homework'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              📚 Hausaufgabe
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {exerciseType === 'classroom'
              ? 'Klassenübungen erscheinen unter "Klassenübungen" im Schüler-Dashboard'
              : 'Hausaufgaben erscheinen unter "Zuhause üben" im Schüler-Dashboard'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Titel</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="z.B. Mathe-Training am Montag"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Thema</label>
            <input
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="z.B. Addition"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Beschreibung (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={2}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Datum</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Uhrzeit</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Aufgaben auswählen ({selectedProblemIds.size})</label>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl border border-slate-200 p-2 bg-slate-50">
            {availableProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => toggleProblem(problem.id)}
                className={`p-3 rounded-lg cursor-pointer border transition-all ${
                  selectedProblemIds.has(problem.id)
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                    : 'bg-white border-transparent hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                    selectedProblemIds.has(problem.id)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {selectedProblemIds.has(problem.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{problem.problemDescription}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {problem.difficulty}
                      </span>
                      {problem.operations.map(op => (
                        <span key={op} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {availableProblems.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Keine Aufgaben verfügbar.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedProblemIds.size === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Erstelle...' : 'Übung erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
}
