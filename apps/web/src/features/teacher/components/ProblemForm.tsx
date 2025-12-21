import { useForm, type FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import { analyzeProblem } from '../api/analyzeProblem';
import type { Language, MathWordProblemCreate } from '../../../types/problem';

type ProblemFormProps = {
  onSubmit: (values: MathWordProblemCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

type ProblemFormValues = FieldValues & {
  problemText: string;
  grade: number;
  language: Language;
};

const DEFAULT_LANGUAGE: Language = 'de';

export default function ProblemForm({ onSubmit, onCancel, isSubmitting }: ProblemFormProps) {
  const defaultValues: ProblemFormValues = {
    problemText: '',
    grade: 3,
    language: DEFAULT_LANGUAGE,
  };

  const { register, handleSubmit, reset } = useForm<ProblemFormValues>({
    defaultValues,
  });

  const submit = async (values: ProblemFormValues) => {
    try {
      const analysisResponse = await analyzeProblem({
        problemText: values.problemText,
        language: values.language,
      });

      const payload: MathWordProblemCreate = {
        problemText: values.problemText,
        analysis: analysisResponse.analysis,
        grade: Number(values.grade),
        language: values.language,
      };

      await onSubmit(payload);
      reset(defaultValues);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analyse fehlgeschlagen';
      toast.error(message);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Aufgabenstellung</span>
        <textarea
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          rows={3}
          required
          placeholder="Beschreibe die Textaufgabe..."
          {...register('problemText', { required: true })}
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-slate-700">Sprache</span>
          <select
            className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
            {...register('language', { required: true })}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-slate-700">Klassenstufe</span>
          <select
            className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            {...register('grade', { required: true })}
          >
            <option value={3}>3. Klasse</option>
            <option value={4}>4. Klasse</option>
          </select>
        </label>
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
