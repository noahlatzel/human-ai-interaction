import { formatOperation, getDifficultyMeta } from '../../problems/utils';
import type { MathWordProblem } from '../../../types/problem';

type ProblemRowProps = {
  problem: MathWordProblem;
  onDelete: (id: string) => void;
};

export default function ProblemRow({ problem, onDelete }: ProblemRowProps) {
  const difficulty = getDifficultyMeta(problem.difficultyLevel);

  return (
    <div className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-green-700">Aufgabe</div>
          <p className="text-sm text-slate-800">{problem.problemText}</p>
          <p className="text-xs text-slate-500">Lösung: {problem.analysis.finalAnswer}</p>
          <p className="text-xs text-slate-500">Stufe: {problem.grade}. Klasse</p>
          <p className="text-xs text-slate-500">
            Operationen: {problem.analysis.operations.map((op) => formatOperation(op)).join(', ')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-slate-700">{difficulty.label}</span>
          <button
            type="button"
            onClick={() => onDelete(problem.id)}
            className="p-2 text-rose-600 hover:text-rose-700"
            aria-label="Aufgabe löschen"
          >
            <span aria-hidden>🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
