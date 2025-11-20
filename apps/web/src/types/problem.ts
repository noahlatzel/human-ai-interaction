export type MathematicalOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface MathWordProblem {
  id: string;
  problemDescription: string;
  solution: string;
  difficulty: number;
  operations: MathematicalOperation[];
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
  difficulty: number;
  operations: MathematicalOperation[];
}
