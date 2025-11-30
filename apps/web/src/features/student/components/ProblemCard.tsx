import { formatOperation, getDifficultyMeta } from '../../problems/utils';
import type { MathWordProblemWithMeta } from '../../../types/problem';

type ProblemCardProps = {
  problem: MathWordProblemWithMeta;
  onSelect: (problemId: string) => void;
};

const toneClasses: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  rose: 'bg-rose-50 text-rose-700',
};

const colorMap: Record<string, string> = {
  addition: 'from-orange-50 to-amber-50 border-orange-100',
  subtraction: 'from-orange-50 to-amber-50 border-orange-100',
  multiplication: 'from-blue-50 to-indigo-50 border-blue-100',
  division: 'from-blue-50 to-indigo-50 border-blue-100',
};

const operationIcons: Record<string, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
};

export default function ProblemCard({ problem, onSelect }: ProblemCardProps) {
  const difficulty = getDifficultyMeta(problem.difficulty);
  const toneClass = toneClasses[difficulty.tone] ?? 'bg-slate-100 text-slate-700';
  const mainOperation = problem.operations[0];
  const gradient = colorMap[mainOperation] ?? 'from-slate-50 to-white border-slate-100';
  const icon = operationIcons[mainOperation] ?? '📝';

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
              {problem.operations.map((op) => (
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
        <p className="text-base font-semibold text-slate-900 line-clamp-2">{problem.problemDescription}</p>
        <p className="text-xs text-slate-600 line-clamp-1">Loslegen und Lösung skizzieren</p>
      </div>
    </button>
  );
}
