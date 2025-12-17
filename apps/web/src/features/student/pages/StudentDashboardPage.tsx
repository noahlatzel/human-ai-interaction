import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import StudentLayout from '../components/StudentLayout';
import ProblemList from '../components/ProblemList';
import ProgressCard from '../components/ProgressCard';
import DashboardTabs from '../components/DashboardTabs';
import DiscoverMock from '../components/DiscoverMock';
import StudentCalendar from '../components/StudentCalendar';
import ProfileMock from '../components/ProfileMock';
import { DiscussionList } from '../../discussions/components/DiscussionList';
import { DiscussionDetail } from '../../discussions/components/DiscussionDetail';
import { CreateDiscussionForm } from '../../discussions/components/CreateDiscussionForm';
import { OwnAssignmentsList } from '../components/OwnAssignmentsList';
import { CreateAssignmentModal } from '../components/CreateAssignmentModal';
import { useStreak } from '../hooks/useStreak';
import { useClassExercises } from '../hooks/useClassExercises';
import { useHomeworkExercises } from '../hooks/useHomeworkExercises';
import { useStudentOwnExercises } from '../hooks/useStudentOwnExercises';
import { useSolvedProgress } from '../hooks/useSolvedProgress';
import { ROUTES, getProblemRoute } from '../../../lib/routes';
import { Plus, Check } from 'lucide-react';

type DashboardLocationState = {
  returnToExercise?: string;
  returnToTab?: 'practice' | 'class' | 'own';
};

