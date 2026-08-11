'use client';

import { ArrowLeft, Star, Zap } from 'lucide-react';
import Link from 'next/link';

interface GameHeaderProps {
  levelId: number;
  levelName: string;
  totalXP: number;
  onShowLevelSelect: () => void;
}

export default function GameHeader({
  levelId,
  levelName,
  totalXP,
  onShowLevelSelect,
}: GameHeaderProps) {
  return (
    <header className="game-header">
      <div className="game-header-left">
        <Link href="/play" className="back-link" aria-label="Kembali ke Playground">
          <ArrowLeft size={18} />
          <span>Playground</span>
        </Link>
        <div className="level-info">
          <button onClick={onShowLevelSelect} className="level-badge" aria-label="Pilih level">
            Level {levelId}
          </button>
          <span className="level-name">{levelName}</span>
        </div>
      </div>
      <div className="game-header-right">
        <div className="xp-display" aria-label={`Total XP: ${totalXP}`}>
          <Zap size={16} className="xp-icon" />
          <span>{totalXP} XP</span>
        </div>
      </div>
    </header>
  );
}
