'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlaygroundProgress, Achievement } from '../types/progress';

const UNIFIED_KEY = 'nvy-code-playground-progress';
const LEGACY_ROBOT_KEY = 'nvy-robot-maze-progress';

const defaultProgress: PlaygroundProgress = {
  totalXp: 0,
  games: {
    'robot-maze': { completedLevels: [], stars: {}, xp: 0, unlockedLevel: 1 },
    'bug-hunter': { completedLevels: [], stars: {}, xp: 0, unlockedLevel: 1 },
    'code-quiz': { completedQuizzes: [], bestScores: {}, xp: 0 },
    'pixel-coding': { completedLevels: [], stars: {}, xp: 0, unlockedLevel: 1 },
  },
  achievements: [],
  tutorialsSeen: [],
};

function migrateLegacyRobotMaze(): Partial<PlaygroundProgress> | null {
  if (typeof window === 'undefined') return null;
  try {
    const legacy = localStorage.getItem(LEGACY_ROBOT_KEY);
    if (!legacy) return null;
    const data = JSON.parse(legacy);
    const completedLevels: number[] = [];
    const stars: Record<string, number> = {};
    if (data.levels) {
      for (const [k, v] of Object.entries(data.levels)) {
        const lv = v as { completed?: boolean; stars?: number };
        if (lv.completed) completedLevels.push(Number(k));
        if (lv.stars) stars[k] = lv.stars;
      }
    }
    return {
      totalXp: data.xp || 0,
      games: {
        ...defaultProgress.games,
        'robot-maze': {
          completedLevels,
          stars,
          xp: data.xp || 0,
          unlockedLevel: data.unlockedLevel || 1,
        },
      },
    };
  } catch { return null; }
}

function loadProgress(): PlaygroundProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(UNIFIED_KEY);
    if (stored) return { ...defaultProgress, ...JSON.parse(stored) };
    const migrated = migrateLegacyRobotMaze();
    if (migrated) {
      const prog = { ...defaultProgress, ...migrated };
      localStorage.setItem(UNIFIED_KEY, JSON.stringify(prog));
      return prog;
    }
  } catch { /* corrupted */ }
  return defaultProgress;
}

function saveProgress(progress: PlaygroundProgress): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(UNIFIED_KEY, JSON.stringify(progress)); } catch { /* full */ }
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', title: 'Langkah Pertama', description: 'Selesaikan level pertama di game manapun.', icon: '🏅',
    condition: (p) => Object.values(p.games).some((g) => 'completedLevels' in g && g.completedLevels.length > 0) },
  { id: 'bug-hunter-5', title: 'Pemburu Bug', description: 'Selesaikan 5 level Bug Hunter.', icon: '🐛',
    condition: (p) => p.games['bug-hunter'].completedLevels.length >= 5 },
  { id: 'quiz-brain', title: 'Otak Coding', description: 'Selesaikan 3 quiz.', icon: '🧠',
    condition: (p) => p.games['code-quiz'].completedQuizzes.length >= 3 },
  { id: 'pixel-artist', title: 'Pixel Artist', description: 'Selesaikan 5 level Pixel Coding.', icon: '🎨',
    condition: (p) => p.games['pixel-coding'].completedLevels.length >= 5 },
  { id: 'robot-master', title: 'Robot Master', description: 'Selesaikan semua level Robot Maze.', icon: '🤖',
    condition: (p) => p.games['robot-maze'].completedLevels.length >= 10 },
  { id: 'explorer', title: 'Code Explorer', description: 'Mainkan semua 4 game.', icon: '🌟',
    condition: (p) => {
      const rm = p.games['robot-maze'].completedLevels.length > 0;
      const bh = p.games['bug-hunter'].completedLevels.length > 0;
      const cq = p.games['code-quiz'].completedQuizzes.length > 0;
      const pc = p.games['pixel-coding'].completedLevels.length > 0;
      return rm && bh && cq && pc;
    }},
];

export function usePlaygroundProgress() {
  const [progress, setProgress] = useState<PlaygroundProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => { setProgress(loadProgress()); setIsLoaded(true); }, []);

  const checkAchievements = useCallback((prog: PlaygroundProgress): PlaygroundProgress => {
    let updated = prog;
    for (const ach of ACHIEVEMENTS) {
      if (!prog.achievements.includes(ach.id) && ach.condition(prog)) {
        updated = { ...updated, achievements: [...updated.achievements, ach.id] };
        setNewAchievement(ach);
        setTimeout(() => setNewAchievement(null), 3000);
      }
    }
    return updated;
  }, []);

  const updateGameProgress = useCallback((
    gameId: 'robot-maze' | 'bug-hunter' | 'pixel-coding',
    levelId: number, stars: number, xpGained: number
  ) => {
    setProgress((prev) => {
      const game = prev.games[gameId];
      const completedLevels = game.completedLevels.includes(levelId) ? game.completedLevels : [...game.completedLevels, levelId];
      const newStars = { ...game.stars, [String(levelId)]: Math.max(stars, game.stars[String(levelId)] || 0) };
      const newUnlocked = Math.max(game.unlockedLevel, levelId + 1);
      const updated: PlaygroundProgress = {
        ...prev,
        totalXp: prev.totalXp + xpGained,
        games: { ...prev.games, [gameId]: { ...game, completedLevels, stars: newStars, xp: game.xp + xpGained, unlockedLevel: newUnlocked } },
      };
      const withAch = checkAchievements(updated);
      saveProgress(withAch);
      return withAch;
    });
  }, [checkAchievements]);

  const updateQuizProgress = useCallback((quizId: string, score: number, xpGained: number) => {
    setProgress((prev) => {
      const quiz = prev.games['code-quiz'];
      const completedQuizzes = quiz.completedQuizzes.includes(quizId) ? quiz.completedQuizzes : [...quiz.completedQuizzes, quizId];
      const bestScores = { ...quiz.bestScores, [quizId]: Math.max(score, quiz.bestScores[quizId] || 0) };
      const updated: PlaygroundProgress = {
        ...prev,
        totalXp: prev.totalXp + xpGained,
        games: { ...prev.games, 'code-quiz': { ...quiz, completedQuizzes, bestScores, xp: quiz.xp + xpGained } },
      };
      const withAch = checkAchievements(updated);
      saveProgress(withAch);
      return withAch;
    });
  }, [checkAchievements]);

  const markTutorialSeen = useCallback((gameId: string) => {
    setProgress((prev) => {
      if (prev.tutorialsSeen.includes(gameId)) return prev;
      const updated = { ...prev, tutorialsSeen: [...prev.tutorialsSeen, gameId] };
      saveProgress(updated);
      return updated;
    });
  }, []);

  return { progress, isLoaded, updateGameProgress, updateQuizProgress, markTutorialSeen, newAchievement, dismissAchievement: () => setNewAchievement(null) };
}
