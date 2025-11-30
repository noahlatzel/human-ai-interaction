import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProblemHeader from '../components/ProblemHeader';
import ProblemStatement from '../components/ProblemStatement';
import ScratchPadCanvas from '../components/ScratchPadCanvas';
import ScratchPadText from '../components/ScratchPadText';
import AnswerForm from '../components/AnswerForm';
import { useProblem } from '../hooks/useProblem';
import { submitProgress } from '../../student/api/submitProgress';
import { ROUTES } from '../../../lib/routes';
import forestBackground from '../../../assets/forestBackground.png';
import companion from '../../../assets/companion.png';
import type { MathWordProblem } from '../../../types/problem';

type LocationState = {
  problems?: MathWordProblem[];
};

export default function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [textAnswer, setTextAnswer] = useState('');
  const [, setSketch] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { problem, loading, error, notFound, refresh } = useProblem(
    problemId ?? '',
    state?.problems,
  );

  useEffect(() => {
    if (notFound && !loading) {
      toast.error('Diese Aufgabe wurde nicht gefunden.');
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [loading, navigate, notFound]);

  const hint = useMemo(() => {
    const hints = (problem?.hints ?? []).filter((value): value is string => Boolean(value));
    if (hints.length > 0) return hints[0];
    return 'Wenn du feststeckst, versuche den Aufgabentext zu markieren und die wichtigen Zahlen zu finden.';
  }, [problem?.hints]);

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?\s]+$/g, '');

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const success = normalize(textAnswer) === normalize(problem.solution);
      await submitProgress({ mathWordProblemId: problem.id, success });
      toast.success(success ? 'Richtig! Fortschritt gespeichert.' : 'Gespeichert, aber Lösung prüfen.');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-700 font-semibold">Lade Aufgabe...</div>
      </div>
    );
  }

  if (error) {
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
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${forestBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 relative z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold bg-white/90 border border-slate-200 rounded-full px-4 py-2 shadow hover:-translate-y-0.5 transition"
        >
          ← Zurück
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
              <ProblemHeader problem={problem} />
              <ProblemStatement text={problem.problemDescription} hint={hint} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/90 backdrop-blur shadow-lg p-5 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Dein Rechenweg (Skizze)</h2>
                <ScratchPadCanvas onChange={setSketch} />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Deine Lösung (Text)</h2>
                <ScratchPadText value={textAnswer} onChange={setTextAnswer} />
              </div>

              <AnswerForm isSubmitting={submitting} onSubmit={handleSubmit} onNext={handleNext} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed left-4 bottom-4 z-20">
        <div className="rounded-2xl bg-white/95 border border-emerald-100 shadow-xl p-4 max-w-[15rem] flex gap-3 items-center">
          <img src={companion} alt="Begleiter" className="w-16 h-16 object-contain drop-shadow" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-emerald-700">Brauchst du Hilfe?</p>
            <p className="text-sm text-slate-600">
              Bald kannst du hier Tipps oder den Lernbegleiter öffnen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
