'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Star, Lock, Lightbulb, X, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { bugLevels } from './data/levels';
import { BugLevel } from './types/bug';
import { usePlaygroundProgress } from '../shared/hooks/usePlaygroundProgress';

export default function BugHunterPage() {
  const { progress, isLoaded, updateGameProgress, markTutorialSeen } = usePlaygroundProgress();
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [successData, setSuccessData] = useState({ stars: 0, xp: 0 });

  const level = bugLevels[levelIndex];
  const gameProgress = progress.games['bug-hunter'];

  useEffect(() => {
    if (isLoaded && level.tutorial && !progress.tutorialsSeen.includes('bug-hunter')) {
      setShowTutorial(true);
    }
  }, [isLoaded, level.tutorial, progress.tutorialsSeen]);

  const calcStars = (att: number, hints: number) => {
    if (att <= 1 && hints === 0) return 3;
    if (att <= 2 && hints <= 1) return 2;
    return 1;
  };

  const handleSubmit = useCallback(() => {
    if (selectedOption === null) return;
    const correct = selectedOption === level.correctOption;
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts(a => a + 1);
    if (correct) {
      const stars = calcStars(attempts + 1, hintsUsed);
      const isFirst = !gameProgress.completedLevels.includes(level.id);
      let xp = 0;
      if (isFirst) { xp = 100; if (stars === 3) xp += 50; else if (stars === 2) xp += 25; }
      updateGameProgress('bug-hunter', level.id, stars, xp);
      setSuccessData({ stars, xp });
      setTimeout(() => setShowSuccess(true), 800);
    }
  }, [selectedOption, level, attempts, hintsUsed, gameProgress, updateGameProgress]);

  const handleNext = () => {
    if (levelIndex < bugLevels.length - 1) {
      setLevelIndex(levelIndex + 1);
      resetState();
    }
  };

  const handleReplay = () => { resetState(); setShowSuccess(false); };

  const resetState = () => {
    setSelectedOption(null); setShowResult(false); setIsCorrect(false);
    setAttempts(0); setHintsUsed(0); setShowHint(false); setCurrentHintIndex(0);
    setShowSuccess(false);
  };

  const handleSelectLevel = (id: number) => {
    const idx = bugLevels.findIndex(l => l.id === id);
    if (idx >= 0) { setLevelIndex(idx); resetState(); setShowLevelSelect(false); }
  };

  const handleHint = () => {
    if (currentHintIndex < level.hints.length) {
      setShowHint(true);
      if (!showHint) setHintsUsed(h => h + 1);
    }
  };

  const nextHint = () => {
    if (currentHintIndex < level.hints.length - 1) {
      setCurrentHintIndex(i => i + 1);
      setHintsUsed(h => h + 1);
    }
  };

  if (!isLoaded) return <div className="play-loading"><div className="play-spinner" /><p>Memuat game...</p></div>;

  return (
    <div className="bh-page">
      {/* Header */}
      <header className="game-header">
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Playground</span></Link>
          <div className="level-info">
            <button onClick={() => setShowLevelSelect(true)} className="level-badge" style={{background:'linear-gradient(135deg,#10B981,#059669)'}}>Level {level.id}</button>
            <span className="level-name">{level.name}</span>
          </div>
        </div>
        <div className="game-header-right">
          <div className="xp-display"><Zap size={16} className="xp-icon" /><span>{progress.totalXp} XP</span></div>
        </div>
      </header>

      <div className="game-layout">
        <div className="game-left">
          {/* Code Viewer */}
          <div className="bh-code-section">
            <div className="bh-code-header"><span>🐛 Temukan bug di kode ini!</span></div>
            <div className="bh-code-block">
              {level.code.map((line, i) => (
                <div key={i} className={`bh-code-line ${level.bugLineIndex === i ? 'bug-line' : ''} ${showResult && isCorrect && level.bugLineIndex === i ? 'fixed-line' : ''}`}>
                  <span className="bh-line-num">{i + 1}</span>
                  <code>{level.blankLineIndex === i ? line.replace(level.blankPlaceholder || '___', showResult && isCorrect ? level.options[level.correctOption] : level.blankPlaceholder || '___') : line}</code>
                </div>
              ))}
            </div>
            {level.description && <p className="bh-question-text">🎯 {level.question}</p>}
          </div>

          {/* Tutorial */}
          {level.tutorial && (
            <div className="tutorial-card">
              <h4 className="tutorial-title">{level.tutorial.title}</h4>
              <p className="tutorial-content">{level.tutorial.content}</p>
            </div>
          )}
        </div>

        <div className="game-right">
          {/* Options */}
          <div className="bh-options-section">
            <h3 className="commands-title">📝 Pilih jawaban</h3>
            <div className="bh-options">
              {level.options.map((opt, i) => (
                <button key={i} disabled={showResult && isCorrect}
                  className={`bh-option ${selectedOption === i ? 'selected' : ''} ${showResult && i === level.correctOption ? 'correct' : ''} ${showResult && selectedOption === i && !isCorrect ? 'wrong' : ''}`}
                  onClick={() => { setSelectedOption(i); setShowResult(false); }}>
                  <span className="bh-option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="bh-option-text">{opt}</span>
                  {showResult && i === level.correctOption && <Check size={16} className="bh-check" />}
                </button>
              ))}
            </div>

            {/* Result feedback */}
            {showResult && (
              <div className={`bh-feedback ${isCorrect ? 'bh-correct' : 'bh-wrong'}`}>
                {isCorrect ? <><p className="bh-feedback-title">🐛 Bug ditemukan!</p><p>{level.explanation}</p></>
                  : <><p className="bh-feedback-title">Belum tepat.</p><p>Coba periksa lagi kode tersebut.</p></>}
              </div>
            )}

            {/* Actions */}
            <div className="cmd-action-buttons" style={{marginTop:'0.75rem'}}>
              <button onClick={handleSubmit} disabled={selectedOption === null || (showResult && isCorrect)} className="action-btn action-run">
                <Check size={18} /><span>Periksa</span>
              </button>
              <button onClick={handleHint} disabled={hintsUsed >= level.hints.length} className="action-btn action-reset">
                <Lightbulb size={18} /><span>Petunjuk</span>
              </button>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="tutorial-card" style={{marginTop:'0.5rem'}}>
                <div className="tutorial-header">
                  <h4 className="tutorial-title">💡 Petunjuk {currentHintIndex + 1}/{level.hints.length}</h4>
                  <button className="tutorial-close" onClick={() => setShowHint(false)}><X size={14} /></button>
                </div>
                <p className="tutorial-content">{level.hints[currentHintIndex]}</p>
                {currentHintIndex < level.hints.length - 1 && (
                  <button onClick={nextHint} className="bh-next-hint">Petunjuk berikutnya →</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Selector */}
      {showLevelSelect && (
        <div className="level-selector-overlay" onClick={() => setShowLevelSelect(false)}>
          <div className="level-selector-modal" onClick={e => e.stopPropagation()}>
            <h2 className="level-selector-title">🐛 Pilih Level</h2>
            <div className="level-grid">
              {bugLevels.map(lv => {
                const unlocked = lv.id <= gameProgress.unlockedLevel;
                const stars = gameProgress.stars[String(lv.id)] || 0;
                return (
                  <button key={lv.id} className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${lv.id === level.id ? 'current' : ''}`}
                    onClick={() => unlocked && handleSelectLevel(lv.id)} disabled={!unlocked}>
                    <div className="level-card-number">{unlocked ? lv.id : <Lock size={16} />}</div>
                    <div className="level-card-name">{lv.name}</div>
                    {stars > 0 && <div className="level-card-stars">{[1,2,3].map(s => <Star key={s} size={14} fill={s <= stars ? '#FBBF24' : 'none'} className={s <= stars ? 'star-filled' : 'star-empty'} />)}</div>}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowLevelSelect(false)} className="level-selector-close">Tutup</button>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <h2 className="success-title">🐛 Bug Ditemukan!</h2>
            <p className="success-subtitle">Hebat! Kamu berhasil memperbaiki program.</p>
            <div className="success-stars">{[1,2,3].map(s => <Star key={s} size={40} fill={s <= successData.stars ? '#FBBF24' : 'none'} stroke={s <= successData.stars ? '#FBBF24' : '#4B5563'} className={`success-star ${s <= successData.stars ? 'star-earned' : ''}`} style={{animationDelay:`${0.3+s*0.15}s`}} />)}</div>
            {successData.xp > 0 && <div className="success-xp"><Zap size={20} className="xp-icon" /><span>+{successData.xp} XP</span></div>}
            <div className="success-actions">
              {levelIndex < bugLevels.length - 1 && <button onClick={handleNext} className="action-btn action-run success-next"><span>Level Berikutnya</span><ArrowRight size={18} /></button>}
              <button onClick={handleReplay} className="action-btn action-reset"><RotateCcw size={18} /><span>Main Lagi</span></button>
            </div>
          </div>
        </div>
      )}

      {/* First-time tutorial */}
      {showTutorial && (
        <div className="level-selector-overlay" onClick={() => { setShowTutorial(false); markTutorialSeen('bug-hunter'); }}>
          <div className="success-modal" onClick={e => e.stopPropagation()}>
            <h2 className="success-title">🐛 Cari Kesalahannya!</h2>
            <div className="bh-tutorial-steps">
              <p>1. Baca kode dengan teliti.</p><p>2. Temukan bagian yang salah.</p><p>3. Pilih perbaikan yang benar.</p><p>4. Periksa jawaban.</p>
            </div>
            <button onClick={() => { setShowTutorial(false); markTutorialSeen('bug-hunter'); }} className="action-btn action-run" style={{marginTop:'1rem',width:'100%'}}>Mulai!</button>
          </div>
        </div>
      )}
    </div>
  );
}
