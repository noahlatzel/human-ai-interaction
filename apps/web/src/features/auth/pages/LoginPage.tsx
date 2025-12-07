import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { LoginRequest } from '../../../types/auth';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

type LoginFormValues = LoginRequest;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });
  const { login, isAuthenticated, state, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  const showLogoutNotice = searchParams.get('loggedOut') === '1';

  return (
    <AuthLayout
      title="Willkommen zurück"
      subtitle="Melde dich mit deiner E-Mail und deinem Passwort an."
      footnote={
        <>
          <p className="text-sm text-slate-600">
            Neu hier?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.registerStudent}>
              Als Schüler:in registrieren
            </Link>{' '}
            oder{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.registerTeacher}>
              als Lehrer:in registrieren
            </Link>
            .
          </p>
          <p className="text-sm text-slate-600">
            Schnell testen?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.guest}>
              Als Gast fortfahren
            </Link>
            .
          </p>
          <p className="text-sm text-slate-600">
            Lehrer-Login:{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.teacherLogin}>
              Zum Lehrer-Login
            </Link>
          </p>
        </>
      }
    >
      {showLogoutNotice ? (
        <div className="text-center text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-3">
          Du wurdest erfolgreich abgemeldet.
        </div>
      ) : null}
      {state.error ? (
        <div className="text-center text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl py-2 px-3">
          Letzter Fehler: {state.error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2 relative z-10">
          <span className="text-sm font-semibold text-slate-700 ml-1">E-Mail</span>
          <input
            type="email"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none relative z-10"
            placeholder="name@beispiel.de"
            disabled={isLoading}
            autoComplete="email"
            {...register('email', { required: true })}
          />
        </label>

        <label className="block space-y-2 relative z-10">
          <span className="text-sm font-semibold text-slate-700 ml-1">Passwort</span>
          <input
            type="password"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none relative z-10"
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
