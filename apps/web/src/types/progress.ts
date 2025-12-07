export interface ProgressSetRequest {
  mathWordProblemId: string;
  success: boolean;
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
