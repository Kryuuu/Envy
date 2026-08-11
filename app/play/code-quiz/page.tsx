'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Star, Check, ArrowRight, RotateCcw, Flame, Trophy } from 'lucide-react';
import { quizQuestions } from './data/questions';
import { QuizDifficulty } from './types/quiz';
import { usePlaygroundProgress } from '../shared/hooks/usePlaygroundProgress';

type QuizMode = 'select' | 'playing' | 'result';

export default function CodeQuizPage() {
  const { progress, isLoaded, updateQuizProgress, markTutorialSeen } = usePlaygroundProgress();
  const [mode, setMode] = useState<QuizMode>('select');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('pemula');
  const [quizMode, setQuizMode] = useState<'latihan' | 'tantangan'>('latihan');
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (isLoaded && !progress.tutorialsSeen.includes('code-quiz')) setShowTutorial(true);
  }, [isLoaded, progress.tutorialsSeen]);

  const startQuiz = useCallback((diff: QuizDifficulty, qMode: 'latihan' | 'tantangan') => {
    setDifficulty(diff); setQuizMode(qMode);
    const filtered = quizQuestions.filter(q => q.difficulty === diff);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestionIds(shuffled.map(q => q.id));
    setCurrentQ(0); setScore(0); setStreak(0); setBestStreak(0); setTotalXpEarned(0);
    setSelectedOption(null); setAnswered(false); setMode('playing');
  }, []);

  const currentQuestion = useMemo(() => {
    if (questionIds.length === 0) return null;
    return quizQuestions.find(q => q.id === questionIds[currentQ]) || null;
  }, [questionIds, currentQ]);

  const handleAnswer = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;
    setAnswered(true);
    const correct = selectedOption === currentQuestion.correctOption;
    if (correct) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      const xp = 10 + (newStreak >= 3 ? 5 : 0);
      setTotalXpEarned(t => t + xp);
    } else {
      setStreak(0);
    }
  }, [selectedOption, currentQuestion, streak]);

  const handleNext = useCallback(() => {
    if (currentQ < questionIds.length - 1) {
      setCurrentQ(c => c + 1); setSelectedOption(null); setAnswered(false);
    } else {
      // Quiz finished
      const finalScore = score + (selectedOption === currentQuestion?.correctOption ? 1 : 0);
      let bonusXp = 0;
      if (finalScore === questionIds.length) bonusXp = 50;
      const quizId = `${difficulty}-${quizMode}-${Date.now()}`;
      const totalXp = totalXpEarned + bonusXp + (selectedOption === currentQuestion?.correctOption ? 10 : 0);
      const isFirstOfType = !progress.games['code-quiz'].completedQuizzes.some(q => q.startsWith(difficulty));
      updateQuizProgress(quizId, Math.round((finalScore / questionIds.length) * 100), isFirstOfType ? totalXp : Math.min(totalXp, 30));
      setTotalXpEarned(totalXp);
      setMode('result');
    }
  }, [currentQ, questionIds, score, selectedOption, currentQuestion, difficulty, quizMode, totalXpEarned, progress, updateQuizProgress]);

  if (!isLoaded) return <div className="play-loading"><div className="play-spinner" /><p>Memuat quiz...</p></div>;

  // ─── Quiz Selection ───
  if (mode === 'select') return (
    <div className="cq-page">
      <header className="game-header">
        <div className="game-header-left"><Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Playground</span></Link></div>
        <div className="game-header-right"><div className="xp-display"><Zap size={16} className="xp-icon" /><span>{progress.totalXp} XP</span></div></div>
      </header>
      <div className="cq-select-page">
        <h1 className="cq-title">🧠 Code Quiz</h1>
        <p className="cq-subtitle">Jawab tantangan coding, kumpulkan XP, dan uji kemampuan logikamu.</p>

        <div className="cq-mode-section">
          <h2 className="cq-section-title">Pilih Mode</h2>
          <div className="cq-modes">
            <button className={`cq-mode-card ${quizMode === 'latihan' ? 'active' : ''}`} onClick={() => setQuizMode('latihan')}>
              <span className="cq-mode-icon">📚</span><span className="cq-mode-name">Latihan</span><span className="cq-mode-desc">Santai, ada penjelasan</span>
            </button>
            <button className={`cq-mode-card ${quizMode === 'tantangan' ? 'active' : ''}`} onClick={() => setQuizMode('tantangan')}>
              <span className="cq-mode-icon">⚡</span><span className="cq-mode-name">Tantangan</span><span className="cq-mode-desc">XP bonus, skor summary</span>
            </button>
          </div>
        </div>

        <div className="cq-mode-section">
          <h2 className="cq-section-title">Pilih Tingkat Kesulitan</h2>
          <div className="cq-difficulties">
            {([['pemula','🟢','Pemula','Variabel, loop, dasar'],['menengah','🟡','Menengah','Kondisi, array, logika'],['tantangan','🔴','Tantangan','Fungsi, debugging, lanjutan']] as const).map(([d,icon,name,desc]) => (
              <button key={d} className={`cq-diff-card ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d as QuizDifficulty)}>
                <span className="cq-diff-icon">{icon}</span><span className="cq-diff-name">{name}</span><span className="cq-diff-desc">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => startQuiz(difficulty, quizMode)} className="action-btn action-run" style={{width:'100%',maxWidth:'300px',margin:'1.5rem auto 0'}}>
          <span>Mulai Quiz</span><ArrowRight size={18} />
        </button>
      </div>

      {showTutorial && (
        <div className="level-selector-overlay" onClick={() => { setShowTutorial(false); markTutorialSeen('code-quiz'); }}>
          <div className="success-modal" onClick={e => e.stopPropagation()}>
            <h2 className="success-title">🧠 Jawab Tantangannya!</h2>
            <p className="success-subtitle">Pilih jawaban yang menurutmu benar dan pelajari penjelasannya.</p>
            <button onClick={() => { setShowTutorial(false); markTutorialSeen('code-quiz'); }} className="action-btn action-run" style={{marginTop:'1rem',width:'100%'}}>Mengerti!</button>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Quiz Result ───
  if (mode === 'result') {
    const pct = Math.round((score / questionIds.length) * 100);
    const msg = pct === 100 ? 'Luar biasa! Semua jawaban benar!' : pct >= 70 ? 'Hebat! Pemahaman codingmu semakin bagus.' : pct >= 40 ? 'Bagus! Sedikit latihan lagi pasti makin jago.' : 'Terus mencoba! Setiap kesalahan adalah bagian dari belajar.';
    return (
      <div className="cq-page">
        <div className="cq-result-page">
          <div className="success-modal" style={{position:'relative',maxWidth:'450px',margin:'2rem auto'}}>
            <h2 className="success-title">🎉 Quiz Selesai!</h2>
            <div className="cq-result-stats">
              <div className="cq-stat"><Trophy size={20} /><span>{score} / {questionIds.length}</span><span className="cq-stat-label">Skor</span></div>
              <div className="cq-stat"><Check size={20} /><span>{pct}%</span><span className="cq-stat-label">Akurasi</span></div>
              <div className="cq-stat"><Flame size={20} /><span>{bestStreak}</span><span className="cq-stat-label">Best Streak</span></div>
              <div className="cq-stat"><Zap size={20} /><span>+{totalXpEarned}</span><span className="cq-stat-label">XP</span></div>
            </div>
            <p className="success-subtitle" style={{marginTop:'1rem'}}>{msg}</p>
            <div className="success-actions" style={{marginTop:'1.5rem'}}>
              <button onClick={() => startQuiz(difficulty, quizMode)} className="action-btn action-run"><RotateCcw size={18} /><span>Main Lagi</span></button>
              <button onClick={() => setMode('select')} className="action-btn action-reset"><span>Pilih Quiz Lain</span></button>
            </div>
            <Link href="/play" className="play-back-link" style={{display:'block',marginTop:'1rem'}}>← Kembali ke Playground</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Quiz Playing ───
  if (!currentQuestion) return null;
  return (
    <div className="cq-page">
      <header className="game-header">
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Playground</span></Link>
          <span className="level-badge" style={{background:'linear-gradient(135deg,#F59E0B,#D97706)'}}>Q{currentQ + 1}/{questionIds.length}</span>
        </div>
        <div className="game-header-right">
          {streak >= 2 && <div className="cq-streak"><Flame size={16} /><span>🔥 {streak}</span></div>}
          <div className="xp-display"><Zap size={16} className="xp-icon" /><span>+{totalXpEarned}</span></div>
        </div>
      </header>

      <div className="cq-playing-area">
        <div className="cq-progress-bar"><div className="cq-progress-fill" style={{width:`${((currentQ + 1)/questionIds.length)*100}%`}} /></div>

        <div className="cq-question-card">
          <p className="cq-question-text">{currentQuestion.question}</p>
          {currentQuestion.code && <pre className="cq-code-block"><code>{currentQuestion.code}</code></pre>}
        </div>

        <div className="cq-options-grid">
          {currentQuestion.options.map((opt, i) => (
            <button key={i} disabled={answered}
              className={`bh-option ${selectedOption === i ? 'selected' : ''} ${answered && i === currentQuestion.correctOption ? 'correct' : ''} ${answered && selectedOption === i && i !== currentQuestion.correctOption ? 'wrong' : ''}`}
              onClick={() => setSelectedOption(i)}>
              <span className="bh-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="bh-option-text">{opt}</span>
            </button>
          ))}
        </div>

        {answered && (
          <div className={`bh-feedback ${selectedOption === currentQuestion.correctOption ? 'bh-correct' : 'bh-wrong'}`}>
            <p className="bh-feedback-title">{selectedOption === currentQuestion.correctOption ? '✅ Benar!' : '❌ Belum tepat.'}</p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="cmd-action-buttons" style={{marginTop:'1rem'}}>
          {!answered ? (
            <button onClick={handleAnswer} disabled={selectedOption === null} className="action-btn action-run"><Check size={18} /><span>Jawab</span></button>
          ) : (
            <button onClick={handleNext} className="action-btn action-run"><span>{currentQ < questionIds.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}</span><ArrowRight size={18} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
