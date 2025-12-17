import type {
    StudentOwnExercise,
    StudentOwnExerciseCreate,
    StudentOwnExerciseUpdate,
    ImageProcessResponse,
} from "../../../types/studentOwnExercise";

const API_BASE_URL = "/haii/api/v1/student-own-exercises";

export const studentOwnExercisesApi = {
    // Get all exercises for the current user
    async list(): Promise<StudentOwnExercise[]> {
        const response = await fetch(API_BASE_URL, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch exercises");
        }
        return response.json();
    },

    // Get a specific exercise by ID
    async get(id: string): Promise<StudentOwnExercise> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch exercise");
        }
        return response.json();
    },

    // Create a new exercise
    async create(data: StudentOwnExerciseCreate): Promise<StudentOwnExercise> {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Failed to create exercise");
        }
        return response.json();
    },

    // Update an existing exercise
    async update(
        id: string,
        data: StudentOwnExerciseUpdate
    ): Promise<StudentOwnExercise> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Failed to update exercise");
        }
        return response.json();
    },

    // Delete an exercise
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to delete exercise");
        }
    },

    // Process an uploaded image (mock)
    async processImage(file: File): Promise<ImageProcessResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/process-image`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to process image");
        }
        return response.json();
    },

    // Track solving an exercise for achievements
    async solve(
        id: string,
        success: boolean
    ): Promise<{ message: string; new_achievements: string[] }> {
        const response = await fetch(`${API_BASE_URL}/${id}/solve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ success }),
        });
        if (!response.ok) {
            throw new Error("Failed to track exercise solution");
        }
        return response.json();
    },
};
