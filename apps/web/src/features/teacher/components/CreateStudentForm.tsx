import { useForm } from 'react-hook-form';
import type { CreateStudentRequest } from '../../../types/teacher';

type FormValues = Omit<CreateStudentRequest, 'role'>;

type CreateStudentFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

export default function CreateStudentForm({ onSubmit, onCancel, isSubmitting }: CreateStudentFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      teacherId: '',
    },
  });

  const submit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      teacherId: values.teacherId || null,
    });
    reset();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Vorname</span>
          <input
            className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            placeholder="Alex"
            {...register('firstName')}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Nachname</span>
          <input
            className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            placeholder="Mustermann"
            {...register('lastName')}
          />
        </label>
      </div>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">E-Mail</span>
        <input
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          type="email"
          required
          placeholder="schueler@schule.de"
          {...register('email', { required: true })}
        />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Passwort</span>
        <input
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          type="password"
          required
          placeholder="••••••••"
          {...register('password', { required: true })}
        />
      </label>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Lehrer-ID (optional)</span>
        <input
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          type="text"
          placeholder="Verknüpfe Schüler:in mit Lehrer:in"
          {...register('teacherId')}
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-green-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Wird erstellt...' : 'Anlegen'}
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
