'use client';

import { Star, Lock } from 'lucide-react';
import { GameProgress } from '../types/game';
import { levels } from '../data/levels';

interface LevelSelectorProps {
  progress: GameProgress;
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export default function LevelSelector({
  progress,
  currentLevel,
  onSelectLevel,
  onClose,
}: LevelSelectorProps) {
  return (
    <div className="level-selector-overlay" onClick={onClose}>
      <div className="level-selector-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="level-selector-title">🗺️ Pilih Level</h2>
        <div className="level-grid">
          {levels.map((level) => {
            const isUnlocked = level.id <= progress.unlockedLevel;
            const levelProgress = progress.levels[String(level.id)];
            const isCurrent = level.id === currentLevel;

            return (
              <button
                key={level.id}
                className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                disabled={!isUnlocked}
                aria-label={`Level ${level.id}: ${level.name}${!isUnlocked ? ' (terkunci)' : ''}`}
              >
                <div className="level-card-number">
                  {isUnlocked ? level.id : <Lock size={16} />}
                </div>
                <div className="level-card-name">{level.name}</div>
                {levelProgress?.completed && (
                  <div className="level-card-stars">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= levelProgress.stars ? 'star-filled' : 'star-empty'}
                        fill={s <= levelProgress.stars ? '#FBBF24' : 'none'}
                      />
                    ))}
                  </div>
                )}
                {!isUnlocked && <div className="level-card-locked">🔒</div>}
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="level-selector-close">
          Tutup
        </button>
      </div>
    </div>
  );
}
