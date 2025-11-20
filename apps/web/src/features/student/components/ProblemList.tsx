import ProblemCard from './ProblemCard';
import type { MathWordProblemWithMeta } from '../../../types/problem';

type ProblemListProps = {
  problems: MathWordProblemWithMeta[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (problemId: string) => void;
};

export default function ProblemList({ problems, loading, error, onRetry, onSelect }: ProblemListProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50/70 text-rose-700 p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Laden fehlgeschlagen</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-2 rounded-xl bg-rose-700 text-white text-sm font-semibold hover:bg-rose-800"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 text-center text-slate-600">
        <p className="font-semibold text-slate-900 mb-1">Keine Aufgaben verfügbar</p>
        <p className="text-sm">Sobald eine Lehrkraft Aufgaben freigibt, erscheinen sie hier.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} onSelect={onSelect} />
      ))}
    </div>
  );
}
