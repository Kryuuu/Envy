export type BugChallengeType = 'find-line' | 'fill-blank' | 'fix-output' | 'reorder';

export interface BugLevel {
  id: number;
  name: string;
  description: string;
  type: BugChallengeType;
  code: string[];
  bugLineIndex?: number;
  blankLineIndex?: number;
  blankPlaceholder?: string;
  targetOutput?: string;
  question: string;
  options: string[];
  correctOption: number;
  correctOrder?: number[];
  hints: string[];
  explanation: string;
  optimalAttempts: number;
  tutorial?: { title: string; content: string };
}
