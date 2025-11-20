import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { LoginRequest } from '../../../types/auth';
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
      toast.success('Logged in');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Teacher sign in</h1>
          <p className="text-sm text-slate-500">Use your teacher credentials to continue.</p>
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
              placeholder="teacher@school.edu"
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

        <div className="text-center text-sm text-slate-600 space-y-2">
          <p>
            Not a teacher?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.login}>
              Student login
            </Link>
            .
          </p>
          <p>
            Need an account?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.registerTeacher}>
              Register as teacher
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
