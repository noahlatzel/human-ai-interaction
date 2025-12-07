export type MathematicalOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type DifficultyLevel = 'einfach' | 'mittel' | 'schwierig';

export interface MathWordProblem {
  id: string;
  problemDescription: string;
  solution: string;
  grade: number;
  difficulty: DifficultyLevel;
  operations: MathematicalOperation[];
  hints: (string | null)[];
}

export interface MathWordProblemWithMeta extends MathWordProblem {
  difficultyLabel: string;
  difficultyValue: number;
}

export interface MathWordProblemListResponse {
  problems: MathWordProblem[];
}

export interface MathWordProblemCreate {
  problemDescription: string;
  solution: string;
  grade: number;
  difficulty: DifficultyLevel;
  operations: MathematicalOperation[];
  hints: (string | null)[];
}
