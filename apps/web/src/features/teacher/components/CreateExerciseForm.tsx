import { useState } from 'react';
import type { MathWordProblem } from '../../../types/problem';
import { formatOperation, getDifficultyMeta } from '../../problems/utils';
import type { CreateClassExerciseRequest } from '../../../types/classExercise';

type CreateExerciseFormProps = {
  classId: string;
  availableProblems: MathWordProblem[];
  onSubmit: (data: CreateClassExerciseRequest) => Promise<void>;
  onCancel: () => void;
};

export default function CreateExerciseForm({
  classId,
  availableProblems,
  onSubmit,
  onCancel,
}: CreateExerciseFormProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic || !scheduledAt || selectedProblemIds.length === 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        classId,
        title,
        topic,
        scheduledAt: new Date(scheduledAt).toISOString(),
        problemIds: selectedProblemIds,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProblem = (id: string) => {
    setSelectedProblemIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titel</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="z.B. Mathe-Training am Montag"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Thema</label>
            <select
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Bitte wählen...</option>
              <option value="Addition">Addition</option>
              <option value="Subtraktion">Subtraktion</option>
              <option value="Multiplikation">Multiplikation</option>
              <option value="Division">Division</option>
              <option value="Geometrie">Geometrie</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Datum & Zeit</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aufgaben auswählen ({selectedProblemIds.length})
          </label>
          <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-2">
            {availableProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => toggleProblem(problem.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProblemIds.includes(problem.id)
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                      selectedProblemIds.includes(problem.id)
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedProblemIds.includes(problem.id) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 line-clamp-2">{problem.problemText}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {getDifficultyMeta(problem.difficultyLevel).label}
                      </span>
                      {problem.analysis.operations.map((op) => (
                        <span key={op} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {formatOperation(op)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={submitting || selectedProblemIds.length === 0}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? 'Erstelle...' : 'Übung erstellen'}
        </button>
      </div>
    </form>
  );
}
