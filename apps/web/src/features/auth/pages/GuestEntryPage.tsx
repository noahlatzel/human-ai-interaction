import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, getHomeRouteForRole } from '../../../lib/routes';
import type { GuestLoginRequest } from '../../../types/auth';
import { useAuth } from '../hooks/useAuth';

type GuestFormValues = GuestLoginRequest;

export default function GuestEntryPage() {
  const { register, handleSubmit } = useForm<GuestFormValues>({
    defaultValues: { firstName: '' },
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
      toast.success('Guest session started');
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start guest session';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Continue as guest</h1>
          <p className="text-sm text-slate-500">
            Enter your first name to try the experience without creating an account.
          </p>
          {state.error && (
            <p className="text-xs text-rose-600">Last error: {state.error}</p>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">First name</span>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alex"
              disabled={isLoading}
              {...register('firstName', { required: true })}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Starting session...' : 'Continue'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 space-y-2">
          <p>
            Ready to create an account?{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.registerStudent}>
              Register here
            </Link>
            .
          </p>
          <p>
            Back to{' '}
            <Link className="text-blue-600 hover:text-blue-700" to={ROUTES.login}>
              login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
