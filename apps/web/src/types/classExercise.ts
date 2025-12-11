import type { MathWordProblem } from './problem';

export type ExerciseStatus = 'open' | 'locked' | 'completed';
export type ExerciseType = 'homework' | 'classroom';

export interface ClassExercise {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  topic: string;
  description?: string;
  scheduledAt: string;
  status: ExerciseStatus;
  exerciseType: ExerciseType;
  createdAt: string;
  updatedAt: string;
  problems: MathWordProblem[];
}

export interface CreateClassExerciseRequest {
  classId: string;
  title: string;
  topic: string;
  description?: string;
  scheduledAt: string; // ISO string
  problemIds: string[];
  exerciseType?: ExerciseType;
}

export interface UpdateClassExerciseRequest {
  title?: string;
  topic?: string;
  description?: string;
  scheduledAt?: string;
  status?: ExerciseStatus;
  problemIds?: string[];
  exerciseType?: ExerciseType;
}
