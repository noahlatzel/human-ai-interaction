import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { RegisterRequest } from '../../../types/auth';
import { useAuth } from '../hooks/useAuth';

type RegisterFormValues = Omit<RegisterRequest, 'role'>;

export default function RegisterStudentPage() {
  const { register, handleSubmit } = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '', firstName: '', lastName: '', teacherId: '' },
  });
  const { registerStudent, isAuthenticated, state, isLoading } = useAuth();
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
        teacherId: values.teacherId || null,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
      };
      const user = await registerStudent(sanitized);
      toast.success('Account created');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Register as student</h1>
          <p className="text-sm text-slate-500">Create an account to start learning.</p>
          {state.error && (
            <p className="text-xs text-rose-600">Last error: {state.error}</p>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">First name (optional)</span>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First name"
              disabled={isLoading}
              {...register('firstName')}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Last name (optional)</span>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last name"
              disabled={isLoading}
              {...register('lastName')}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              disabled={isLoading}
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
              {...register('password', { required: true })}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Teacher ID (optional)</span>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link to teacher account"
              disabled={isLoading}
              {...register('teacherId')}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2 font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 space-y-2">
          <p>
            Already have an account?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.login}>
              Sign in
            </Link>
            .
          </p>
          <p>
            Are you a teacher?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.registerTeacher}>
              Register here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
