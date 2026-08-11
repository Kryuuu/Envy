'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Bug, Brain, Grid3X3, ArrowRight, Zap, Trophy, Star } from 'lucide-react';
import { usePlaygroundProgress, ACHIEVEMENTS } from './shared/hooks/usePlaygroundProgress';
import { getPlayerLevel } from './shared/types/progress';

const games = [
  { id: 'robot-maze' as const, title: 'Robot Maze', color: '#3B82F6',
    description: 'Susun perintah dan bantu robot mencapai tujuan.',
    icon: <Gamepad2 size={28} />, topics: ['Sequence', 'Algorithm', 'Loop', 'Logic'],
    href: '/play/robot-maze', totalLevels: 10 },
  { id: 'bug-hunter' as const, title: 'Bug Hunter', color: '#10B981',
    description: 'Temukan bug di dalam kode dan perbaiki kesalahannya.',
    icon: <Bug size={28} />, topics: ['Debugging', 'Logic', 'Programming'],
    href: '/play/bug-hunter', totalLevels: 12 },
  { id: 'code-quiz' as const, title: 'Code Quiz', color: '#F59E0B',
    description: 'Jawab tantangan coding dan kumpulkan XP.',
    icon: <Brain size={28} />, topics: ['Coding', 'Quiz', 'Logic'],
    href: '/play/code-quiz', totalLevels: 0 },
  { id: 'pixel-coding' as const, title: 'Pixel Coding', color: '#8B5CF6',
    description: 'Buat gambar pixel menggunakan perintah coding.',
    icon: <Grid3X3 size={28} />, topics: ['Coordinates', 'Pattern', 'Loop'],
    href: '/play/pixel-coding', totalLevels: 12 },
];

export default function PlayPage() {
  const { progress, isLoaded } = usePlaygroundProgress();
  const [showAchievements, setShowAchievements] = useState(false);
  const playerLevel = getPlayerLevel(progress.totalXp);

  const getGameProgress = (gameId: string) => {
    if (gameId === 'code-quiz') {
      const q = progress.games['code-quiz'];
      return q.completedQuizzes.length > 0 ? `${q.completedQuizzes.length} quiz selesai` : null;
    }
    const g = progress.games[gameId as 'robot-maze' | 'bug-hunter' | 'pixel-coding'];
    if (!g || g.completedLevels.length === 0) return null;
    const total = games.find(gm => gm.id === gameId)?.totalLevels || 0;
    const totalStars = Object.values(g.stars).reduce((a, b) => a + b, 0);
    return `${g.completedLevels.length}/${total} Level · ⭐ ${totalStars}`;
  };

  return (
    <div className="play-homepage">
      <div className="play-hero">
        <div className="play-hero-glow" />
        <h1 className="play-hero-title">
          <span className="play-hero-emoji">🎮</span> NVY Code Playground
        </h1>
        <p className="play-hero-tagline">Belajar Coding Sambil Bermain 🚀</p>
        <p className="play-hero-subtitle">Belajar logika, coding, dan robotika lewat permainan interaktif.</p>

        {/* Player XP & Level */}
        {isLoaded && progress.totalXp > 0 && (
          <div className="play-player-stats">
            <div className="play-player-level">
              <span className="play-level-title">{playerLevel.current.title} Lv.{playerLevel.current.level}</span>
              <div className="play-xp-bar">
                <div className="play-xp-fill" style={{width: playerLevel.next ? `${((progress.totalXp - playerLevel.current.minXp) / (playerLevel.next.minXp - playerLevel.current.minXp)) * 100}%` : '100%'}} />
              </div>
              <span className="play-xp-text"><Zap size={14} /> {progress.totalXp} XP{playerLevel.next ? ` / ${playerLevel.next.minXp}` : ''}</span>
            </div>
            <button onClick={() => setShowAchievements(true)} className="play-achievements-btn">
              <Trophy size={16} /><span>Pencapaian ({progress.achievements.length})</span>
            </button>
          </div>
        )}
      </div>

      <div className="play-games-grid">
        {games.map((game) => {
          const prog = getGameProgress(game.id);
          return (
            <div key={game.id} className="play-game-card">
              <div className="game-card-icon" style={{ background: `${game.color}15`, color: game.color }}>{game.icon}</div>
              <div className="game-card-content">
                <div className="game-card-header">
                  <h2 className="game-card-title">{game.title}</h2>
                  <span className="game-status-badge available-badge">✨ Available</span>
                </div>
                <p className="game-card-desc">{game.description}</p>
                {prog && <p className="game-card-progress">{prog}</p>}
                <div className="game-card-topics">
                  {game.topics.map((t) => (<span key={t} className="game-topic-tag">{t}</span>))}
                </div>
                <Link href={game.href} className="game-card-btn"><span>Mulai Bermain</span><ArrowRight size={16} /></Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* MULTIPLAYER SECTION */}
      <div className="play-multiplayer-section" style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
        <h2 className="game-card-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          🏫 Kelas & Multiplayer
        </h2>
        <p className="game-card-desc" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Main dan belajar coding bersama teman sekelas atau pengajar!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/play/create-room" className="action-btn action-run" style={{ padding: '0.8rem 1.5rem', minWidth: '160px' }}>
            Buat Room
          </Link>
          <Link href="/play/join" className="action-btn action-reset" style={{ padding: '0.8rem 1.5rem', minWidth: '160px', background: 'rgba(255,255,255,0.05)' }}>
            Gabung Room
          </Link>
        </div>
      </div>

      <div className="play-footer">
        <Link href="/" className="play-back-link">← Kembali ke Portfolio</Link>
      </div>

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="level-selector-overlay" onClick={() => setShowAchievements(false)}>
          <div className="level-selector-modal" onClick={e => e.stopPropagation()}>
            <h2 className="level-selector-title">🏆 Pencapaian</h2>
            <div className="ach-list">
              {ACHIEVEMENTS.map(ach => {
                const earned = progress.achievements.includes(ach.id);
                return (
                  <div key={ach.id} className={`ach-item ${earned ? 'earned' : 'locked'}`}>
                    <span className="ach-icon">{ach.icon}</span>
                    <div className="ach-info">
                      <span className="ach-title">{ach.title}</span>
                      <span className="ach-desc">{ach.description}</span>
                    </div>
                    {earned && <Star size={16} fill="#FBBF24" className="star-filled" />}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowAchievements(false)} className="level-selector-close">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
