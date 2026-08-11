'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameProgress, LevelProgress } from '../types/game';

const STORAGE_KEY = 'nvy-robot-maze-progress';

const defaultProgress: GameProgress = {
  currentLevel: 1,
  unlockedLevel: 1,
  xp: 0,
  levels: {},
};

function loadProgress(): GameProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GameProgress;
      return { ...defaultProgress, ...parsed };
    }
  } catch {
    // Corrupted data, reset
  }
  return defaultProgress;
}

function saveProgress(progress: GameProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full or unavailable
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  const completeLevel = useCallback(
    (levelId: number, stars: number, commandsUsed: number) => {
      setProgress((prev) => {
        const levelKey = String(levelId);
        const existingLevel = prev.levels[levelKey];
        const isFirstCompletion = !existingLevel?.completed;

        // Calculate XP
        let xpGained = 0;
        if (isFirstCompletion) {
          xpGained += 100; // Base XP for first completion
          if (stars === 3) xpGained += 50; // Bonus for 3 stars
          else if (stars === 2) xpGained += 25;
        } else {
          // Replaying: only award XP if improved stars
          const prevStars = existingLevel?.stars ?? 0;
          if (stars > prevStars) {
            if (stars === 3 && prevStars < 3) xpGained += 25;
            else if (stars === 2 && prevStars < 2) xpGained += 10;
          }
        }

        const newLevelData: LevelProgress = {
          completed: true,
          stars: Math.max(stars, existingLevel?.stars ?? 0),
          bestCommands: existingLevel?.bestCommands
            ? Math.min(commandsUsed, existingLevel.bestCommands)
            : commandsUsed,
        };

        const newProgress: GameProgress = {
          ...prev,
          currentLevel: levelId,
          unlockedLevel: Math.max(prev.unlockedLevel, levelId + 1),
          xp: prev.xp + xpGained,
          levels: {
            ...prev.levels,
            [levelKey]: newLevelData,
          },
        };

        saveProgress(newProgress);
        return newProgress;
      });
    },
    []
  );

  const setCurrentLevel = useCallback((levelId: number) => {
    setProgress((prev) => {
      const newProgress = { ...prev, currentLevel: levelId };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    saveProgress(defaultProgress);
  }, []);

  return {
    progress,
    isLoaded,
    completeLevel,
    setCurrentLevel,
    resetProgress,
  };
}
