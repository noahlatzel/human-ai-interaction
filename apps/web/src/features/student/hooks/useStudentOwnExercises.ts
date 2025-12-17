import { useState, useEffect } from "react";
import { studentOwnExercisesApi } from "../api/studentOwnExercises";
import type {
    StudentOwnExercise,
    StudentOwnExerciseCreate,
    StudentOwnExerciseUpdate,
} from "../../../types/studentOwnExercise";

export const useStudentOwnExercises = () => {
    const [exercises, setExercises] = useState<StudentOwnExercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadExercises = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await studentOwnExercisesApi.list();
            setExercises(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load exercises");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExercises();
    }, []);

    const createExercise = async (
        data: StudentOwnExerciseCreate
    ): Promise<StudentOwnExercise> => {
        setIsLoading(true);
        setError(null);
        try {
            const newExercise = await studentOwnExercisesApi.create(data);
            setExercises((prev) => [newExercise, ...prev]);
            return newExercise;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create exercise"
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateExercise = async (
        id: string,
        data: StudentOwnExerciseUpdate
    ): Promise<StudentOwnExercise> => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedExercise = await studentOwnExercisesApi.update(id, data);
            setExercises((prev) =>
                prev.map((ex) => (ex.id === id ? updatedExercise : ex))
            );
            return updatedExercise;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update exercise"
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteExercise = async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await studentOwnExercisesApi.delete(id);
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete exercise"
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const addExerciseToState = (exercise: StudentOwnExercise) => {
        setExercises((prev) => [exercise, ...prev]);
    };

    const updateExerciseInState = (exercise: StudentOwnExercise) => {
        setExercises((prev) =>
            prev.map((ex) => (ex.id === exercise.id ? exercise : ex))
        );
    };

    return {
        exercises,
        isLoading,
        error,
        loadExercises,
        createExercise,
        updateExercise,
        deleteExercise,
        addExerciseToState,
        updateExerciseInState,
    };
};
