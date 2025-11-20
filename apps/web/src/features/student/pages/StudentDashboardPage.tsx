import { useNavigate } from 'react-router-dom';
import { useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import StudentLayout from '../components/StudentLayout';
import ProblemList from '../components/ProblemList';
import ProgressCard from '../components/ProgressCard';
import DashboardTabs from '../components/DashboardTabs';
import DiscoverMock from '../components/DiscoverMock';
import CalendarMock from '../components/CalendarMock';
import ProfileMock from '../components/ProfileMock';
import { useStudentProblems } from '../hooks/useStudentProblems';
import { ROUTES, getProblemRoute } from '../../../lib/routes';

export default function StudentDashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { problems, loading, error, reload } = useStudentProblems();
  const [view, setView] = useState<'home' | 'discover' | 'calendar' | 'profile'>('home');
  const [activeTab, setActiveTab] = useState<'practice' | 'class'>('practice');
  const streak = 32; // placeholder until calendar/progress is wired

  const fullName = useMemo(
    () =>
      [state.user?.firstName, state.user?.lastName].filter(Boolean).join(' ') ||
      state.user?.email ||
      'Schüler:in',
    [state.user?.email, state.user?.firstName, state.user?.lastName],
  );

  const handleLogout = async () => {
    await logout();
    navigate(`${ROUTES.login}?loggedOut=1`, { replace: true });
  };

  const handleSelect = (problemId: string) => {
    navigate(getProblemRoute(problemId), { state: { problems } });
  };

  const renderHome = () => (
    <div className="space-y-4">
      <ProgressCard streak={streak} />

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Textaufgaben</h2>
          {state.user?.isGuest ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
              Gastmodus
            </span>
          ) : null}
        </div>
        <p className="text-sm text-slate-600">
          Wähle eine Aufgabe aus und bearbeite sie mit Text oder Zeichnung. Dein Fortschritt wird
          beim Abgeben gespeichert.
        </p>
        <DashboardTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'practice' ? (
        <ProblemList
          problems={problems}
          loading={loading}
          error={error}
          onRetry={() => {
            void reload();
          }}
          onSelect={handleSelect}
        />
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 text-center text-slate-600">
          <p className="font-semibold text-slate-900 mb-1">Keine Klassenübungen verfügbar</p>
          <p className="text-sm">Sobald deine Lehrkraft Aufgaben zuteilt, erscheinen sie hier.</p>
        </div>
      )}
    </div>
  );

  let content: ReactNode = renderHome();
  if (view === 'discover') content = <DiscoverMock />;
  if (view === 'calendar') content = <CalendarMock />;
  if (view === 'profile')
    content = (
      <ProfileMock
        firstName={state.user?.firstName}
        lastName={state.user?.lastName}
        email={state.user?.email}
        onLogout={handleLogout}
      />
    );

  return (
    <StudentLayout
      userName={fullName}
      onLogout={handleLogout}
      streak={streak}
      navActive={view}
      onNavChange={setView}
    >
      {content}
    </StudentLayout>
  );
}
