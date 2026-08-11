'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, User } from 'lucide-react';
import { joinRoomAction } from '../multiplayer/lib/room-actions';

function JoinRoomForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get('room') || '';
  
  const [roomCode, setRoomCode] = useState(initialRoom);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !nickname.trim()) { setError('Lengkapi kode room dan nickname.'); return; }
    
    setIsLoading(true); setError('');
    
    const formattedCode = roomCode.toUpperCase().trim().replace(/\s+/g, '-');
    const res = await joinRoomAction(formattedCode, nickname.trim());
    
    if (res.success && res.room && res.player) {
      // Store player token locally
      localStorage.setItem(`nvy_player_${res.room.id}`, res.playerToken || '');
      localStorage.setItem(`nvy_player_id_${res.room.id}`, res.player.id);
      router.push(`/play/room/${res.room.room_code}`);
    } else {
      setError(res.error || 'Gagal bergabung dengan room.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="multiplayer-form" style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="roomCode" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}><Key size={16} /> Kode Room</label>
        <input type="text" id="roomCode" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Contoh: A8X9K" maxLength={5} required
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none', textTransform: 'uppercase', letterSpacing: '2px' }}
          onFocus={(e) => e.target.style.borderColor = '#3B82F6'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="nickname" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}><User size={16} /> Nickname</label>
        <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nama panggilanmu (contoh: Budi)" maxLength={20} required
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
          onFocus={(e) => e.target.style.borderColor = '#3B82F6'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
      </div>

      {error && <div className="bh-feedback bh-wrong" style={{ marginBottom: '1rem' }}>{error}</div>}

      <button type="submit" disabled={isLoading || !roomCode.trim() || !nickname.trim()} className="action-btn action-run" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '1rem' }}>
        {isLoading ? 'Menyambungkan...' : 'Gabung Room'}
      </button>
    </form>
  );
}

export default function JoinRoomPage() {
  return (
    <div className="play-homepage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="game-header" style={{ marginBottom: '2rem', background: 'transparent', border: 'none' }}>
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Kembali</span></Link>
        </div>
      </header>
      
      <div className="cq-select-page" style={{ margin: '0 auto', width: '100%' }}>
        <h1 className="cq-title">Gabung Coding Room</h1>
        <p className="cq-subtitle">Masukkan kode room dari pengajarmu.</p>
        
        <Suspense fallback={<div className="play-loading"><div className="play-spinner" /><p>Memuat form...</p></div>}>
          <JoinRoomForm />
        </Suspense>
      </div>
    </div>
  );
}
