import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROUTES } from '../../../lib/routes';
import TeacherLayout from '../components/TeacherLayout';
import StudentTable from '../components/StudentTable';
import CreateStudentForm from '../components/CreateStudentForm';
import ProblemList from '../components/ProblemList';
import ProblemForm from '../components/ProblemForm';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

export default function TeacherDashboardPage() {
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const {
    students,
    totalProblems,
    problems,
    loading,
    problemsLoading,
    error,
    problemError,
    refreshStudents,
    refreshProblems,
    createStudent,
    deleteStudent,
    toggleGroup,
    createProblem,
    deleteProblem,
  } = useTeacherDashboard();

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [submittingProblem, setSubmittingProblem] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(`${ROUTES.teacherLogin}?loggedOut=1`, { replace: true });
  };

  const handleRefresh = async () => {
    await Promise.all([refreshStudents(), refreshProblems()]);
    toast.success('Aktualisiert');
  };

  const handleCreateStudent = async (values: Parameters<typeof createStudent>[0]) => {
    setSubmittingStudent(true);
    try {
      await createStudent(values);
      toast.success('Schüler:in angelegt');
      setShowStudentForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Anlegen';
      toast.error(message);
    } finally {
      setSubmittingStudent(false);
    }
  };

  const handleCreateProblem = async (values: Parameters<typeof createProblem>[0]) => {
    setSubmittingProblem(true);
    try {
      await createProblem(values);
      toast.success('Aufgabe erstellt');
      setShowProblemForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Erstellen';
      toast.error(message);
    } finally {
      setSubmittingProblem(false);
    }
  };

  const fullName =
    [authState.user?.firstName, authState.user?.lastName].filter(Boolean).join(' ') ||
    authState.user?.email ||
    'Lehrkraft';

  return (
    <TeacherLayout
      title={`Hallo ${fullName}`}
      subtitle="Verwalte deine Schüler:innen und Aufgaben."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Aktualisieren
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-950"
          >
            Abmelden
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-2xl bg-blue-50 text-blue-700 px-4 py-2 font-semibold">
              Schüler:innen: {students.length}
            </div>
            <div className="rounded-2xl bg-green-50 text-green-700 px-4 py-2 font-semibold">
              Gesamt-Aufgaben: {totalProblems}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Klassenliste</h2>
            <button
              type="button"
              onClick={() => setShowStudentForm((v) => !v)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-green-700"
            >
              {showStudentForm ? 'Formular schließen' : 'Schüler:in hinzufügen'}
            </button>
          </div>

          {showStudentForm ? (
            <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
              <CreateStudentForm
                onSubmit={handleCreateStudent}
                onCancel={() => setShowStudentForm(false)}
                isSubmitting={submittingStudent}
              />
            </div>
          ) : null}

          {loading ? (
            <div className="text-sm text-slate-600">Lade Schülerdaten...</div>
          ) : error ? (
            <div className="text-sm text-rose-600">Fehler: {error}</div>
          ) : (
            <StudentTable students={students} onToggleGroup={toggleGroup} onDelete={deleteStudent} />
          )}
        </section>

        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Textaufgaben</h2>
            <button
              type="button"
              onClick={() => setShowProblemForm((v) => !v)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {showProblemForm ? 'Schließen' : 'Neu'}
            </button>
          </div>

          {showProblemForm ? (
            <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
              <ProblemForm
                onSubmit={handleCreateProblem}
                onCancel={() => setShowProblemForm(false)}
                isSubmitting={submittingProblem}
              />
            </div>
          ) : null}

          {problemsLoading ? (
            <div className="text-sm text-slate-600">Lade Aufgaben...</div>
          ) : problemError ? (
            <div className="text-sm text-rose-600">Fehler: {problemError}</div>
          ) : (
            <ProblemList problems={problems} onDelete={async (id) => {
              try {
                await deleteProblem(id);
                toast.success('Aufgabe gelöscht');
              } catch (err) {
                const message = err instanceof Error ? err.message : 'Löschen fehlgeschlagen';
                toast.error(message);
              }
            }} />
          )}
        </section>
      </div>
    </TeacherLayout>
  );
}
