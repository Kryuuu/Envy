'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Star, Lock, Play, RotateCcw, Trash2, ArrowRight, X } from 'lucide-react';
import { pixelLevels } from './data/levels';
import { PixelColor, PixelCommand, AnyPixelCommand } from './types/pixel';
import { usePlaygroundProgress } from '../shared/hooks/usePlaygroundProgress';

const COLOR_MAP: Record<PixelColor, string> = {
  red: '#EF4444', blue: '#3B82F6', green: '#10B981', yellow: '#FBBF24', purple: '#8B5CF6', orange: '#F97316', empty: 'transparent',
};
const COLOR_LABELS: Record<PixelColor, string> = {
  red: 'Merah', blue: 'Biru', green: 'Hijau', yellow: 'Kuning', purple: 'Ungu', orange: 'Oranye', empty: '',
};
const COLORS: PixelColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export default function PixelCodingPage() {
  const { progress, isLoaded, updateGameProgress, markTutorialSeen } = usePlaygroundProgress();
  const [levelIndex, setLevelIndex] = useState(0);
  const [commands, setCommands] = useState<AnyPixelCommand[]>([]);
  const [grid, setGrid] = useState<(PixelColor | 'empty')[][]>([]);
  const [selectedColor, setSelectedColor] = useState<PixelColor>('red');
  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const [repeatCmds, setRepeatCmds] = useState<PixelCommand[]>([]);
  const [successData, setSuccessData] = useState({ stars: 0, xp: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);

  const level = pixelLevels[levelIndex];
  const gameProgress = progress.games['pixel-coding'];

  useEffect(() => { resetGrid(); }, [levelIndex]);
  useEffect(() => {
    if (isLoaded && !progress.tutorialsSeen.includes('pixel-coding')) setShowTutorial(true);
  }, [isLoaded, progress.tutorialsSeen]);

  const resetGrid = useCallback(() => {
    const g = Array.from({ length: pixelLevels[levelIndex].gridSize }, () =>
      Array.from({ length: pixelLevels[levelIndex].gridSize }, () => 'empty' as const));
    setGrid(g); setShowSuccess(false); setMatchCount(0);
  }, [levelIndex]);

  const addCommand = () => {
    const cmd: PixelCommand = { type: 'paint', x: coordX, y: coordY, color: selectedColor };
    setCommands(prev => [...prev, cmd]);
  };

  const executeCommands = useCallback(async () => {
    setIsRunning(true);
    const newGrid: (PixelColor | 'empty')[][] = Array.from({ length: level.gridSize }, () =>
      Array.from({ length: level.gridSize }, (): PixelColor | 'empty' => 'empty'));

    const flat: PixelCommand[] = [];
    for (const cmd of commands) {
      if (cmd.type === 'paint') flat.push(cmd);
      else for (let i = 0; i < cmd.count; i++) flat.push(...cmd.commands);
    }

    for (const cmd of flat) {
      if (cmd.x >= 0 && cmd.x < level.gridSize && cmd.y >= 0 && cmd.y < level.gridSize) {
        newGrid[cmd.y][cmd.x] = cmd.color;
      }
      setGrid(newGrid.map(r => [...r]));
      await new Promise(r => setTimeout(r, 150));
    }

    // Compare with target
    let match = 0, total = 0;
    for (let y = 0; y < level.gridSize; y++) {
      for (let x = 0; x < level.gridSize; x++) {
        if (level.target[y][x] !== 'empty') total++;
        if (newGrid[y][x] === level.target[y][x]) {
          if (level.target[y][x] !== 'empty') match++;
        }
      }
    }
    // Also check no extra pixels
    let extraPixels = 0;
    for (let y = 0; y < level.gridSize; y++)
      for (let x = 0; x < level.gridSize; x++)
        if (newGrid[y][x] !== 'empty' && level.target[y][x] === 'empty') extraPixels++;

    setMatchCount(match); setTotalTarget(total);
    const isComplete = match === total && extraPixels === 0;

    if (isComplete) {
      const cmdCount = flat.length;
      const stars = cmdCount <= level.optimalCommands ? 3 : cmdCount <= level.optimalCommands + 5 ? 2 : 1;
      const isFirst = !gameProgress.completedLevels.includes(level.id);
      let xp = 0;
      if (isFirst) { xp = 100; if (stars === 3) xp += 50; else if (stars === 2) xp += 25; }
      updateGameProgress('pixel-coding', level.id, stars, xp);
      setSuccessData({ stars, xp });
      setTimeout(() => setShowSuccess(true), 500);
    }
    setIsRunning(false);
  }, [commands, level, gameProgress, updateGameProgress]);

  const handleSelectLevel = (id: number) => {
    const idx = pixelLevels.findIndex(l => l.id === id);
    if (idx >= 0) { setLevelIndex(idx); setCommands([]); setShowLevelSelect(false); setShowSuccess(false); }
  };

  const handleNext = () => {
    if (levelIndex < pixelLevels.length - 1) { setLevelIndex(levelIndex + 1); setCommands([]); setShowSuccess(false); }
  };

  if (!isLoaded) return <div className="play-loading"><div className="play-spinner" /><p>Memuat game...</p></div>;

  return (
    <div className="pc-page">
      <header className="game-header">
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Playground</span></Link>
          <div className="level-info">
            <button onClick={() => setShowLevelSelect(true)} className="level-badge" style={{background:'linear-gradient(135deg,#8B5CF6,#7C3AED)'}}>Level {level.id}</button>
            <span className="level-name">{level.name}</span>
          </div>
        </div>
        <div className="game-header-right"><div className="xp-display"><Zap size={16} className="xp-icon" /><span>{progress.totalXp} XP</span></div></div>
      </header>

      <div className="game-layout">
        <div className="game-left">
          {/* Target Pattern */}
          <div className="pc-section">
            <h3 className="commands-title">🎯 Pola Target</h3>
            <div className="pc-grid-container">
              <div className="pc-grid" style={{gridTemplateColumns:`repeat(${level.gridSize},1fr)`}}>
                {level.target.flat().map((c, i) => (
                  <div key={i} className="pc-cell" style={{background: c !== 'empty' ? COLOR_MAP[c] : 'rgba(255,255,255,0.03)'}} />
                ))}
              </div>
            </div>
          </div>

          {/* Player Grid */}
          <div className="pc-section">
            <div className="bh-code-header"><span>🖼️ Hasil Kodemu</span>{matchCount > 0 && <span className="pc-match-count">{matchCount}/{totalTarget} pixel</span>}</div>
            <div className="pc-grid-container">
              <div className="pc-grid" style={{gridTemplateColumns:`repeat(${level.gridSize},1fr)`}}>
                {grid.flat().map((c, i) => (
                  <div key={i} className={`pc-cell ${c !== 'empty' ? 'pc-cell-filled' : ''}`} style={{background: c !== 'empty' ? COLOR_MAP[c] : 'rgba(255,255,255,0.03)'}} />
                ))}
              </div>
            </div>
          </div>

          {level.tutorial && <div className="tutorial-card"><h4 className="tutorial-title">{level.tutorial.title}</h4><p className="tutorial-content">{level.tutorial.content}</p></div>}
        </div>

        <div className="game-right">
          {/* Command Builder */}
          <div className="commands-section">
            <h3 className="commands-title">🎨 Tambah Perintah</h3>
            <div className="pc-builder">
              <div className="pc-color-picker">
                <span className="cmd-group-label">Warna</span>
                <div className="pc-colors">{COLORS.map(c => (
                  <button key={c} className={`pc-color-btn ${selectedColor === c ? 'active' : ''}`}
                    style={{background:COLOR_MAP[c]}} onClick={() => setSelectedColor(c)} aria-label={COLOR_LABELS[c]} />
                ))}</div>
              </div>
              <div className="pc-coords">
                <div className="pc-coord-input"><label>X</label><input type="number" min={0} max={level.gridSize-1} value={coordX} onChange={e => setCoordX(Math.min(level.gridSize-1,Math.max(0,+e.target.value)))} /></div>
                <div className="pc-coord-input"><label>Y</label><input type="number" min={0} max={level.gridSize-1} value={coordY} onChange={e => setCoordY(Math.min(level.gridSize-1,Math.max(0,+e.target.value)))} /></div>
              </div>
              <button onClick={addCommand} disabled={isRunning} className="cmd-btn cmd-forward" style={{width:'100%',justifyContent:'center'}}>+ Paint ({coordX}, {coordY}) {COLOR_LABELS[selectedColor]}</button>
              {level.allowRepeat && <button onClick={() => setShowRepeatModal(true)} disabled={isRunning} className="cmd-btn cmd-repeat" style={{width:'100%',justifyContent:'center',marginTop:'0.3rem'}}>🔁 Repeat</button>}
            </div>
          </div>

          {/* Command List */}
          <div className="commands-section" style={{maxHeight:'200px',overflowY:'auto'}}>
            <h3 className="commands-title">📋 Perintah ({commands.length})</h3>
            {commands.length === 0 ? <div className="command-list-empty"><div className="empty-icon">🎨</div><p>Belum ada perintah</p></div> : (
              <div className="command-list">
                {commands.map((cmd, i) => (
                  <div key={i} className="command-item">
                    <div className="command-number">{i+1}</div>
                    {cmd.type === 'paint' ? (
                      <><div className="pc-cmd-color" style={{background:COLOR_MAP[cmd.color],width:14,height:14,borderRadius:4}} /><span className="command-label">Paint ({cmd.x},{cmd.y})</span></>
                    ) : (
                      <span className="command-label">🔁 Repeat {cmd.count}× [{cmd.commands.map(c => `(${c.x},${c.y})`).join(', ')}]</span>
                    )}
                    {!isRunning && <button onClick={() => setCommands(prev => prev.filter((_,j)=>j!==i))} className="cmd-action-btn cmd-remove"><X size={14} /></button>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="cmd-action-buttons">
            <button onClick={executeCommands} disabled={isRunning || commands.length===0} className="action-btn action-run"><Play size={18} /><span>Jalankan</span></button>
            <button onClick={() => { resetGrid(); }} className="action-btn action-reset"><RotateCcw size={18} /><span>Reset</span></button>
            <button onClick={() => { setCommands([]); resetGrid(); }} disabled={isRunning} className="action-btn action-clear"><Trash2 size={18} /><span>Hapus</span></button>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      {showLevelSelect && (
        <div className="level-selector-overlay" onClick={() => setShowLevelSelect(false)}>
          <div className="level-selector-modal" onClick={e => e.stopPropagation()}>
            <h2 className="level-selector-title">🟪 Pilih Level</h2>
            <div className="level-grid">
              {pixelLevels.map(lv => {
                const unlocked = lv.id <= gameProgress.unlockedLevel;
                const stars = gameProgress.stars[String(lv.id)] || 0;
                return (
                  <button key={lv.id} className={`level-card ${unlocked?'unlocked':'locked'} ${lv.id===level.id?'current':''}`}
                    onClick={() => unlocked && handleSelectLevel(lv.id)} disabled={!unlocked}>
                    <div className="level-card-number">{unlocked ? lv.id : <Lock size={16} />}</div>
                    <div className="level-card-name">{lv.name}</div>
                    {stars > 0 && <div className="level-card-stars">{[1,2,3].map(s=><Star key={s} size={14} fill={s<=stars?'#FBBF24':'none'} className={s<=stars?'star-filled':'star-empty'} />)}</div>}
                  </button>);
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
            <h2 className="success-title">🎨 Pola Berhasil!</h2>
            <p className="success-subtitle">Hebat! Gambar pixelmu sudah cocok!</p>
            <div className="success-stars">{[1,2,3].map(s=><Star key={s} size={40} fill={s<=successData.stars?'#FBBF24':'none'} stroke={s<=successData.stars?'#FBBF24':'#4B5563'} className={`success-star ${s<=successData.stars?'star-earned':''}`} style={{animationDelay:`${0.3+s*0.15}s`}} />)}</div>
            {successData.xp > 0 && <div className="success-xp"><Zap size={20} className="xp-icon" /><span>+{successData.xp} XP</span></div>}
            <div className="success-actions">
              {levelIndex<pixelLevels.length-1 && <button onClick={handleNext} className="action-btn action-run success-next"><span>Level Berikutnya</span><ArrowRight size={18} /></button>}
              <button onClick={() => { setCommands([]); resetGrid(); }} className="action-btn action-reset"><RotateCcw size={18} /><span>Main Lagi</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Repeat Modal */}
      {showRepeatModal && (
        <div className="repeat-modal-overlay" onClick={() => setShowRepeatModal(false)}>
          <div className="repeat-modal" onClick={e => e.stopPropagation()}>
            <h3>🔁 Repeat</h3>
            <p className="repeat-desc">Pilih jumlah pengulangan dan perintah paint.</p>
            <div className="repeat-count-selector"><label>Jumlah:</label><div className="repeat-count-buttons">{[2,3,4,5].map(n=><button key={n} className={`repeat-count-btn ${repeatCount===n?'active':''}`} onClick={()=>setRepeatCount(n)}>{n}x</button>)}</div></div>
            <div className="pc-builder" style={{marginBottom:'0.75rem'}}>
              <div className="pc-colors">{COLORS.map(c=><button key={c} className={`pc-color-btn ${selectedColor===c?'active':''}`} style={{background:COLOR_MAP[c]}} onClick={()=>setSelectedColor(c)} />)}</div>
              <div className="pc-coords" style={{marginTop:'0.5rem'}}>
                <div className="pc-coord-input"><label>X</label><input type="number" min={0} max={level.gridSize-1} value={coordX} onChange={e=>setCoordX(+e.target.value)} /></div>
                <div className="pc-coord-input"><label>Y</label><input type="number" min={0} max={level.gridSize-1} value={coordY} onChange={e=>setCoordY(+e.target.value)} /></div>
              </div>
              <button className="cmd-btn cmd-forward small" style={{width:'100%',justifyContent:'center',marginTop:'0.3rem'}} onClick={()=>setRepeatCmds(p=>[...p,{type:'paint',x:coordX,y:coordY,color:selectedColor}])}>+ Tambah Paint</button>
            </div>
            {repeatCmds.length > 0 && <div className="repeat-preview"><p className="repeat-preview-label">Preview:</p><div className="repeat-preview-cmds">{repeatCmds.map((c,i)=><span key={i} className="repeat-preview-tag"><span className="pc-cmd-color" style={{background:COLOR_MAP[c.color],width:10,height:10,borderRadius:3,display:'inline-block'}} /> ({c.x},{c.y})<button onClick={()=>setRepeatCmds(p=>p.filter((_,j)=>j!==i))} className="repeat-preview-remove">×</button></span>)}</div></div>}
            <div className="repeat-modal-actions">
              <button className="action-btn action-run" disabled={repeatCmds.length===0} onClick={()=>{setCommands(p=>[...p,{type:'repeat',count:repeatCount,commands:repeatCmds}]);setShowRepeatModal(false);setRepeatCmds([]);}}>Tambahkan</button>
              <button className="action-btn action-reset" onClick={()=>{setShowRepeatModal(false);setRepeatCmds([]);}}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial */}
      {showTutorial && (
        <div className="level-selector-overlay" onClick={()=>{setShowTutorial(false);markTutorialSeen('pixel-coding');}}>
          <div className="success-modal" onClick={e=>e.stopPropagation()}>
            <h2 className="success-title">🎨 Buat Polanya!</h2>
            <div className="bh-tutorial-steps"><p>1. Lihat pola target.</p><p>2. Pilih koordinat dan warna.</p><p>3. Tambahkan perintah Paint.</p><p>4. Jalankan kode!</p></div>
            <button onClick={()=>{setShowTutorial(false);markTutorialSeen('pixel-coding');}} className="action-btn action-run" style={{marginTop:'1rem',width:'100%'}}>Mulai!</button>
          </div>
        </div>
      )}
    </div>
  );
}
