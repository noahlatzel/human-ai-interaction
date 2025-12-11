import type { DashboardStudent } from '../../../types/student';
import type { Gender } from '../../../types/user';
import StudentRow from './StudentRow';

type StudentTableProps = {
  students: DashboardStudent[];
  classId: string;
  onToggleGroup: (id: string) => void;
  onDelete: (id: string) => Promise<void> | void;
  onUpdateGender: (studentId: string, classId: string, gender: Gender) => Promise<void> | void;
};

export default function StudentTable({ students, classId, onToggleGroup, onDelete, onUpdateGender }: StudentTableProps) {
  if (students.length === 0) {
    return <div className="text-sm text-slate-600 py-4">Noch keine Schüler:innen angelegt.</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {students.map((student) => (
        <StudentRow
          key={student.studentId}
          student={student}
          classId={classId}
          onToggleGroup={onToggleGroup}
          onDelete={onDelete}
          onUpdateGender={onUpdateGender}
        />
      ))}
    </div>
  );
}
