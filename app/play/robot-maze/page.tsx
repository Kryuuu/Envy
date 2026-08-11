'use client';

import { useState, useCallback, useEffect } from 'react';
import MazeBoard from './components/MazeBoard';
import CommandList from './components/CommandList';
import CommandPanel from './components/CommandPanel';
import GameHeader from './components/GameHeader';
import LevelSelector from './components/LevelSelector';
import SuccessModal from './components/SuccessModal';
import TutorialCard from './components/TutorialCard';
import { useRobotMaze, calculateStars } from './hooks/useRobotMaze';
import { useGameProgress } from './hooks/useGameProgress';
import { levels } from './data/levels';

export default function RobotMazePage() {
  const { progress, isLoaded, completeLevel, setCurrentLevel } = useGameProgress();
  const [levelIndex, setLevelIndex] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ stars: 0, xp: 0 });

  const level = levels[levelIndex];

  const {
    robotState, commands, status, currentCommandIndex, failureMessage,
    totalFlatCommands, addCommand, addRepeatCommand, removeCommand,
    clearCommands, moveCommandUp, moveCommandDown, executeCommands,
    resetLevel, isExecuting,
  } = useRobotMaze(level);

  useEffect(() => {
    if (isLoaded && progress.currentLevel) {
      const idx = levels.findIndex((l) => l.id === progress.currentLevel);
      if (idx >= 0) setLevelIndex(idx);
    }
  }, [isLoaded, progress.currentLevel]);

  const handleExecute = useCallback(async () => {
    const result = await executeCommands();
    if (result.success) {
      const isFirst = !progress.levels[String(level.id)]?.completed;
      let xp = 0;
      if (isFirst) { xp = 100; if (result.stars === 3) xp += 50; else if (result.stars === 2) xp += 25; }
      else { const prev = progress.levels[String(level.id)]?.stars ?? 0; if (result.stars > prev) xp = result.stars === 3 ? 25 : 10; }
      completeLevel(level.id, result.stars, result.commandsUsed);
      setSuccessData({ stars: result.stars, xp });
      setTimeout(() => setShowSuccess(true), 600);
    }
  }, [executeCommands, completeLevel, level.id, progress.levels]);

  const handleSelectLevel = useCallback((id: number) => {
    const idx = levels.findIndex((l) => l.id === id);
    if (idx >= 0) { setLevelIndex(idx); setCurrentLevel(id); setShowLevelSelect(false); setShowSuccess(false); }
  }, [setCurrentLevel]);

  const handleNextLevel = useCallback(() => {
    if (levelIndex < levels.length - 1) { handleSelectLevel(levels[levelIndex + 1].id); }
  }, [levelIndex, handleSelectLevel]);

  const handleReplay = useCallback(() => { setShowSuccess(false); resetLevel(); clearCommands(); }, [resetLevel, clearCommands]);

  if (!isLoaded) {
    return <div className="play-loading"><div className="play-spinner" /><p>Memuat game...</p></div>;
  }

  return (
    <div className="robot-maze-page">
      <GameHeader levelId={level.id} levelName={level.name} totalXP={progress.xp} onShowLevelSelect={() => setShowLevelSelect(true)} />
      
      <div className="game-layout">
        <div className="game-left">
          <div className="maze-section">
            <div className="maze-info-bar">
              <span className="maze-level-desc">{level.description}</span>
              <span className="maze-cmd-count">Perintah: {totalFlatCommands} / optimal: {level.optimalCommands}</span>
            </div>
            <MazeBoard level={level} robotState={robotState} status={status} />
            {status === 'failure' && (
              <div className="failure-message">
                <p className="failure-text">{failureMessage}</p>
                <p className="failure-hint">Coba periksa kembali urutan perintahmu.</p>
              </div>
            )}
          </div>
          {level.tutorial && <TutorialCard title={level.tutorial.title} content={level.tutorial.content} />}
        </div>

        <div className="game-right">
          <div className="commands-section">
            <h3 className="commands-title">📋 Perintah</h3>
            <CommandList commands={commands} currentCommandIndex={currentCommandIndex} isExecuting={isExecuting} onRemove={removeCommand} onMoveUp={moveCommandUp} onMoveDown={moveCommandDown} />
          </div>
          <CommandPanel allowedCommands={level.allowedCommands} isExecuting={isExecuting} hasCommands={commands.length > 0} onAddCommand={addCommand} onAddRepeat={addRepeatCommand} onExecute={handleExecute} onReset={() => { resetLevel(); }} onClear={clearCommands} status={status} />
        </div>
      </div>

      {showLevelSelect && <LevelSelector progress={progress} currentLevel={level.id} onSelectLevel={handleSelectLevel} onClose={() => setShowLevelSelect(false)} />}
      {showSuccess && <SuccessModal stars={successData.stars} xpGained={successData.xp} levelId={level.id} hasNextLevel={levelIndex < levels.length - 1} onNextLevel={handleNextLevel} onReplay={handleReplay} />}
    </div>
  );
}
