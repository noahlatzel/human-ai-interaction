import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { RegisterRequest } from '../../../types/auth';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

type RegisterFormValues = Omit<RegisterRequest, 'role'>;

export default function RegisterTeacherPage() {
  const { register, handleSubmit } = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '', firstName: '', lastName: '', classId: '', grade: null },
  });
  const { registerTeacher, isAuthenticated, state, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && state.user) {
      navigate(getHomeRouteForRole(state.user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, state.user]);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const sanitized: RegisterFormValues = {
        ...values,
        classId: null,
        grade: null,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
      };
      const user = await registerTeacher(sanitized);
      toast.success('Lehrkraft-Konto erstellt');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Als Lehrer:in registrieren"
      subtitle="Verwende deine Schul- oder Admin-Zugangsdaten, falls benötigt."
      badge="Lehrer"
      footnote={
        <>
          <p>
            Schon registriert?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.teacherLogin}>
              Zum Lehrer-Login
            </Link>
            .
          </p>
          <p>
            Bist du Schüler:in?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.registerStudent}>
              Hier registrieren
            </Link>
            .
          </p>
        </>
      }
    >
      {state.error ? (
        <div className="text-center text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl py-2 px-3">
          Letzter Fehler: {state.error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 ml-1">Vorname (optional)</span>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="Alex"
            disabled={isLoading}
            {...register('firstName')}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 ml-1">Nachname (optional)</span>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="Mustermann"
            disabled={isLoading}
            {...register('lastName')}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 ml-1">E-Mail</span>
          <input
            type="email"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="lehrer@schule.de"
            disabled={isLoading}
            {...register('email', { required: true })}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 ml-1">Passwort</span>
          <input
            type="password"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="••••••••"
            disabled={isLoading}
            {...register('password', { required: true })}
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-green-700 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Erstelle Konto...' : 'Registrieren'}
        </button>
      </form>
    </AuthLayout>
  );
}
