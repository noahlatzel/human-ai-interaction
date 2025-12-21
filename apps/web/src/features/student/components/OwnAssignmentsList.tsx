import { useState } from 'react';
import { Edit2, Trash2, Calendar, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { StudentOwnExercise } from '../../../types/studentOwnExercise';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { getProblemRoute } from '../../../lib/routes';
import { getDifficultyMeta } from '../../problems/utils';

interface OwnAssignmentsListProps {
  exercises: StudentOwnExercise[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (exercise: StudentOwnExercise) => void;
  solvedOwnExerciseIds?: Set<string>;
}

const toneClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-yellow-100 text-yellow-800',
  rose: 'bg-red-100 text-red-800',
};

export const OwnAssignmentsList = ({
  exercises,
  onDelete,
  onUpdate,
  solvedOwnExerciseIds = new Set(),
}: OwnAssignmentsListProps) => {
  const navigate = useNavigate();
  const [editingExercise, setEditingExercise] = useState<StudentOwnExercise | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleStart = (exercise: StudentOwnExercise) => {
    navigate(getProblemRoute(exercise.id), {
      state: {
        studentExercise: exercise,
        source: 'own_exercises',
        exerciseTab: 'own',
      },
    });
  };

  const handleEdit = (exercise: StudentOwnExercise) => {
    setEditingExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchtest du diese Aufgabe wirklich löschen?')) {
      return;
    }

    try {
      await onDelete(id);
      toast.success('Aufgabe gelöscht');
    } catch {
      toast.error('Fehler beim Löschen der Aufgabe');
    }
  };

  const handleEditSuccess = (exercise: StudentOwnExercise) => {
    onUpdate(exercise);
    setIsEditModalOpen(false);
    setEditingExercise(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Noch keine eigenen Aufgaben</p>
        <p className="text-gray-400 text-sm mt-2">
          Erstelle deine erste Aufgabe mit dem Button oben rechts
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => {
          const difficulty = getDifficultyMeta(exercise.difficultyLevel);
          const difficultyClass = toneClasses[difficulty.tone] ?? 'bg-gray-100 text-gray-800';
          const stepsPreview = exercise.analysis.steps?.[0];

          return (
            <div
              key={exercise.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyClass}`}>
                    {difficulty.label}
                  </span>
                  {solvedOwnExerciseIds.has(exercise.id) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    aria-label="Bearbeiten"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-900 mb-3 line-clamp-3">
                {exercise.problemText}
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sprache:</span>
                  <span>{exercise.language === 'de' ? 'Deutsch' : 'English'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Antwort:</span>
                  <span className="font-semibold text-green-600">
                    {exercise.analysis.finalAnswer}
                  </span>
                </div>
              </div>

              {stepsPreview && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 line-clamp-2">{stepsPreview}</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Erstellt am {formatDate(exercise.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleStart(exercise)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Starten
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <CreateAssignmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingExercise(null);
          }}
          onSuccess={handleEditSuccess}
          editExercise={editingExercise}
        />
      )}
    </>
  );
};
