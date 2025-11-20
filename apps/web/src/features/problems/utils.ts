import type { MathematicalOperation } from '../../types/problem';

export const ALLOWED_OPERATIONS: MathematicalOperation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
];

const OPERATION_LABELS: Record<MathematicalOperation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraktion',
  multiplication: 'Multiplikation',
  division: 'Division',
};

export const mapOperations = (ops: string[]): MathematicalOperation[] =>
  ops.filter((op): op is MathematicalOperation =>
    ALLOWED_OPERATIONS.includes(op as MathematicalOperation),
  );

export const formatOperation = (op: MathematicalOperation) => OPERATION_LABELS[op];

export const clampDifficulty = (difficulty: number) => Math.min(5, Math.max(1, difficulty));

export const getDifficultyMeta = (difficulty: number) => {
  const value = clampDifficulty(difficulty);
  if (value < 1.8) return { value, label: 'Sehr leicht', tone: 'green' as const };
  if (value < 2.6) return { value, label: 'Leicht', tone: 'green' as const };
  if (value < 3.4) return { value, label: 'Mittel', tone: 'amber' as const };
  if (value < 4.3) return { value, label: 'Knifflig', tone: 'orange' as const };
  return { value, label: 'Sehr knifflig', tone: 'rose' as const };
};
