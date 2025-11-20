import type { MathWordProblem } from '../../../types/problem';
import ProblemRow from './ProblemRow';

type ProblemListProps = {
  problems: MathWordProblem[];
  onDelete: (id: string) => void;
};

export default function ProblemList({ problems, onDelete }: ProblemListProps) {
  if (problems.length === 0) {
    return <div className="text-sm text-slate-600 py-4">Noch keine Textaufgaben angelegt.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {problems.map((problem) => (
        <ProblemRow key={problem.id} problem={problem} onDelete={onDelete} />
      ))}
    </div>
  );
}
