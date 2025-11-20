import type { DashboardStudent } from '../../../types/student';
import StudentRow from './StudentRow';

type StudentTableProps = {
  students: DashboardStudent[];
  onToggleGroup: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function StudentTable({ students, onToggleGroup, onDelete }: StudentTableProps) {
  if (students.length === 0) {
    return <div className="text-sm text-slate-600 py-4">Noch keine Schüler:innen angelegt.</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {students.map((student) => (
        <StudentRow
          key={student.studentId}
          student={student}
          onToggleGroup={onToggleGroup}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
