import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROUTES } from '../../../lib/routes';

export default function StudentDashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(`${ROUTES.login}?loggedOut=1`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Student dashboard</h1>
        <p className="text-slate-600">
          Welcome {state.user?.firstName ?? state.user?.email ?? 'student'}.
        </p>
        <div className="space-y-1 text-sm text-slate-500">
          <p>User ID: {state.user?.id ?? '—'}</p>
          <p>Role: {state.user?.role ?? 'unknown'}</p>
          {state.user?.teacherId && <p>Teacher: {state.user.teacherId}</p>}
          {state.user?.isGuest && <p className="text-amber-600">Guest session</p>}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg bg-slate-800 text-white py-2 font-semibold hover:bg-slate-900 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
