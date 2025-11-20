type AnswerFormProps = {
  isSubmitting: boolean;
  onSubmit: () => void;
  onNext: () => void;
};

export default function AnswerForm({ isSubmitting, onSubmit, onNext }: AnswerFormProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="text-xs text-slate-500">
        Deine Skizze bleibt nur lokal. Die Textantwort wird geprüft und als Fortschritt gespeichert.
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSubmit}
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
