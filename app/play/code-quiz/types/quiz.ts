export type QuizDifficulty = 'pemula' | 'menengah' | 'tantangan';
export interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctOption: number;
  explanation: string;
  difficulty: QuizDifficulty;
  category: string;
}
