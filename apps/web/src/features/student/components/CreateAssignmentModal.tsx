import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "./Modal";
import { studentOwnExercisesApi } from "../api/studentOwnExercises";
import type {
    StudentOwnExercise,
    StudentOwnExerciseCreate,
} from "../../../types/studentOwnExercise";

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (exercise: StudentOwnExercise) => void;
    editExercise?: StudentOwnExercise | null;
}

interface FormData {
    problem: string;
    difficulty: string;
    answer: number;
    grade: string;
    questionType: string;
    metric: string;
    steps: string;
}

export const CreateAssignmentModal = ({
    isOpen,
    onClose,
    onSuccess,
    editExercise,
}: CreateAssignmentModalProps) => {
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
        editExercise?.imagePath || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: editExercise
            ? {
                problem: editExercise.problem,
                difficulty: editExercise.difficulty,
                answer: editExercise.answer,
                grade: editExercise.grade || "",
                questionType: editExercise.questionType || "",
                metric: editExercise.metric || "",
                steps: editExercise.steps || "",
            }
            : {
                problem: "",
                difficulty: "leicht",
                answer: 0,
                grade: "",
                questionType: "",
                metric: "",
                steps: "",
            },
    });

    // Reset form when modal opens or editExercise changes
    useEffect(() => {
        if (isOpen) {
            if (editExercise) {
                reset({
                    problem: editExercise.problem,
                    difficulty: editExercise.difficulty,
                    answer: editExercise.answer,
                    grade: editExercise.grade || "",
                    questionType: editExercise.questionType || "",
                    metric: editExercise.metric || "",
                    steps: editExercise.steps || "",
                });
                setUploadedImagePath(editExercise.imagePath || null);
            } else {
                reset({
                    problem: "",
                    difficulty: "leicht",
                    answer: 0,
                    grade: "",
                    questionType: "",
                    metric: "",
                    steps: "",
                });
                setUploadedImagePath(null);
            }
        }
    }, [isOpen, editExercise, reset]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Bitte wähle eine Bilddatei aus");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Bild ist zu groß. Maximale Größe: 5MB");
            return;
        }

        setIsProcessingImage(true);
        try {
            const response = await studentOwnExercisesApi.processImage(file);

            // Autofill form fields with extracted data
            setValue("problem", response.problem);
            setValue("difficulty", response.difficulty);
            setValue("answer", response.answer);
            setValue("grade", response.grade);
            setValue("questionType", response.questionType);
            setValue("metric", response.metric);
            setValue("steps", response.steps);

            // Store image path (in production, this would come from upload response)
            setUploadedImagePath(`/uploads/${file.name}`);

            toast.success("Bild erfolgreich verarbeitet!");
        } catch {
            toast.error("Fehler beim Verarbeiten des Bildes");
        } finally {
            setIsProcessingImage(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const exerciseData: StudentOwnExerciseCreate = {
                problem: data.problem,
                difficulty: data.difficulty,
                answer: data.answer,
                grade: data.grade || undefined,
                questionType: data.questionType || undefined,
                metric: data.metric || undefined,
                steps: data.steps || undefined,
                imagePath: uploadedImagePath || undefined,
            };

            let result: StudentOwnExercise;
            if (editExercise) {
                result = await studentOwnExercisesApi.update(
                    editExercise.id,
                    exerciseData
                );
                toast.success("Aufgabe erfolgreich aktualisiert!");
            } else {
                result = await studentOwnExercisesApi.create(exerciseData);
                toast.success("Aufgabe erfolgreich erstellt!");
            }

            onSuccess(result);
            reset();
            setUploadedImagePath(null);
            onClose();
        } catch {
            toast.error(
                editExercise
                    ? "Fehler beim Aktualisieren der Aufgabe"
                    : "Fehler beim Erstellen der Aufgabe"
            );
        }
    };

    const handleClose = () => {
        reset();
        setUploadedImagePath(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editExercise ? "Aufgabe bearbeiten" : "Neue Aufgabe erstellen"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isProcessingImage}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingImage}
                        className="w-full flex flex-col items-center gap-2"
                    >
                        {isProcessingImage ? (
                            <>
                                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                                <span className="text-sm text-gray-600">
                                    Bild wird verarbeitet...
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Bild hochladen und automatisch ausfüllen
                                </span>
                                <span className="text-xs text-gray-500">
                                    PNG, JPG bis 5MB
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Problem Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aufgabentext *
                    </label>
                    <textarea
                        {...register("problem", { required: "Aufgabentext ist erforderlich" })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Beschreibe die Aufgabe..."
                    />
                    {errors.problem && (
                        <p className="mt-1 text-sm text-red-600">{errors.problem.message}</p>
                    )}
                </div>

                {/* Difficulty & Answer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schwierigkeitsgrad *
                        </label>
                        <select
                            {...register("difficulty", { required: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="leicht">Leicht</option>
                            <option value="mittel">Mittel</option>
                            <option value="schwer">Schwer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Antwort *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("answer", {
                                required: "Antwort ist erforderlich",
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="z.B. 42"
                        />
                        {errors.answer && (
                            <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
                        )}
                    </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Klassenstufe
                        </label>
                        <input
                            type="text"
                            {...register("grade")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="z.B. 3. Klasse"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aufgabentyp
                        </label>
                        <input
                            type="text"
                            {...register("questionType")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="z.B. Addition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maßeinheit
                    </label>
                    <input
                        type="text"
                        {...register("metric")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="z.B. Äpfel, Euro, Meter"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lösungsschritte
                    </label>
                    <textarea
                        {...register("steps")}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="1. Schritt...&#10;2. Schritt...&#10;3. Schritt..."
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isProcessingImage}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editExercise ? "Speichern" : "Erstellen"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
