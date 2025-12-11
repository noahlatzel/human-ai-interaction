import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { GuestLoginRequest } from '../../../types/auth';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';

type GuestFormValues = GuestLoginRequest;

export default function GuestEntryPage() {
  const { register, handleSubmit } = useForm<GuestFormValues>({
    defaultValues: { firstName: '', grade: 3 },
  });
  const { guestLogin, isAuthenticated, state, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && state.user) {
      navigate(getHomeRouteForRole(state.user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, state.user]);

  const onSubmit = async (values: GuestFormValues) => {
    try {
      const user = await guestLogin(values);
      toast.success('Gast-Sitzung gestartet');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gast-Anmeldung fehlgeschlagen';
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Als Gast fortfahren"
      subtitle="Gib deinen Vornamen ein, um die App ohne Registrierung auszuprobieren."
      badge="Gastmodus"
      footnote={
        <>
          <p>
            Bereit für ein Konto?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.registerStudent}>
              Jetzt registrieren
            </Link>
            .
          </p>
          <p>
            Zurück zum{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={ROUTES.login}>
              Login
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
          <span className="text-sm font-semibold text-slate-700 ml-1">Vorname</span>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            placeholder="Alex"
            disabled={isLoading}
            {...register('firstName', { required: true })}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 ml-1">Klassenstufe</span>
          <select
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
            disabled={isLoading}
            {...register('grade', { required: true })}
          >
            <option value={3}>3. Klasse</option>
            <option value={4}>4. Klasse</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-green-700 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Starte Sitzung...' : 'Weiter als Gast'}
        </button>
      </form>
    </AuthLayout>
  );
}
