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
import CommunityMock from '../components/CommunityMock';
import { useStudentProblems } from '../hooks/useStudentProblems';
import { ROUTES, getProblemRoute } from '../../../lib/routes';

export default function StudentDashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { problems, loading, error, reload } = useStudentProblems();
  const [view, setView] = useState<'home' | 'discover' | 'calendar' | 'profile' | 'community'>('home');
  const [activeTab, setActiveTab] = useState<'practice' | 'class'>('practice');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const streak = 32; // placeholder until calendar/progress is wired

  const classExercises = [
    { id: 'c1', date: '09.12.2025', topic: 'Addition', title: 'Zahlenraum bis 100', status: 'open' },
    { id: 'c2', date: '11.12.2025', topic: 'Subtraktion', title: 'Kopfrechnen-Training', status: 'locked' },
    { id: 'c3', date: '13.12.2025', topic: 'Geometrie', title: 'Formen und Figuren', status: 'locked' },
  ];

  const problemsByOperation = useMemo(() => {
    const groups: Record<string, typeof problems> = {
      'Addition': [],
      'Subtraktion': [],
      'Multiplikation': [],
      'Division': [],
    };

    if (!problems) return groups;
    
    problems.forEach((problem) => {
      const mainOp = problem.operations?.[0] || 'sonstiges';
      const topicMap: Record<string, string> = {
        addition: 'Addition',
        subtraction: 'Subtraktion',
        multiplication: 'Multiplikation',
        division: 'Division',
        sonstiges: 'Sonstiges',
      };
      const topic = topicMap[mainOp] || 'Sonstiges';
      
      if (!groups[topic]) {
        groups[topic] = [];
      }
      groups[topic].push(problem);
    });
    
    return groups;
  }, [problems]);

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
        loading || error || !problems.length ? (
          <ProblemList
            problems={problems}
            loading={loading}
            error={error}
            onRetry={() => {
              void reload();
            }}
            onSelect={handleSelect}
          />
        ) : selectedTopic ? (
          <div className="space-y-4">
                      <div className="mb-6">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 mb-6"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
              <span className="text-lg">Zurück zur Übersicht</span>
            </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 px-2 border-l-4 border-slate-800 ml-1">
                {selectedTopic}
              </h3>
              <ProblemList
                problems={problemsByOperation[selectedTopic] || []}
                loading={false}
                error={null}
                onRetry={() => {}}
                onSelect={handleSelect}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(problemsByOperation).map(([topic, topicProblems]) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className="flex flex-col items-start p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-left group"
              >
                <div className="mb-3 p-3 rounded-2xl bg-slate-50 text-slate-700 group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors">
                  {topic === 'Addition' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  )}
                  {topic === 'Subtraktion' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  )}
                  {topic === 'Multiplikation' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 6-12 12" />
                      <path d="m6 6 12 12" />
                    </svg>
                  )}
                  {topic === 'Division' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="6" r="1" />
                      <line x1="5" x2="19" y1="12" y2="12" />
                      <circle cx="12" cy="18" r="1" />
                    </svg>
                  )}
                  {topic === 'Sonstiges' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{topic}</h3>
                <p className="text-sm text-slate-500">
                  {topicProblems.length} {topicProblems.length === 1 ? 'Aufgabe' : 'Aufgaben'}
                </p>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {classExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                exercise.status === 'open'
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50 border-slate-100 opacity-75'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    exercise.status === 'open'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {exercise.date.split('.')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {exercise.topic}
                    </span>
                    <span className="text-xs text-slate-400">• {exercise.date}</span>
                  </div>
                  <h3 className={`font-bold ${exercise.status === 'open' ? 'text-slate-900' : 'text-slate-600'}`}>
                    {exercise.title}
                  </h3>
                </div>
              </div>
              
              {exercise.status === 'open' ? (
                <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                  Starten
                </button>
              ) : (
                <div className="flex items-center gap-1 text-slate-400 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span className="text-sm font-medium">Gesperrt</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  let content: ReactNode = renderHome();
  if (view === 'discover') content = <DiscoverMock />;
  if (view === 'community') content = <CommunityMock />;
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
