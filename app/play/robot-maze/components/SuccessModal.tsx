'use client';

import { Star, Zap, ArrowRight, RotateCcw } from 'lucide-react';

interface SuccessModalProps {
  stars: number;
  xpGained: number;
  levelId: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
}

export default function SuccessModal({
  stars,
  xpGained,
  levelId,
  hasNextLevel,
  onNextLevel,
  onReplay,
}: SuccessModalProps) {
  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-confetti">
          {['🎉', '⭐', '🎊', '🌟', '✨', '🏆'].map((emoji, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${10 + i * 15}%`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <h2 className="success-title">🎉 Level Selesai!</h2>
        <p className="success-subtitle">
          Hebat! Kamu berhasil membantu robot mencapai tujuan.
        </p>

        <div className="success-stars">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={40}
              className={`success-star ${s <= stars ? 'star-earned' : 'star-empty'}`}
              fill={s <= stars ? '#FBBF24' : 'none'}
              stroke={s <= stars ? '#FBBF24' : '#4B5563'}
              style={{ animationDelay: `${0.3 + s * 0.15}s` }}
            />
          ))}
        </div>

        <div className="success-xp">
          <Zap size={20} className="xp-icon" />
          <span>+{xpGained} XP</span>
        </div>

        <div className="success-actions">
          {hasNextLevel && (
            <button onClick={onNextLevel} className="action-btn action-run success-next">
              <span>Level Berikutnya</span>
              <ArrowRight size={18} />
            </button>
          )}
          <button onClick={onReplay} className="action-btn action-reset">
            <RotateCcw size={18} />
            <span>Main Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
