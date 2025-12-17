export type ExerciseSource = 'home_practice' | 'class_exercises' | 'own_exercises';

export interface ProgressSetRequest {
  mathWordProblemId: string;
  success: boolean;
  source?: ExerciseSource;
}

export interface ProgressPayload {
  id: string;
  mathWordProblemId: string;
  studentId: string;
  success: boolean;
}

export interface WeeklyActivityDay {
  date: string;
  dayOfWeek: string;
  isToday: boolean;
  hasActivity: boolean;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: WeeklyActivityDay[];
  activityHistory: string[];
}
