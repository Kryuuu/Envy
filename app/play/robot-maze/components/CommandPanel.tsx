'use client';

import { useState } from 'react';
import { CommandType } from '../types/game';
import { Play, RotateCcw, Trash2 } from 'lucide-react';

interface CommandPanelProps {
  allowedCommands: ('forward' | 'left' | 'right' | 'repeat')[];
  isExecuting: boolean;
  hasCommands: boolean;
  onAddCommand: (cmd: CommandType) => void;
  onAddRepeat: (count: number, cmds: CommandType[]) => void;
  onExecute: () => void;
  onReset: () => void;
  onClear: () => void;
  status: string;
}

export default function CommandPanel({
  allowedCommands,
  isExecuting,
  hasCommands,
  onAddCommand,
  onAddRepeat,
  onExecute,
  onReset,
  onClear,
  status,
}: CommandPanelProps) {
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const [repeatCmds, setRepeatCmds] = useState<CommandType[]>([]);

  const handleAddRepeat = () => {
    if (repeatCmds.length > 0) {
      onAddRepeat(repeatCount, repeatCmds);
      setShowRepeatModal(false);
      setRepeatCmds([]);
      setRepeatCount(2);
    }
  };

  return (
    <div className="command-panel">
      {/* Command Buttons */}
      <div className="cmd-buttons-group">
        <p className="cmd-group-label">Perintah</p>
        <div className="cmd-buttons">
          {allowedCommands.includes('forward') && (
            <button
              onClick={() => onAddCommand('forward')}
              disabled={isExecuting}
              className="cmd-btn cmd-forward"
              aria-label="Tambah perintah Maju"
            >
              <span>⬆</span>
              <span>Maju</span>
            </button>
          )}
          {allowedCommands.includes('left') && (
            <button
              onClick={() => onAddCommand('left')}
              disabled={isExecuting}
              className="cmd-btn cmd-turn"
              aria-label="Tambah perintah Belok Kiri"
            >
              <span>↩</span>
              <span>Kiri</span>
            </button>
          )}
          {allowedCommands.includes('right') && (
            <button
              onClick={() => onAddCommand('right')}
              disabled={isExecuting}
              className="cmd-btn cmd-turn"
              aria-label="Tambah perintah Belok Kanan"
            >
              <span>↪</span>
              <span>Kanan</span>
            </button>
          )}
          {allowedCommands.includes('repeat') && (
            <button
              onClick={() => setShowRepeatModal(true)}
              disabled={isExecuting}
              className="cmd-btn cmd-repeat"
              aria-label="Tambah perintah Repeat"
            >
              <span>🔁</span>
              <span>Repeat</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="cmd-actions-group">
        <div className="cmd-action-buttons">
          <button
            onClick={onExecute}
            disabled={isExecuting || !hasCommands}
            className="action-btn action-run"
            aria-label="Jalankan perintah"
          >
            <Play size={18} />
            <span>Jalankan</span>
          </button>
          <button
            onClick={onReset}
            className="action-btn action-reset"
            aria-label="Reset level"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
          <button
            onClick={onClear}
            disabled={isExecuting || !hasCommands}
            className="action-btn action-clear"
            aria-label="Hapus semua perintah"
          >
            <Trash2 size={18} />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {/* Status Message */}
      <div className="game-status-message">
        {status === 'idle' && !hasCommands && (
          <p className="status-hint">📋 Susun perintahmu lalu tekan Jalankan!</p>
        )}
        {status === 'idle' && hasCommands && (
          <p className="status-ready">✅ Perintah siap! Tekan ▶ Jalankan</p>
        )}
        {status === 'running' && (
          <p className="status-running">⚡ Robot sedang menjalankan program...</p>
        )}
      </div>

      {/* Repeat Modal */}
      {showRepeatModal && (
        <div className="repeat-modal-overlay" onClick={() => setShowRepeatModal(false)}>
          <div className="repeat-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🔁 Repeat / Loop</h3>
            <p className="repeat-desc">
              Pilih berapa kali pengulangan dan perintah apa yang diulang.
            </p>

            <div className="repeat-count-selector">
              <label>Jumlah pengulangan:</label>
              <div className="repeat-count-buttons">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`repeat-count-btn ${repeatCount === n ? 'active' : ''}`}
                    onClick={() => setRepeatCount(n)}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="repeat-cmd-selector">
              <label>Perintah yang diulang:</label>
              <div className="repeat-cmd-buttons">
                <button
                  className="cmd-btn cmd-forward small"
                  onClick={() => setRepeatCmds((prev) => [...prev, 'forward'])}
                >
                  ⬆ Maju
                </button>
                <button
                  className="cmd-btn cmd-turn small"
                  onClick={() => setRepeatCmds((prev) => [...prev, 'left'])}
                >
                  ↩ Kiri
                </button>
                <button
                  className="cmd-btn cmd-turn small"
                  onClick={() => setRepeatCmds((prev) => [...prev, 'right'])}
                >
                  ↪ Kanan
                </button>
              </div>
            </div>

            {repeatCmds.length > 0 && (
              <div className="repeat-preview">
                <p className="repeat-preview-label">Preview:</p>
                <div className="repeat-preview-cmds">
                  {repeatCmds.map((c, i) => (
                    <span key={i} className="repeat-preview-tag">
                      {c === 'forward' ? '⬆ Maju' : c === 'left' ? '↩ Kiri' : '↪ Kanan'}
                      <button onClick={() => setRepeatCmds((prev) => prev.filter((_, idx) => idx !== i))} className="repeat-preview-remove">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="repeat-modal-actions">
              <button
                className="action-btn action-run"
                onClick={handleAddRepeat}
                disabled={repeatCmds.length === 0}
              >
                Tambahkan
              </button>
              <button
                className="action-btn action-reset"
                onClick={() => {
                  setShowRepeatModal(false);
                  setRepeatCmds([]);
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
