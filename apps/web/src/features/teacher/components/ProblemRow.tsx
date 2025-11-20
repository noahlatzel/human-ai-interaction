import type { MathWordProblem } from '../../../types/problem';

type ProblemRowProps = {
  problem: MathWordProblem;
  onDelete: (id: string) => void;
};

export default function ProblemRow({ problem, onDelete }: ProblemRowProps) {
  return (
    <div className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-blue-700">Aufgabe</div>
          <p className="text-sm text-slate-800">{problem.problemDescription}</p>
          <p className="text-xs text-slate-500">Lösung: {problem.solution}</p>
          <p className="text-xs text-slate-500">
            Operationen: {problem.operations.map((op) => OPERATIONS_LABELS[op] ?? op).join(', ')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-slate-700">
            Schwierigkeit {problem.difficulty}
          </span>
          <button
            type="button"
            onClick={() => onDelete(problem.id)}
            className="text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            Löschen
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
