import { useForm } from 'react-hook-form';
import type { MathWordProblemCreate, MathematicalOperation } from '../../../types/problem';

type ProblemFormProps = {
  onSubmit: (values: MathWordProblemCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

const OPERATIONS: { value: MathematicalOperation; label: string }[] = [
  { value: 'addition', label: 'Addition' },
  { value: 'subtraction', label: 'Subtraktion' },
  { value: 'multiplication', label: 'Multiplikation' },
  { value: 'division', label: 'Division' },
];

export default function ProblemForm({ onSubmit, onCancel, isSubmitting }: ProblemFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<MathWordProblemCreate>({
    defaultValues: { problemDescription: '', solution: '', difficulty: 1, operations: [] },
  });

  const submit = async (values: MathWordProblemCreate) => {
    const ops = values.operations.filter(Boolean);
    await onSubmit({ ...values, operations: ops });
    reset();
  };

  const selectedOps = watch('operations') as MathematicalOperation[];

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
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Schwierigkeit (1-5)</span>
          <span className="text-xs text-slate-500">{watch('difficulty') || 1}</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          className="w-full accent-blue-600"
          {...register('difficulty', { valueAsNumber: true, required: true })}
        />
      </label>

      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-700">Operationen</span>
        <div className="grid grid-cols-2 gap-2">
          {OPERATIONS.map((op) => (
            <label
              key={op.value}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                selectedOps?.includes(op.value)
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                value={op.value}
                className="accent-blue-600"
                {...register('operations')}
              />
              <span>{op.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-green-700 disabled:opacity-60"
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
