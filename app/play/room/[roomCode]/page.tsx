'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Gamepad2, AlertTriangle, Loader2 } from 'lucide-react';
import { useResolveRoomCode } from '../../multiplayer/hooks/useResolveRoomCode';
import { useRoomRealtime } from '../../multiplayer/hooks/useRoomRealtime';
import { use as useReact } from 'react';

export default function StudentLobbyPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = useReact(params);
  const router = useRouter();
  const { roomId, loading: resolving, error: resolveError } = useResolveRoomCode(roomCode);
  const { room, players, isLoading, error } = useRoomRealtime(roomId || '');
  
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (roomId) {
      const pid = localStorage.getItem(`nvy_player_id_${roomId}`);
      if (!pid) {
        // Not joined properly
        router.push(`/play/join?room=${roomCode}`);
      } else {
        setPlayerId(pid);
      }
    }
  }, [roomId, roomCode, router]);

  // Transition to game when started
  useEffect(() => {
    if (room?.status === 'playing') {
      router.push(`/play/room/${roomCode}/game`);
    } else if (room?.status === 'closed') {
      alert('Room telah ditutup oleh pengajar.');
      router.push('/play');
    }
  }, [room?.status, router, roomCode]);

  if (resolving || isLoading || !playerId) {
    return <div className="play-loading"><Loader2 size={40} className="play-spinner" /><p>Memuat Room...</p></div>;
  }

  if (resolveError || error || !room) {
    return (
      <div className="play-loading">
        <AlertTriangle size={48} color="#EF4444" />
        <p>{resolveError || error || 'Terjadi kesalahan.'}</p>
        <Link href="/play" className="action-btn action-reset" style={{ marginTop: '1rem' }}>Kembali</Link>
      </div>
    );
  }

  const activePlayers = players.filter(p => p.status !== 'disconnected');
  const me = activePlayers.find(p => p.id === playerId);

  return (
    <div className="play-homepage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="game-header" style={{ marginBottom: '2rem', background: 'transparent', border: 'none' }}>
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Keluar</span></Link>
        </div>
      </header>
      
      <div className="cq-select-page" style={{ margin: '0 auto', width: '100%', maxWidth: '500px' }}>
        <h1 className="cq-title" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          🤖 Coding Room
        </h1>
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kode Room</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '2px', marginTop: '0.25rem' }}>{room.room_code}</p>
        </div>

        <div className="multiplayer-form" style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Pemain</h3>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>{activePlayers.length} / {room.max_players}</span>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {activePlayers.map(p => (
              <div key={p.id} style={{ padding: '0.75rem', background: p.id === playerId ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '8px', border: `1px solid ${p.id === playerId ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: p.id === playerId ? '#34D399' : '#E2E8F0', fontWeight: 600, fontSize: '0.9rem' }}>{p.nickname} {p.id === playerId && '(Kamu)'}</span>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              </div>
            ))}
            {activePlayers.length === 0 && <p style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Belum ada pemain.</p>}
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(251,191,36,0.1)', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.2)' }}>
          <p style={{ color: '#FBBF24', fontWeight: 600, fontSize: '0.9rem' }}>⏳ Menunggu pengajar memulai permainan...</p>
        </div>
      </div>
    </div>
  );
}
