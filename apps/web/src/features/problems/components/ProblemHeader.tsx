import { formatOperation, getDifficultyMeta } from '../utils';
import type { MathWordProblem } from '../../../types/problem';

type ProblemHeaderProps = {
  problem: MathWordProblem;
};

const toneClasses: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  rose: 'bg-rose-50 text-rose-700',
};

export default function ProblemHeader({ problem }: ProblemHeaderProps) {
  const difficulty = getDifficultyMeta(problem.difficulty);
  const toneClass = toneClasses[difficulty.tone] ?? 'bg-slate-100 text-slate-700';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {problem.operations.map((op) => (
            <span key={op} className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
              {formatOperation(op)}
            </span>
          ))}
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${toneClass}`}>
          {difficulty.label}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Textaufgabe</h1>
    </div>
  );
}
