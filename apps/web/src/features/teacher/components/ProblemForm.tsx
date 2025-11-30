import { useFieldArray, useForm, type FieldValues } from 'react-hook-form';
import type { MathWordProblemCreate, MathematicalOperation } from '../../../types/problem';

type ProblemFormProps = {
  onSubmit: (values: MathWordProblemCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

type ProblemFormValues = MathWordProblemCreate & FieldValues;

const OPERATIONS: { value: MathematicalOperation; label: string }[] = [
  { value: 'addition', label: 'Addition' },
  { value: 'subtraction', label: 'Subtraktion' },
  { value: 'multiplication', label: 'Multiplikation' },
  { value: 'division', label: 'Division' },
];

const DIFFICULTIES: { value: MathWordProblemCreate['difficulty']; label: string }[] = [
  { value: 'einfach', label: 'Einfach' },
  { value: 'mittel', label: 'Mittel' },
  { value: 'schwierig', label: 'Schwierig' },
];

export default function ProblemForm({ onSubmit, onCancel, isSubmitting }: ProblemFormProps) {
  const defaultValues: ProblemFormValues = {
    problemDescription: '',
    solution: '',
    difficulty: 'einfach',
    operations: [],
    hints: [],
  };

  const { register, handleSubmit, reset, watch, control } = useForm<ProblemFormValues>({
    defaultValues,
  });

  const { fields, append, remove, replace } = useFieldArray<ProblemFormValues>({
    control,
    name: 'hints',
  });

  const submit = async (values: ProblemFormValues) => {
    const ops = values.operations.filter(Boolean);
    const normalizedHints = (values.hints ?? [])
      .map((hint) => (hint && hint.trim() ? hint.trim() : null))
      .slice(0, 3);
    const payload: MathWordProblemCreate = {
      ...values,
      operations: ops,
      hints: normalizedHints,
    };
    await onSubmit(payload);
    reset(defaultValues);
    replace([]);
  };

  const selectedOps = watch('operations') as MathematicalOperation[];
  const hintCount = fields.length;

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Aufgabenstellung</span>
        <textarea
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          rows={3}
          required
          placeholder="Beschreibe die Textaufgabe..."
          {...register('problemDescription', { required: true })}
        />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Lösung</span>
        <input
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          required
          placeholder="z.B. 42"
          {...register('solution', { required: true })}
        />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Schwierigkeit</span>
        <select
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
          {...register('difficulty', { required: true })}
        >
          {DIFFICULTIES.map((difficulty) => (
            <option key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-700">Operationen</span>
        <div className="grid grid-cols-2 gap-2">
          {OPERATIONS.map((op) => (
            <label
              key={op.value}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                selectedOps?.includes(op.value)
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                value={op.value}
                className="accent-green-600"
                {...register('operations')}
              />
              <span>{op.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Hinweise (optional)</span>
          <button
            type="button"
            onClick={() => {
              if (hintCount < 3) append('');
            }}
            disabled={hintCount >= 3}
            className="text-sm font-semibold text-green-700 hover:text-green-800 disabled:text-slate-400"
          >
            Hinweis hinzufügen
          </button>
        </div>
        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <textarea
                  className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                  rows={2}
                  placeholder={`Hinweis ${index + 1}`}
                  {...register(`hints.${index}` as const)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-rose-600 hover:text-rose-700"
                  aria-label={`Hinweis ${index + 1} entfernen`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path
                      d="M6 6l12 12M18 6l-12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Noch keine Hinweise hinzugefügt.</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Wird erstellt...' : 'Aufgabe speichern'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
