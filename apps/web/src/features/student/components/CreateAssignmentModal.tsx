import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { analyzeProblem } from '../api/analyzeProblem';
import { extractProblems } from '../api/extractProblems';
import { studentOwnExercisesApi } from '../api/studentOwnExercises';
import { fileToBase64 } from '../../../utils/fileUtils';
import { convertPdfToImage } from '../../../utils/pdfUtils';
import type { StudentOwnExercise } from '../../../types/studentOwnExercise';
import type { Language } from '../../../types/problem';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (exercise: StudentOwnExercise) => void;
  editExercise?: StudentOwnExercise | null;
}

interface FormData {
  problemText: string;
  language: Language;
}

const DEFAULT_LANGUAGE: Language = 'de';

type ProcessingStage = 'extract' | 'analyze' | 'upload' | null;

const stageLabels: Record<Exclude<ProcessingStage, null>, string> = {
  extract: 'Erkenne Aufgabe...',
  analyze: 'Analysiere Aufgabe...',
  upload: 'Lade Aufgabe hoch...',
};

export const CreateAssignmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  editExercise,
}: CreateAssignmentModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: editExercise
      ? {
          problemText: editExercise.problemText,
          language: editExercise.language,
        }
      : {
          problemText: '',
          language: DEFAULT_LANGUAGE,
        },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (editExercise) {
      reset({
        problemText: editExercise.problemText,
        language: editExercise.language,
      });
    } else {
      reset({
        problemText: '',
        language: DEFAULT_LANGUAGE,
      });
    }
    setProcessingStage(null);
  }, [editExercise, isOpen, reset]);

  const handleAutoFlow = async (problemText: string, language: Language) => {
    setProcessingStage('analyze');
    const analysisResponse = await analyzeProblem({ problemText, language });

    setProcessingStage('upload');
    let result: StudentOwnExercise;
    if (editExercise) {
      result = await studentOwnExercisesApi.update(editExercise.id, {
        problemText,
        analysis: analysisResponse.analysis,
        language,
      });
    } else {
      result = await studentOwnExercisesApi.create({
        problemText,
        analysis: analysisResponse.analysis,
        language,
      });
    }

    return result;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const language = getValues('language');

    try {
      setProcessingStage('extract');

      let imageBase64 = '';
      let mimeType = file.type;

      if (file.type === 'application/pdf') {
        imageBase64 = await convertPdfToImage(file);
        mimeType = 'image/png';
      } else {
        imageBase64 = await fileToBase64(file);
      }

      const extractResponse = await extractProblems({
        imageBase64,
        mimeType,
        language,
      });

      const problemText = extractResponse.problems.find((value) => value.trim().length > 0);
      if (!problemText) {
        throw new Error('Keine Aufgabe erkannt');
      }

      setValue('problemText', problemText, { shouldDirty: true });

      const result = await handleAutoFlow(problemText, language);

      toast.success(editExercise ? 'Aufgabe erfolgreich aktualisiert!' : 'Aufgabe erfolgreich erstellt!');
      onSuccess(result);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Verarbeiten der Datei';
      toast.error(message);
    } finally {
      setProcessingStage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await handleAutoFlow(data.problemText, data.language);
      toast.success(editExercise ? 'Aufgabe erfolgreich aktualisiert!' : 'Aufgabe erfolgreich erstellt!');
      onSuccess(result);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Verarbeiten der Aufgabe';
      toast.error(message);
    } finally {
      setProcessingStage(null);
    }
  };

  const handleClose = () => {
    reset();
    setProcessingStage(null);
    onClose();
  };

  const isProcessing = processingStage !== null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editExercise ? 'Aufgabe bearbeiten' : 'Neue Aufgabe erstellen'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Bild oder PDF hochladen</span>
            {isProcessing && (
              <span className="text-xs font-semibold text-emerald-600">{stageLabels[processingStage]}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing || isSubmitting}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isSubmitting}
            className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors disabled:opacity-60"
          >
            {isProcessing ? stageLabels[processingStage] : 'Datei auswählen'}
          </button>
          <p className="text-xs text-gray-500">PNG, JPG oder PDF</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aufgabentext *
          </label>
          <textarea
            {...register('problemText', { required: 'Aufgabentext ist erforderlich' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Beschreibe die Aufgabe..."
            disabled={isProcessing}
          />
          {errors.problemText && (
            <p className="mt-1 text-sm text-red-600">{errors.problemText.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sprache
          </label>
          <select
            {...register('language', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isProcessing}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isProcessing || isSubmitting}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isProcessing}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isProcessing ? stageLabels[processingStage] : editExercise ? 'Speichern' : 'Erstellen'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