export default function StudentDashboardPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as DashboardLocationState | null;

  // Homework exercises (Zuhause üben)
  const { exercises: homeworkExercises, loading: homeworkLoading } = useHomeworkExercises();
  const { streak: streakData } = useStreak();
  const { exercises: classExercises, loading: classExercisesLoading } = useClassExercises();
  const { solvedProblemIds, solvedOwnExerciseIds } = useSolvedProgress();

  const {
    exercises: ownExercises,
    isLoading: ownExercisesLoading,
    deleteExercise,
    addExerciseToState,
    updateExerciseInState,
  } = useStudentOwnExercises();
  const [view, setView] = useState<'home' | 'discover' | 'calendar' | 'profile' | 'community'>('home');
  const [communityView, setCommunityView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'practice' | 'class' | 'own'>(locationState?.returnToTab || 'practice');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(locationState?.returnToExercise || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Clear location state after reading it to prevent re-using on refresh
  useEffect(() => {
    if (locationState?.returnToExercise || locationState?.returnToTab) {
      // Replace current history entry to clear the state
      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  // Memoize all homework problems for navigation
  const allHomeworkProblems = useMemo(() => {
    return homeworkExercises.flatMap(ex => ex.problems || []);
  }, [homeworkExercises]);

  // Memoize all class problems for navigation (performance optimization)
  const allClassProblems = useMemo(() => {
    return classExercises.flatMap(ex => ex.problems || []);
  }, [classExercises]);

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

  const handleHomeworkSelect = (problemId: string) => {
    navigate(getProblemRoute(problemId), {
      state: {
        problems: allHomeworkProblems,
        source: 'home_practice',
        exerciseId: selectedExercise,
        exerciseTab: 'practice'
      }
    });
  };

  const handleClassExerciseSelect = (problemId: string) => {
    navigate(getProblemRoute(problemId), {
      state: {
        problems: allClassProblems,
        source: 'class_exercises',
        exerciseId: selectedExercise,
        exerciseTab: 'class'
      }
    });
  };

  const renderHome = () => (
    <div className="space-y-4">
      <ProgressCard streakData={streakData} />

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Textaufgaben</h2>
          <div className="flex items-center gap-2">
            {activeTab === 'own' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Neue Aufgabe
              </button>
            )}
            {state.user?.isGuest && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                Gastmodus
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Wähle eine Aufgabe aus und bearbeite sie mit Text oder Zeichnung. Dein Fortschritt wird
          beim Abgeben gespeichert.
        </p>
        <DashboardTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'practice' ? (
        homeworkLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : homeworkExercises.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Keine Hausaufgaben vorhanden.</p>
            <p className="text-sm text-slate-400 mt-1">Dein Lehrer hat noch keine Hausaufgaben erstellt.</p>
          </div>
        ) : selectedExercise && activeTab === 'practice' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedExercise(null)}
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
              <span className="text-lg">Zurück zu Hausaufgaben</span>
            </button>
            {(() => {
              const exercise = homeworkExercises.find(e => e.id === selectedExercise);
              if (!exercise) return null;
              return (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 px-2 border-l-4 border-green-600 ml-1">
                    {exercise.title}
                  </h3>
                  {exercise.description && (
                    <p className="text-sm text-slate-600 mb-4 px-2">{exercise.description}</p>
                  )}
                  <ProblemList
                    problems={(exercise.problems || []).map((p) => ({
                      ...p,
                      difficultyLabel: p.difficulty ?? '',
                      difficultyValue: p.difficulty === 'einfach' ? 1 : p.difficulty === 'mittel' ? 2 : p.difficulty === 'schwierig' ? 3 : 0,
                    }))}
                    loading={false}
                    error={null}
                    onRetry={() => { }}
                    onSelect={handleHomeworkSelect}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-3">
            {homeworkExercises.map((exercise) => {
              const scheduledDate = new Date(exercise.scheduledAt);
              const day = scheduledDate.getDate().toString().padStart(2, '0');
              const month = (scheduledDate.getMonth() + 1).toString().padStart(2, '0');
              const year = scheduledDate.getFullYear();
              const formattedDate = `${day}.${month}.${year}`;

              // Check if all problems in this exercise are solved
              const problems = exercise.problems || [];
              const allSolved = problems.length > 0 && problems.every(p => solvedProblemIds.has(p.id));
              const solvedCount = problems.filter(p => solvedProblemIds.has(p.id)).length;

              return (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${exercise.status === 'open'
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50 border-slate-100 opacity-75'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold relative ${exercise.status === 'open'
                        ? allSolved ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {allSolved ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        day
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {exercise.topic}
                        </span>
                        <span className="text-xs text-slate-400">• {formattedDate}</span>
                        {problems.length > 0 && (
                          <span className={`text-xs font-medium ${allSolved ? 'text-green-600' : 'text-slate-400'}`}>
                            • {solvedCount}/{problems.length} gelöst
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold ${exercise.status === 'open' ? 'text-slate-900' : 'text-slate-600'}`}>
                        {exercise.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {allSolved && (
                      <div className="flex items-center gap-1 text-green-600 px-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {exercise.status === 'open' ? (
                      <button
                        onClick={() => setSelectedExercise(exercise.id)}
                        className={`px-4 py-2 rounded-xl text-white text-sm font-bold transition-colors shadow-sm ${allSolved ? 'bg-slate-400 hover:bg-slate-500 shadow-slate-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
                      >
                        {allSolved ? 'Nochmal' : 'Starten'}
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
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === 'class' ? (
        classExercisesLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : classExercises.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Keine Klassenübungen vorhanden.</p>
            <p className="text-sm text-slate-400 mt-1">Dein Lehrer hat noch keine Übungen erstellt.</p>
          </div>
        ) : selectedExercise && activeTab === 'class' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedExercise(null)}
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
              <span className="text-lg">Zurück zu Klassenübungen</span>
            </button>
            {(() => {
              const exercise = classExercises.find(e => e.id === selectedExercise);
              if (!exercise) return null;
              return (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 px-2 border-l-4 border-indigo-600 ml-1">
                    {exercise.title}
                  </h3>
                  {exercise.description && (
                    <p className="text-sm text-slate-600 mb-4 px-2">{exercise.description}</p>
                  )}
                  <ProblemList
                    problems={(exercise.problems || []).map((p) => ({
                      ...p,
                      difficultyLabel: p.difficulty ?? '',
                      difficultyValue: p.difficulty === 'einfach' ? 1 : p.difficulty === 'mittel' ? 2 : p.difficulty === 'schwierig' ? 3 : 0,
                    }))}
                    loading={false}
                    error={null}
                    onRetry={() => { }}
                    onSelect={handleClassExerciseSelect}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-3">
            {classExercises.map((exercise) => {
              const scheduledDate = new Date(exercise.scheduledAt);
              const day = scheduledDate.getDate().toString().padStart(2, '0');
              const month = (scheduledDate.getMonth() + 1).toString().padStart(2, '0');
              const year = scheduledDate.getFullYear();
              const formattedDate = `${day}.${month}.${year}`;

              // Check if all problems in this exercise are solved
              const problems = exercise.problems || [];
              const allSolved = problems.length > 0 && problems.every(p => solvedProblemIds.has(p.id));
              const solvedCount = problems.filter(p => solvedProblemIds.has(p.id)).length;

              return (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${exercise.status === 'open'
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50 border-slate-100 opacity-75'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold relative ${exercise.status === 'open'
                        ? allSolved ? 'bg-green-500 text-white' : 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {allSolved ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        day
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {exercise.topic}
                        </span>
                        <span className="text-xs text-slate-400">• {formattedDate}</span>
                        {problems.length > 0 && (
                          <span className={`text-xs font-medium ${allSolved ? 'text-green-600' : 'text-slate-400'}`}>
                            • {solvedCount}/{problems.length} gelöst
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold ${exercise.status === 'open' ? 'text-slate-900' : 'text-slate-600'}`}>
                        {exercise.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {allSolved && (
                      <div className="flex items-center gap-1 text-green-600 px-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {exercise.status === 'open' ? (
                      <button
                        onClick={() => setSelectedExercise(exercise.id)}
                        className={`px-4 py-2 rounded-xl text-white text-sm font-bold transition-colors shadow-sm ${allSolved ? 'bg-slate-400 hover:bg-slate-500 shadow-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                      >
                        {allSolved ? 'Nochmal' : 'Starten'}
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
                </div>
              );
            })}
          </div>
        )
      ) : null}
    </div>
  );

  const renderOwnExercises = () => (
    <div className="space-y-4">
      <ProgressCard streakData={streakData} />

      <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Textaufgaben</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Neue Aufgabe
            </button>
            {state.user?.isGuest && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                Gastmodus
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Erstelle deine eigenen Aufgaben oder lade ein Foto hoch, um automatisch eine Aufgabe zu generieren.
        </p>
        <DashboardTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {ownExercisesLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <OwnAssignmentsList
          exercises={ownExercises}
          onDelete={deleteExercise}
          onUpdate={updateExerciseInState}
          solvedOwnExerciseIds={solvedOwnExerciseIds}
        />
      )}
    </div>
  );

  let content: ReactNode = activeTab === 'own' ? renderOwnExercises() : renderHome();
  if (view === 'discover') content = <DiscoverMock />;
  if (view === 'community') {
    if (communityView === 'list') {
      content = (
        <DiscussionList
          onSelectDiscussion={(id) => {
            setSelectedDiscussionId(id);
            setCommunityView('detail');
          }}
          onCreateDiscussion={() => setCommunityView('create')}
        />
      );
    } else if (communityView === 'detail' && selectedDiscussionId) {
      content = (
        <DiscussionDetail
          discussionId={selectedDiscussionId}
          onBack={() => setCommunityView('list')}
        />
      );
    } else if (communityView === 'create') {
      content = (
        <CreateDiscussionForm
          onBack={() => setCommunityView('list')}
          onSuccess={() => setCommunityView('list')}
        />
      );
    }
  }
  if (view === 'calendar') content = <StudentCalendar streakData={streakData} exercises={classExercises} />;
  if (view === 'profile')
    content = (
      <ProfileMock
        firstName={state.user?.firstName}
        lastName={state.user?.lastName}
        email={state.user?.email}
        role={state.user?.role}
        gender={state.user?.gender}
        classGrade={state.user?.classGrade}
        classLabel={state.user?.classLabel}
        streak={streakData?.currentStreak}
        xp={state.user?.xp}
        solvedTasks={state.user?.solvedTasks}
      />
    );

  const handleNavChange = (newView: typeof view) => {
    setView(newView);
    if (newView !== 'community') {
      setCommunityView('list');
      setSelectedDiscussionId(null);
    }
  };

  return (
    <StudentLayout
      userName={fullName}
      onLogout={handleLogout}
      streak={streakData?.currentStreak ?? 0}
      navActive={view}
      onNavChange={handleNavChange}
      gender={state.user?.gender}
    >
      {content}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(exercise) => {
          // Exercise is already created in the modal, just add to state
          addExerciseToState(exercise);
          setIsCreateModalOpen(false);
        }}
      />
    </StudentLayout>
  );
}
