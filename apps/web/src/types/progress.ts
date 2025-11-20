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
