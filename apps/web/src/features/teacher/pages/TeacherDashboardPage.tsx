import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROUTES } from '../../../lib/routes';
import TeacherLayout from '../components/TeacherLayout';
import StudentTable from '../components/StudentTable';
import CreateStudentForm from '../components/CreateStudentForm';
import ClassExerciseList from '../components/ClassExerciseList';
import CreateClassExerciseForm from '../components/CreateClassExerciseForm';
import ProblemList from '../components/ProblemList';
import ProblemForm from '../components/ProblemForm';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

export default function TeacherDashboardPage() {
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const {
    classes,
    selectedClassId,
    students,
    totalProblems,
    problems,
    exercises,
    loadingClasses,
    loadingStudents,
    problemsLoading,
    exercisesLoading,
    classError,
    studentError,
    problemError,
    selectClass,
    refreshClasses,
    refreshStudents,
    refreshProblems,
    refreshExercises,
    createClass,
    createStudent,
    deleteStudent,
    toggleGroup,
    updateStudentGender,
    createProblem,
    deleteProblem,
    createExercise,
    deleteExercise,
  } = useTeacherDashboard();

  const [activeTab, setActiveTab] = useState<'classes' | 'problems'>('classes');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [submittingProblem, setSubmittingProblem] = useState(false);
  const [creatingClass, setCreatingClass] = useState(false);

  const selectedClass = useMemo(
    () => classes.find((cls) => cls.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  const handleLogout = async () => {
    await logout();
    navigate(`${ROUTES.teacherLogin}?loggedOut=1`, { replace: true });
  };

  const handleRefresh = async () => {
    await Promise.all([refreshClasses(), refreshProblems()]);
    if (selectedClassId) {
      await Promise.all([refreshStudents(selectedClassId), refreshExercises(selectedClassId)]);
    }
    toast.success('Aktualisiert');
  };

  const handleCreateClass = async (grade: number, suffix?: string | null) => {
    setCreatingClass(true);
    try {
      await createClass(grade, suffix ?? '');
      toast.success('Klasse angelegt');
      setShowClassForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Erstellen der Klasse';
      toast.error(message);
    } finally {
      setCreatingClass(false);
    }
  };

  const handleCreateStudent = async (values: Parameters<typeof createStudent>[0]) => {
    setSubmittingStudent(true);
    try {
      await createStudent({
        ...values,
        classId: values.classId || selectedClassId || null,
      });
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

  const handleCreateExercise = async (values: Parameters<typeof createExercise>[0]) => {
    try {
      await createExercise(values);
      toast.success('Übung erstellt');
      setShowExerciseForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Erstellen';
      toast.error(message);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      toast.success('Übung gelöscht');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Löschen fehlgeschlagen';
      toast.error(message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      toast.success('Schüler:in gelöscht');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Löschen fehlgeschlagen';
      toast.error(message);
    }
  };

  const fullName =
    [authState.user?.firstName, authState.user?.lastName].filter(Boolean).join(' ') ||
    authState.user?.email ||
    'Lehrkraft';

  const totalStudents = students.length;

  return (
    <TeacherLayout
      title={`Hallo ${fullName}`}
      subtitle="Verwalte deine Klassen und Aufgaben."
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
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === 'classes'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Klassen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === 'problems'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Aufgaben
        </button>
      </div>

      {activeTab === 'classes' ? (
        <div className="space-y-6">
          <div className="flex items-center flex-wrap gap-3">
            <div className="rounded-2xl bg-blue-50 text-blue-700 px-4 py-2 font-semibold">
              Klassen: {classes.length || 0}
            </div>
            <div className="rounded-2xl bg-green-50 text-green-700 px-4 py-2 font-semibold">
              Schüler:innen: {totalStudents}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Deine Klassen</h2>
              <p className="text-sm text-slate-600">Wähle eine Klasse, um Schüler:innen zu verwalten.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClassForm((v) => !v)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {showClassForm ? 'Klassenformular schließen' : 'Neue Klasse'}
              </button>
            </div>
          </div>

          {showClassForm ? (
            <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget as HTMLFormElement);
                  const grade = Number(formData.get('grade') || 3);
                  const suffix = (formData.get('suffix') as string) || '';
                  await handleCreateClass(grade, suffix);
                  (e.currentTarget as HTMLFormElement).reset();
                }}
              >
                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">Klassenstufe</span>
                  <select
                    name="grade"
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                    defaultValue={3}
                    disabled={creatingClass}
                  >
                    <option value={3}>3. Klasse</option>
                    <option value={4}>4. Klasse</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">Suffix (optional)</span>
                  <input
                    name="suffix"
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                    placeholder="z.B. a"
                    disabled={creatingClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={creatingClass}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creatingClass ? 'Erstelle...' : 'Klasse anlegen'}
                </button>
              </form>
            </div>
          ) : null}

          {loadingClasses ? (
            <div className="text-sm text-slate-600">Lade Klassen...</div>
          ) : classError ? (
            <div className="text-sm text-rose-600">Fehler: {classError}</div>
          ) : classes.length === 0 ? (
            <div className="text-sm text-slate-600">Noch keine Klassen angelegt.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => selectClass(cls.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedClassId === cls.id
                      ? 'border-blue-400 bg-blue-50 shadow'
                      : 'border-slate-200 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Klasse</div>
                  <div className="text-xl font-bold text-slate-900">{cls.label}</div>
                  <div className="text-sm text-slate-600">Stufe {cls.grade}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-800">
                    {cls.studentCount} Schüler:innen
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedClass ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Schüler:innen in Klasse {selectedClass.label}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aufgaben insgesamt: {totalProblems} | Stufe {selectedClass.grade}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => refreshStudents(selectedClassId)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Aktualisieren
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStudentForm((v) => !v)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700"
                  >
                    {showStudentForm ? 'Formular schließen' : 'Schüler:in hinzufügen'}
                  </button>
                </div>
              </div>

              {showStudentForm ? (
                <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
                  <CreateStudentForm
                    onSubmit={handleCreateStudent}
                    onCancel={() => setShowStudentForm(false)}
                    isSubmitting={submittingStudent}
                    classOptions={classes.map((cls) => ({ value: cls.id, label: cls.label }))}
                    defaultClassId={selectedClassId}
                  />
                </div>
              ) : null}

              {loadingStudents ? (
                <div className="text-sm text-slate-600">Lade Schülerdaten...</div>
              ) : studentError ? (
                <div className="text-sm text-rose-600">Fehler: {studentError}</div>
              ) : (
                <StudentTable
                  students={students}
                  classId={selectedClassId!}
                  onToggleGroup={toggleGroup}
                  onDelete={handleDeleteStudent}
                  onUpdateGender={updateStudentGender}
                />
              )}

              <div className="border-t border-slate-200 my-8"></div>

              {showExerciseForm ? (
                <CreateClassExerciseForm
                  classId={selectedClassId!}
                  availableProblems={problems}
                  onSubmit={handleCreateExercise}
                  onCancel={() => setShowExerciseForm(false)}
                />
              ) : (
                <ClassExerciseList
                  exercises={exercises}
                  loading={exercisesLoading}
                  onCreate={() => setShowExerciseForm(true)}
                  onDelete={handleDeleteExercise}
                />
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <section className="space-y-4">
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
            <ProblemList
              problems={problems}
              onDelete={async (id) => {
                try {
                  await deleteProblem(id);
                  toast.success('Aufgabe gelöscht');
                } catch (err) {
                  const message = err instanceof Error ? err.message : 'Löschen fehlgeschlagen';
                  toast.error(message);
                }
              }}
            />
          )}
        </section>
      )}
    </TeacherLayout>
  );
}
