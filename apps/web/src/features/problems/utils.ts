import type { DifficultyLevel, MathOperationSymbol } from '../../types/problem';

type OperationMeta = {
  key: 'addition' | 'subtraction' | 'multiplication' | 'division';
  label: string;
  icon: string;
  gradient: string;
};

const OPERATION_META: Record<MathOperationSymbol, OperationMeta> = {
  '+': {
    key: 'addition',
    label: 'Addition',
    icon: '➕',
    gradient: 'from-orange-50 to-amber-50 border-orange-100',
  },
  '-': {
    key: 'subtraction',
    label: 'Subtraktion',
    icon: '➖',
    gradient: 'from-orange-50 to-amber-50 border-orange-100',
  },
  '×': {
    key: 'multiplication',
    label: 'Multiplikation',
    icon: '✖️',
    gradient: 'from-blue-50 to-indigo-50 border-blue-100',
  },
  '÷': {
    key: 'division',
    label: 'Division',
    icon: '➗',
    gradient: 'from-blue-50 to-indigo-50 border-blue-100',
  },
};

export const getOperationMeta = (operation?: MathOperationSymbol | null) =>
  (operation ? OPERATION_META[operation] : undefined) ?? null;

export const formatOperation = (operation: MathOperationSymbol) =>
  OPERATION_META[operation]?.label ?? operation;

const DIFFICULTY_META: Record<
  DifficultyLevel,
  { value: number; label: string; tone: 'green' | 'amber' | 'rose' }
> = {
  easy: { value: 1, label: 'Einfach', tone: 'green' },
  medium: { value: 2, label: 'Mittel', tone: 'amber' },
  hard: { value: 3, label: 'Schwierig', tone: 'rose' },
};

export const getDifficultyMeta = (difficulty?: DifficultyLevel | null) =>
  (difficulty ? DIFFICULTY_META[difficulty] : null) ?? DIFFICULTY_META.medium;
