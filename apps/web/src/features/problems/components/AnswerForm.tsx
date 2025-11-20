import { useState } from 'react';

type AnswerFormProps = {
  isSubmitting: boolean;
  onSubmit: (solved: boolean) => void;
  onNext: () => void;
};

export default function AnswerForm({ isSubmitting, onSubmit, onNext }: AnswerFormProps) {
  const [solved, setSolved] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          checked={solved}
          onChange={(e) => setSolved(e.target.checked)}
        />
        Ich habe die Aufgabe gelöst
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSubmit(solved)}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Abgeben'}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
