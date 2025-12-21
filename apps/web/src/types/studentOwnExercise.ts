import type { DifficultyLevel, Language, MathProblemAnalysis } from './problem';

export interface StudentOwnExercise {
  id: string;
  userId: string;
  problemText: string;
  analysis: MathProblemAnalysis;
  language: Language;
  difficultyLevel: DifficultyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface StudentOwnExerciseCreate {
  problemText: string;
  analysis: MathProblemAnalysis;
  language: Language;
}

export interface StudentOwnExerciseUpdate {
  problemText?: string | null;
  analysis?: MathProblemAnalysis | null;
  language?: Language | null;
}
