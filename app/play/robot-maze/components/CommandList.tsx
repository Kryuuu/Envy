'use client';

import { CommandType, GameCommand } from '../types/game';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface CommandListProps {
  commands: GameCommand[];
  currentCommandIndex: number;
  isExecuting: boolean;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const COMMAND_LABELS: Record<CommandType, { label: string; icon: string }> = {
  forward: { label: 'Maju', icon: '⬆' },
  left: { label: 'Belok Kiri', icon: '↩' },
  right: { label: 'Belok Kanan', icon: '↪' },
};

function getFlatIndex(commands: GameCommand[], cmdIndex: number): number {
  let flat = 0;
  for (let i = 0; i < cmdIndex; i++) {
    const c = commands[i];
    if (typeof c === 'string') {
      flat += 1;
    } else {
      flat += c.count * c.commands.length;
    }
  }
  return flat;
}

export default function CommandList({
  commands,
  currentCommandIndex,
  isExecuting,
  onRemove,
  onMoveUp,
  onMoveDown,
}: CommandListProps) {
  if (commands.length === 0) {
    return (
      <div className="command-list-empty">
        <div className="empty-icon">📝</div>
        <p>Belum ada perintah</p>
        <p className="empty-hint">Tekan tombol perintah di bawah untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="command-list" role="list" aria-label="Daftar perintah">
      {commands.map((cmd, index) => {
        const flatStart = getFlatIndex(commands, index);
        let flatEnd: number;
        if (typeof cmd === 'string') {
          flatEnd = flatStart;
        } else {
          flatEnd = flatStart + cmd.count * cmd.commands.length - 1;
        }
        const isActive =
          isExecuting && currentCommandIndex >= flatStart && currentCommandIndex <= flatEnd;

        if (typeof cmd === 'string') {
          const info = COMMAND_LABELS[cmd];
          return (
            <div
              key={index}
              className={`command-item ${isActive ? 'command-active' : ''}`}
              role="listitem"
            >
              <div className="command-number">{index + 1}</div>
              <span className="command-icon">{info.icon}</span>
              <span className="command-label">{info.label}</span>
              {!isExecuting && (
                <div className="command-actions">
                  <button
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="cmd-action-btn"
                    aria-label="Pindah ke atas"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => onMoveDown(index)}
                    disabled={index === commands.length - 1}
                    className="cmd-action-btn"
                    aria-label="Pindah ke bawah"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="cmd-action-btn cmd-remove"
                    aria-label="Hapus perintah"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        } else {
          // RepeatCommand
          return (
            <div
              key={index}
              className={`command-item command-repeat ${isActive ? 'command-active' : ''}`}
              role="listitem"
            >
              <div className="command-number">{index + 1}</div>
              <div className="repeat-block">
                <div className="repeat-header">
                  <span className="command-icon">🔁</span>
                  <span className="command-label">
                    Repeat {cmd.count}x
                  </span>
                </div>
                <div className="repeat-body">
                  {cmd.commands.map((subCmd, subIdx) => {
                    const subInfo = COMMAND_LABELS[subCmd];
                    return (
                      <div key={subIdx} className="repeat-sub-cmd">
                        <span className="command-icon">{subInfo.icon}</span>
                        <span className="command-label">{subInfo.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!isExecuting && (
                <div className="command-actions">
                  <button
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="cmd-action-btn"
                    aria-label="Pindah ke atas"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => onMoveDown(index)}
                    disabled={index === commands.length - 1}
                    className="cmd-action-btn"
                    aria-label="Pindah ke bawah"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="cmd-action-btn cmd-remove"
                    aria-label="Hapus perintah"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}
