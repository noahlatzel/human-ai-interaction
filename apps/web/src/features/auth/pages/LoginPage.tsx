import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { LoginRequest } from '../../../types/auth';
import { useAuth } from '../hooks/useAuth';

type LoginFormValues = LoginRequest;

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormValues>({
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
      toast.success('Successfully logged in');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    }
  };

  const showLogoutNotice = searchParams.get('loggedOut') === '1';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to continue your session.</p>
          {showLogoutNotice && (
            <p className="text-xs text-emerald-600">You have been logged out successfully.</p>
          )}
          {state.error && (
            <p className="text-xs text-rose-600">Last error: {state.error}</p>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
              {...register('email', { required: true })}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
              {...register('password', { required: true })}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="space-y-2 text-center text-sm text-slate-600">
          <p>
            New here?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.registerStudent}>
              Register as student
            </Link>{' '}
            or{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.registerTeacher}>
              register as teacher
            </Link>
            .
          </p>
          <p>
            Want to explore quickly?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.guest}>
              Continue as guest
            </Link>
            .
          </p>
          <p>
            Teacher sign in:{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.teacherLogin}>
              Teacher login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
