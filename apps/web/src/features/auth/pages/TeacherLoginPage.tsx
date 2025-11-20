import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { LoginRequest } from '../../../types/auth';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

type LoginFormValues = LoginRequest;

export default function TeacherLoginPage() {
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });
  const { login, isAuthenticated, state, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && state.user) {
      navigate(getHomeRouteForRole(state.user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, state.user]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await login(values);
      toast.success('Erfolgreich angemeldet');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Lehrer-Login"
      subtitle="Melde dich mit deinen Lehrer-Zugangsdaten an."
      badge="Lehrer"
      footnote={
        <>
          <p>
            Kein Lehrer?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.login}>
              Zum Schüler-Login
            </Link>
            .
          </p>
          <p>
            Noch kein Konto?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.registerTeacher}>
              Als Lehrer:in registrieren
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
          <span className="text-sm font-semibold text-slate-700 ml-1">E-Mail</span>
          <input
            type="email"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="lehrer@schule.de"
            disabled={isLoading}
            autoComplete="email"
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
            autoComplete="current-password"
            {...register('password', { required: true })}
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-green-700 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
        </button>
      </form>
    </AuthLayout>
  );
}
