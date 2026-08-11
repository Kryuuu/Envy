'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Trophy } from 'lucide-react';
import MazeBoard from '../../../robot-maze/components/MazeBoard';
import CommandList from '../../../robot-maze/components/CommandList';
import CommandPanel from '../../../robot-maze/components/CommandPanel';
import { useRobotMaze } from '../../../robot-maze/hooks/useRobotMaze';
import { levels } from '../../../robot-maze/data/levels';
import { useResolveRoomCode } from '../../../multiplayer/hooks/useResolveRoomCode';
import { useRoomRealtime } from '../../../multiplayer/hooks/useRoomRealtime';
import { savePlayerProgressAction } from '../../../multiplayer/lib/room-actions';
import { use as useReact } from 'react';

export default function MultiplayerGamePage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = useReact(params);
  const router = useRouter();
  const { roomId, loading: resolving } = useResolveRoomCode(roomCode);
  const { room, session, isLoading } = useRoomRealtime(roomId || '');
  
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  
  // Hardcode Level 1 or use session.current_level
  const levelIndex = session ? Math.max(0, session.current_level - 1) : 0;
  const level = levels[Math.min(levelIndex, levels.length - 1)];

  const {
    robotState, commands, status, currentCommandIndex, failureMessage,
    totalFlatCommands, addCommand, addRepeatCommand, removeCommand,
    clearCommands, moveCommandUp, moveCommandDown, executeCommands,
    resetLevel, isExecuting,
  } = useRobotMaze(level);

  useEffect(() => {
    if (roomId) {
      const pToken = localStorage.getItem(`nvy_player_${roomId}`);
      const pId = localStorage.getItem(`nvy_player_id_${roomId}`);
      if (!pToken || !pId) {
        router.push(`/play/join?room=${roomCode}`);
      } else {
        setPlayerId(pId);
        setPlayerToken(pToken);
      }
    }
  }, [roomId, roomCode, router]);

  useEffect(() => {
    if (room?.status === 'closed') {
      alert('Room telah ditutup oleh pengajar.');
      router.push('/play');
    }
  }, [room?.status, router]);

  const handleExecute = useCallback(async () => {
    const result = await executeCommands();
    
    // Save to multiplayer progress
    if (session && playerId && playerToken) {
      // we only care about updating stars/completion when success, but we can also update attempts on fail
      await savePlayerProgressAction(
        session.id,
        playerId,
        playerToken,
        level.id,
        1, // We could track total attempts locally, for MVP passing 1 per execute
        result.commandsUsed,
        result.success ? result.stars : 0,
        result.success
      );
    }
    
  }, [executeCommands, session, playerId, playerToken, level.id]);

  if (resolving || isLoading || !playerId) {
    return <div className="play-loading"><Loader2 size={40} className="play-spinner" /><p>Memuat Permainan...</p></div>;
  }

  return (
    <div className="robot-maze-page">
      <header className="game-header">
        <div className="game-header-left">
          <button onClick={() => router.push(`/play/room/${roomCode}`)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1' }}>
            <ArrowLeft size={18} /><span>Lobby</span>
          </button>
          <div className="level-info">
            <span className="level-badge" style={{background:'linear-gradient(135deg,#3B82F6,#2563EB)'}}>
              Misi Bersama {level.id}
            </span>
            <span className="level-name">{level.name}</span>
          </div>
        </div>
        <div className="game-header-right">
          <div className="xp-display" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: '#60A5FA' }}>
            <Trophy size={16} className="xp-icon" style={{ color: '#60A5FA' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{room?.room_code}</span>
          </div>
        </div>
      </header>
      
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
            {status === 'success' && (
              <div className="success-message" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#34D399', fontWeight: 700, fontSize: '1.2rem' }}>🎉 Hebat! Kamu berhasil!</p>
                <p style={{ color: '#A7F3D0', fontSize: '0.9rem', marginTop: '0.4rem' }}>Progressmu sudah dikirim ke dashboard pengajar.</p>
                <button onClick={() => { resetLevel(); clearCommands(); }} className="action-btn action-run" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Main Lagi
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="game-right">
          <div className="commands-section">
            <h3 className="commands-title">📋 Perintah</h3>
            <CommandList commands={commands} currentCommandIndex={currentCommandIndex} isExecuting={isExecuting} onRemove={removeCommand} onMoveUp={moveCommandUp} onMoveDown={moveCommandDown} />
          </div>
          <CommandPanel allowedCommands={level.allowedCommands} isExecuting={isExecuting} hasCommands={commands.length > 0} onAddCommand={addCommand} onAddRepeat={addRepeatCommand} onExecute={handleExecute} onReset={resetLevel} onClear={clearCommands} status={status} />
        </div>
      </div>
    </div>
  );
}
