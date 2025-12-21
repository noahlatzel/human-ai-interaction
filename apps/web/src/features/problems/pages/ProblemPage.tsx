import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/hooks/useAuth';
import ProblemHeader from '../components/ProblemHeader';
import ProblemStatement from '../components/ProblemStatement';
import ScratchPadCanvas from '../components/ScratchPadCanvas';
import ScratchPadText from '../components/ScratchPadText';
import AnswerForm from '../components/AnswerForm';
import { useProblem } from '../hooks/useProblem';
import { submitProgress } from '../../student/api/submitProgress';
import { studentOwnExercisesApi } from '../../student/api/studentOwnExercises';
import { ROUTES } from '../../../lib/routes';
import forestBackground from '../../../assets/forestBackground.png';
import companion from '../../../assets/companion.png';
import type { MathWordProblem } from '../../../types/problem';
import type { StudentOwnExercise } from '../../../types/studentOwnExercise';
import type { ExerciseSource } from '../../../types/progress';

type LocationState = {
  problems?: MathWordProblem[];
  studentExercise?: StudentOwnExercise;
  source?: ExerciseSource;
  exerciseId?: string;
  exerciseTab?: 'practice' | 'class' | 'own';
};

export default function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { reloadUser } = useAuth();

  const [textAnswer, setTextAnswer] = useState('');
  const [, setSketch] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const isStudentExercise = !!state?.studentExercise;
  const studentExercise = state?.studentExercise;

  const hookResult = useProblem(
    problemId ?? '',
    state?.problems,
  );

  // Use hook results only for regular problems, ignore for student exercises
  const { problem: fetchedProblem, loading, error, notFound, refresh } = isStudentExercise
    ? { problem: null, loading: false, error: null, notFound: false, refresh: async () => { } }
    : hookResult;

  const problem = (isStudentExercise ? studentExercise : fetchedProblem) as
    | MathWordProblem
    | StudentOwnExercise
    | null;

  // Reset wrong attempts when problem changes
  useEffect(() => {
    setWrongAttempts(0);
    setTextAnswer('');
  }, [problemId, isStudentExercise]);

  useEffect(() => {
    if (notFound && !loading && !isStudentExercise) {
      toast.error('Diese Aufgabe wurde nicht gefunden.');
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [loading, navigate, notFound, isStudentExercise]);

  const hint = useMemo(() => {
    if (!problem) return null;
    const steps = problem.analysis.steps ?? [];
    return steps[0] ?? problem.analysis.suggestion ?? 'Wenn du feststeckst, hat das Eichhörnchen möglicherweise einen Tipp für dich.';
  }, [problem]);

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?\s]+$/g, '');

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const solution = String(problem.analysis.finalAnswer);
      const success = normalize(textAnswer) === normalize(solution);

      // Track wrong attempts
      if (!success) {
        setWrongAttempts(prev => prev + 1);
      }

      // Only submit progress for regular problems, not student exercises
      if (!isStudentExercise) {
        // Determine source from location state, default to home_practice
        const source: ExerciseSource = state?.source || 'home_practice';
        await submitProgress({ mathWordProblemId: problem.id, success, source });
        if (success) {
          await reloadUser();
        }
        toast.success(success ? 'Richtig! Fortschritt gespeichert.' : 'Gespeichert, aber Lösung prüfen.');
      } else if (studentExercise) {
        // Track own exercise for achievements
        await studentOwnExercisesApi.solve(studentExercise.id, success);
        toast.success(success ? 'Richtig gelöst!' : 'Leider falsch. Versuche es nochmal!');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Konnte Fortschritt nicht speichern';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    navigate(ROUTES.dashboard);
  };

  if (loading && !isStudentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-700 font-semibold">Lade Aufgabe...</div>
      </div>
    );
  }

  if (error && !isStudentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50">
        <div className="rounded-3xl border border-rose-100 bg-white shadow-lg p-6 space-y-3 text-center">
          <p className="text-lg font-semibold text-rose-700">Fehler</p>
          <p className="text-slate-700">{error}</p>
          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-950"
          >
            Erneut laden
          </button>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url(${forestBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 relative z-10">
        <button
          type="button"
          onClick={() => {
            // Navigate back to dashboard with exercise context to show the exercise detail view
            if (state?.exerciseId && state?.exerciseTab) {
              navigate(ROUTES.dashboard, {
                state: {
                  returnToExercise: state.exerciseId,
                  returnToTab: state.exerciseTab
                }
              });
            } else {
              navigate(ROUTES.dashboard);
            }
          }}
          className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5"
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
          <span className="text-lg">
            {state?.exerciseId
              ? (state?.exerciseTab === 'practice' ? 'Zurück zur Hausaufgabe' : 'Zurück zur Klassenübung')
              : 'Zurück zur Übersicht'}
          </span>
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
              <ProblemHeader problem={problem} />
              <ProblemStatement text={problem.problemText} hint={hint} />
            </div>
          </div>

          <div className="space-y-4 relative">
            <button
              type="button"
              onClick={() => toast.success('Lehrer wurde gerufen!')}
              className="absolute -right-16 top-0 w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-600 font-bold text-2xl flex items-center justify-center hover:bg-amber-200 hover:scale-105 transition shadow-lg z-20"
              title="Lehrer rufen"
            >
              ?
            </button>
            <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Dein Rechenweg (Skizze)</h2>
                <ScratchPadCanvas onChange={setSketch} />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Deine Lösung (Text)</h2>
                <ScratchPadText value={textAnswer} onChange={setTextAnswer} />
                {wrongAttempts > 0 && (
                  <p className="text-sm text-amber-700 font-medium">
                    Falsche Versuche: {wrongAttempts}
                  </p>
                )}
              </div>

              <AnswerForm isSubmitting={submitting} onSubmit={handleSubmit} onNext={handleNext} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed left-4 bottom-4 z-20 flex items-end">
        <div className="relative rounded-2xl bg-white/95 border border-emerald-100 shadow-xl p-4 max-w-[15rem] mb-48 -mr-20 z-10">
          <div className="absolute -right-2 bottom-6 w-4 h-4 bg-white/95 border-r border-b border-emerald-100 transform -rotate-45"></div>
          <div className="space-y-1">
            {wrongAttempts >= 2 && problem?.analysis.steps?.length ? (
              <>
                <p className="text-sm font-semibold text-emerald-700">Hier ist ein Tipp:</p>
                <p className="text-sm text-slate-600">{problem.analysis.steps[0]}</p>
              </>
            ) : wrongAttempts === 1 ? (
              <>
                <p className="text-sm font-semibold text-amber-700">Versuche es nochmal!</p>
                <p className="text-sm text-slate-600">Bei einem weiteren Fehler bekommst du einen Hinweis.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-emerald-700">Brauchst du Hilfe?</p>
                <p className="text-sm text-slate-600">
                  Bald kannst du hier Tipps oder den Lernbegleiter öffnen.
                </p>
              </>
            )}
          </div>
        </div>
        <img src={companion} alt="Begleiter" className="w-80 h-80 object-contain drop-shadow-lg relative z-0" />
      </div>
    </div>
  );
}
