export interface StudentOwnExercise {
    id: string;
    userId: string;
    problem: string;
    difficulty: string;
    answer: number;
    grade: string | null;
    questionType: string | null;
    metric: string | null;
    steps: string | null;
    imagePath: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface StudentOwnExerciseCreate {
    problem: string;
    difficulty: string;
    answer: number;
    grade?: string;
    questionType?: string;
    metric?: string;
    steps?: string;
    imagePath?: string;
}

export interface StudentOwnExerciseUpdate {
    problem?: string;
    difficulty?: string;
    answer?: number;
    grade?: string;
    questionType?: string;
    metric?: string;
    steps?: string;
    imagePath?: string;
}

export interface ImageProcessResponse {
    problem: string;
    difficulty: string;
    grade: string;
    questionType: string;
    answer: number;
    metric: string;
    steps: string;
}
