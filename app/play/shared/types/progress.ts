// ─── Unified Playground Progress Types ───

export interface LevelStars {
  completed: boolean;
  stars: number;
  bestCommands?: number;
}

export interface GameLevelProgress {
  completedLevels: number[];
  stars: Record<string, number>;
  xp: number;
  unlockedLevel: number;
}

export interface QuizProgress {
  completedQuizzes: string[];
  bestScores: Record<string, number>;
  xp: number;
}

export interface PlaygroundProgress {
  totalXp: number;
  games: {
    'robot-maze': GameLevelProgress;
    'bug-hunter': GameLevelProgress;
    'code-quiz': QuizProgress;
    'pixel-coding': GameLevelProgress;
  };
  achievements: string[];
  tutorialsSeen: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: PlaygroundProgress) => boolean;
}

export const PLAYER_LEVELS = [
  { level: 1, minXp: 0, title: 'Pemula' },
  { level: 2, minXp: 300, title: 'Penjelajah' },
  { level: 3, minXp: 700, title: 'Programmer Muda' },
  { level: 4, minXp: 1200, title: 'Ahli Kode' },
  { level: 5, minXp: 2000, title: 'Master Coding' },
  { level: 6, minXp: 3500, title: 'Legenda' },
];

export function getPlayerLevel(xp: number) {
  let current = PLAYER_LEVELS[0];
  let next = PLAYER_LEVELS[1];
  for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= PLAYER_LEVELS[i].minXp) {
      current = PLAYER_LEVELS[i];
      next = PLAYER_LEVELS[i + 1] || null;
      break;
    }
  }
  return { current, next, xp };
}
