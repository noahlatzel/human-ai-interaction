import { useForm } from 'react-hook-form';
import type { CreateStudentRequest } from '../../../types/teacher';
import type { Gender } from '../../../types/user';

type FormValues = Omit<CreateStudentRequest, 'role'>;

type CreateStudentFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  classOptions?: { value: string; label: string }[];
  defaultClassId?: string | null;
};

export default function CreateStudentForm({
  onSubmit,
  onCancel,
  isSubmitting,
  classOptions,
  defaultClassId = null,
}: CreateStudentFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      classId: defaultClassId ?? '',
      grade: undefined,
      gender: 'male' as Gender,
    },
  });

  const submit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      classId: values.classId || null,
      grade: values.grade ? Number(values.grade) : null,
      gender: values.gender || 'male',
    });
    reset({ ...values, classId: defaultClassId ?? '', grade: undefined, gender: 'male' });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-slate-700">Klassen-ID (optional)</span>
          {classOptions && classOptions.length > 0 ? (
            <select
              className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              {...register('classId')}
              defaultValue={defaultClassId ?? ''}
            >
              <option value="">Ohne Klassen-ID</option>
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              type="text"
              placeholder="Falls vorhanden"
              {...register('classId')}
            />
          )}
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-slate-700">Klassenstufe (3 oder 4)</span>
          <select
            className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
            {...register('grade')}
            defaultValue=""
          >
            <option value="">Über Klassen-ID ableiten</option>
            <option value={3}>3. Klasse</option>
            <option value={4}>4. Klasse</option>
          </select>
        </label>
      </div>

      <label className="space-y-1 block">
        <span className="text-sm font-semibold text-slate-700">Geschlecht</span>
        <select
          className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          {...register('gender')}
          defaultValue="male"
        >
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
        </select>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
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
