import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROUTES } from '../../../lib/routes';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboardPage() {
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <AdminLayout
      title={`Willkommen, ${authState.user?.firstName ?? 'Admin'}`}
      subtitle="Systemverwaltung"
      actions={
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-white text-rose-600 text-sm font-semibold shadow-sm hover:bg-rose-50"
        >
          Abmelden
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Benutzer</h3>
          <p className="text-3xl font-bold text-purple-600">--</p>
          <p className="text-sm text-slate-500 mt-1">Registrierte Benutzer</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Klassen</h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
          <p className="text-sm text-slate-500 mt-1">Aktive Klassen</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">System</h3>
          <p className="text-sm font-medium text-emerald-600">Online</p>
          <p className="text-sm text-slate-500 mt-1">Status</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 border-dashed">
        <p className="text-slate-600">Weitere Admin-Funktionen werden hier bald verfügbar sein.</p>
      </div>
    </AdminLayout>
  );
}
