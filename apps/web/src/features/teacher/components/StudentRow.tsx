import StudentGroupToggle from './StudentGroupToggle';
import type { DashboardStudent } from '../../../types/student';

type StudentRowProps = {
  student: DashboardStudent;
  onToggleGroup: (id: string) => void;
  onDelete: (id: string) => void;
};

const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-green-500"
      style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
    />
  </div>
);

export default function StudentRow({ student, onToggleGroup, onDelete }: StudentRowProps) {
  const fullName =
    [student.firstName, student.lastName].filter(Boolean).join(' ') || `Schüler ${student.studentId}`;
  const percent = student.completionRate * 100;

  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="col-span-4">
        <div className="font-semibold text-slate-900">{fullName}</div>
        <div className="text-xs text-slate-500">ID: {student.studentId}</div>
      </div>
      <div className="col-span-3">
        <div className="text-sm font-semibold text-slate-800">
          {student.solved}/{student.totalProblems}
        </div>
        <ProgressBar percent={percent} />
      </div>
      <div className="col-span-2">
        <div className="text-sm font-semibold text-slate-800 text-center">
          {Math.round(percent)}%
        </div>
        <div className="text-xs text-slate-500 text-center">Erfolgsrate</div>
      </div>
      <div className="col-span-2 flex justify-center">
        <StudentGroupToggle value={student.group} onToggle={() => onToggleGroup(student.studentId)} />
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          type="button"
          onClick={() => onDelete(student.studentId)}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
