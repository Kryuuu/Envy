'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Gamepad2, Settings } from 'lucide-react';
import { createRoomAction } from '../multiplayer/lib/room-actions';

export default function CreateRoomPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [selectedGame, setSelectedGame] = useState('robot-maze');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) { setError('Masukkan nama pengajar.'); return; }
    
    setIsLoading(true); setError('');
    const res = await createRoomAction(hostName.trim(), maxPlayers);
    
    if (res.success && res.room) {
      // Store host token locally for authentication on host dashboard
      localStorage.setItem(`nvy_host_${res.room.id}`, res.hostToken || '');
      router.push(`/play/room/${res.room.room_code}/host?game=${selectedGame}&level=${selectedLevel}`);
    } else {
      setError(res.error || 'Terjadi kesalahan saat membuat room.');
      setIsLoading(false);
    }
  };

  return (
    <div className="play-homepage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="game-header" style={{ marginBottom: '2rem', background: 'transparent', border: 'none' }}>
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Kembali</span></Link>
        </div>
      </header>
      
      <div className="cq-select-page" style={{ margin: '0 auto', width: '100%' }}>
        <h1 className="cq-title">Buat Coding Room</h1>
        <p className="cq-subtitle">Buat room untuk belajar dan bermain bersama.</p>

        <form onSubmit={handleCreate} className="multiplayer-form" style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}><Gamepad2 size={16} /> Game</label>
              <select 
                value={selectedGame} 
                onChange={(e) => { setSelectedGame(e.target.value); setSelectedLevel(1); }}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', appearance: 'none' }}
              >
                <option value="robot-maze">🤖 Robot Maze (10 Level)</option>
                <option value="bug-hunter">🐛 Bug Hunter (12 Level)</option>
                <option value="pixel-coding">🎨 Pixel Coding (12 Level)</option>
                <option value="code-quiz">🧠 Code Quiz</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>🎯 Level Mulai</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', appearance: 'none' }}
              >
                {Array.from({ length: selectedGame === 'robot-maze' ? 10 : selectedGame === 'bug-hunter' || selectedGame === 'pixel-coding' ? 12 : 5 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}><Users size={16} /> Jumlah Pemain Maksimal</label>
            <div className="player-limit-selector" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[2, 4, 6, 8, 10].map(num => (
                <button type="button" key={num} onClick={() => setMaxPlayers(num)}
                  className={`cmd-btn ${maxPlayers === num ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', background: maxPlayers === num ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)', borderColor: maxPlayers === num ? '#3B82F6' : 'rgba(255,255,255,0.1)', color: maxPlayers === num ? '#fff' : '#94A3B8' }}>
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="hostName" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}><Settings size={16} /> Nama Pengajar (Host)</label>
            <input type="text" id="hostName" value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Contoh: Kak Kian" maxLength={20} required
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          {error && <div className="bh-feedback bh-wrong" style={{ marginBottom: '1rem' }}>{error}</div>}

          <button type="submit" disabled={isLoading || !hostName.trim()} className="action-btn action-run" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '1rem' }}>
            {isLoading ? 'Membuat Room...' : 'Buat Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
