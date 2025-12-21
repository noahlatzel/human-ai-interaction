import { formatOperation, getDifficultyMeta, getOperationMeta } from '../../problems/utils';
import type { MathWordProblem } from '../../../types/problem';

type ProblemCardProps = {
  problem: MathWordProblem;
  onSelect: (problemId: string) => void;
};

const toneClasses: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  rose: 'bg-rose-50 text-rose-700',
};

export default function ProblemCard({ problem, onSelect }: ProblemCardProps) {
  const difficulty = getDifficultyMeta(problem.difficultyLevel);
  const toneClass = toneClasses[difficulty.tone] ?? 'bg-slate-100 text-slate-700';
  const operations = problem.analysis.operations ?? [];
  const mainOperation = getOperationMeta(operations[0]);
  const gradient = mainOperation?.gradient ?? 'from-slate-50 to-white border-slate-100';
  const icon = mainOperation?.icon ?? '📝';

  return (
    <button
      type="button"
      onClick={() => onSelect(problem.id)}
      className={`w-full text-left rounded-3xl border bg-gradient-to-br ${gradient} shadow-sm hover:shadow-lg transition overflow-hidden`}
    >
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              {icon}
            </span>
            <div className="flex flex-wrap gap-2">
              {operations.map((op) => (
                <span
                  key={op}
                  className="px-2 py-1 text-xs font-semibold rounded-full bg-white/70 text-slate-700 border border-white/60"
                >
                  {formatOperation(op)}
                </span>
              ))}
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${toneClass}`}>
            {difficulty.label}
          </span>
        </div>
        <p className="text-base font-semibold text-slate-900 line-clamp-2">{problem.problemText}</p>
        <p className="text-xs text-slate-600 line-clamp-1">Loslegen und Lösung skizzieren</p>
      </div>
    </button>
  );
}
