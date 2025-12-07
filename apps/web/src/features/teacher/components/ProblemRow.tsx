import { getDifficultyMeta } from '../../problems/utils';
import type { MathWordProblem } from '../../../types/problem';

type ProblemRowProps = {
  problem: MathWordProblem;
  onDelete: (id: string) => void;
};

export default function ProblemRow({ problem, onDelete }: ProblemRowProps) {
  const difficulty = getDifficultyMeta(problem.difficulty);
  const hints = (problem.hints ?? []).filter((hint): hint is string => Boolean(hint));

  return (
    <div className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-green-700">Aufgabe</div>
          <p className="text-sm text-slate-800">{problem.problemDescription}</p>
          <p className="text-xs text-slate-500">Lösung: {problem.solution}</p>
          <p className="text-xs text-slate-500">Stufe: {problem.grade}. Klasse</p>
          <p className="text-xs text-slate-500">
            Operationen: {problem.operations.map((op) => OPERATIONS_LABELS[op] ?? op).join(', ')}
          </p>
          {hints.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {hints.map((hint, index) => (
                <li key={`${problem.id}-hint-${index}`} className="text-xs text-slate-600">
                  Hinweis {index + 1}: {hint}
                </li>
              ))}
            </ul>
          ) : null}
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

const OPERATIONS_LABELS: Record<string, string> = {
  addition: 'Addition',
  subtraction: 'Subtraktion',
  multiplication: 'Multiplikation',
  division: 'Division',
};
