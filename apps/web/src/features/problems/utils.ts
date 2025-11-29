import type { DifficultyLevel, MathematicalOperation } from '../../types/problem';

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

const DIFFICULTY_META: Record<
  DifficultyLevel,
  { value: number; label: string; tone: 'green' | 'amber' | 'rose' }
> = {
  einfach: { value: 1, label: 'Einfach', tone: 'green' },
  mittel: { value: 2, label: 'Mittel', tone: 'amber' },
  schwierig: { value: 3, label: 'Schwierig', tone: 'rose' },
};

export const getDifficultyMeta = (difficulty: DifficultyLevel) =>
  DIFFICULTY_META[difficulty] ?? DIFFICULTY_META.mittel;
