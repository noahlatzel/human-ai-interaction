export type Language = 'en' | 'de';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type MathOperationSymbol = '+' | '-' | '×' | '÷';

export type SemanticStructure = 'change' | 'combine' | 'compare' | 'equalize';

export type UnknownPosition = 'result' | 'change' | 'start';

export type RelationshipType = 'part-whole' | 'comparison' | 'equal-groups';

export type AnalyzedWordType = 'number' | 'keyword' | 'object' | 'operation' | 'normal';

export interface AnalyzedWord {
  text: string;
  type: AnalyzedWordType;
  value?: number | null;
  explanation?: string | null;
}

export interface Calculation {
  parts: Array<number | string>;
}

export interface MathProblemAnalysis {
  words: AnalyzedWord[];
  suggestion: string;
  visualCue: string;
  emojiMap?: Record<string, string> | null;
  steps: string[];
  finalAnswer: number;
  calculation: Calculation;
  operations: MathOperationSymbol[];
  semanticStructure: SemanticStructure;
  unknownPosition: UnknownPosition;
  numberOfOperations: number;
  hasIrrelevantInfo: boolean;
  irrelevantData?: string[] | null;
  relationshipType: RelationshipType;
  difficultyLevel: DifficultyLevel;
  cognitiveLoad: number;
}

export interface MathWordProblem {
  id: string;
  problemText: string;
  analysis: MathProblemAnalysis;
  grade: number;
  language: Language;
  difficultyLevel: DifficultyLevel;
}

export interface MathWordProblemListResponse {
  problems: MathWordProblem[];
}

export interface MathWordProblemCreate {
  problemText: string;
  analysis: MathProblemAnalysis;
  grade: number;
  language: Language;
}

export interface AnalyzeProblemRequest {
  problemText: string;
  language?: Language;
}

export interface AnalyzeProblemResponse {
  analysis: MathProblemAnalysis;
}

export interface ExtractProblemsRequest {
  imageBase64: string;
  mimeType: string;
  language?: Language;
}

export interface ExtractProblemsResponse {
  problems: string[];
}
