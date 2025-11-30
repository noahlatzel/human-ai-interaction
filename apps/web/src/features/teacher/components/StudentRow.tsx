import { useState } from 'react';
import { createPortal } from 'react-dom';
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
      className="h-full bg-blue-600"
      style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
    />
  </div>
);

export default function StudentRow({ student, onToggleGroup, onDelete }: StudentRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const fullName =
    [student.firstName, student.lastName].filter(Boolean).join(' ') || `Schüler ${student.studentId}`;
  const percent = student.completionRate * 100;

  const confirmModal =
    showConfirm && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm space-y-4">
              <p className="text-sm font-semibold text-slate-900">
                Möchtest du diesen Schüler wirklich löschen?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    onDelete(student.studentId);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
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
            onClick={() => setShowConfirm(true)}
            className="p-2 text-rose-600 hover:text-rose-700"
            aria-label="Schüler:in löschen"
          >
            <span aria-hidden>🗑️</span>
          </button>
        </div>
      </div>

      {confirmModal}
    </>
  );
}
