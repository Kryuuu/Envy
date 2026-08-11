'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Play, Copy, AlertTriangle, Loader2, StopCircle } from 'lucide-react';
import { useResolveRoomCode } from '../../../multiplayer/hooks/useResolveRoomCode';
import { useRoomRealtime } from '../../../multiplayer/hooks/useRoomRealtime';
import { startRoomAction, closeRoomAction } from '../../../multiplayer/lib/room-actions';
import { use as useReact } from 'react';

export default function HostLobbyPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = useReact(params);
  const router = useRouter();
  const { roomId, loading: resolving, error: resolveError } = useResolveRoomCode(roomCode);
  const { room, players, progress, isLoading, error } = useRoomRealtime(roomId || '');
  
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [startLevel, setStartLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lvl = parseInt(urlParams.get('level') || '1', 10);
    setStartLevel(isNaN(lvl) ? 1 : lvl);
  }, []);

  useEffect(() => {
    if (roomId) {
      const token = localStorage.getItem(`nvy_host_${roomId}`);
      if (!token) {
        // Unauthorized
        alert('Kamu tidak memiliki akses host ke room ini.');
        router.push('/play');
      } else {
        setHostToken(token);
      }
    }
  }, [roomId, router]);

  const handleCopy = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStart = async () => {
    if (!roomId || !hostToken) return;
    setIsStarting(true);
    const res = await startRoomAction(roomId, hostToken, startLevel);
    if (!res.success) {
      alert(res.error);
      setIsStarting(false);
    }
    // Realtime subscription will update room.status to 'playing'
  };

  const handleClose = async () => {
    if (!roomId || !hostToken) return;
    if (confirm('Apakah kamu yakin ingin menutup room ini? Siswa akan dikeluarkan.')) {
      setIsClosing(true);
      await closeRoomAction(roomId, hostToken);
      router.push('/play');
    }
  };

  if (resolving || isLoading || !hostToken) {
    return <div className="play-loading"><Loader2 size={40} className="play-spinner" /><p>Memuat Dashboard...</p></div>;
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

  return (
    <div className="play-homepage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '1000px' }}>
      <header className="game-header" style={{ marginBottom: '1.5rem', background: 'transparent', border: 'none', padding: '0' }}>
        <div className="game-header-left">
          <Link href="/play" className="back-link"><ArrowLeft size={18} /><span>Tinggalkan Dashboard</span></Link>
        </div>
      </header>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="cq-title" style={{ fontSize: '1.8rem', textAlign: 'left' }}>Dashboard Pengajar</h1>
          <p className="cq-subtitle" style={{ textAlign: 'left' }}>👑 Host: {room.host_name}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {room.status === 'waiting' && (
            <button onClick={handleStart} disabled={isStarting || activePlayers.length === 0} className="action-btn action-run" style={{ minWidth: '140px' }}>
              <Play size={18} /> {isStarting ? 'Memulai...' : 'Mulai Game'}
            </button>
          )}
          <button onClick={handleClose} disabled={isClosing} className="action-btn action-clear" style={{ minWidth: '140px' }}>
            <StopCircle size={18} /> Tutup Room
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Room Info Card */}
        <div className="multiplayer-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Informasi Room</h3>
          
          <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kode Room</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '2px', marginTop: '0.5rem', marginBottom: '0.75rem' }}>{room.room_code}</p>
            <button onClick={handleCopy} className="cmd-btn cmd-forward" style={{ margin: '0 auto', fontSize: '0.8rem' }}>
              <Copy size={14} /> {copied ? 'Disalin!' : 'Salin Kode'}
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Status</span>
            <span style={{ color: room.status === 'playing' ? '#10B981' : '#F59E0B', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{room.status === 'playing' ? '🟢 Sedang Bermain' : '🟡 Menunggu'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Pemain Bergabung</span>
            <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem' }}>{activePlayers.length} / {room.max_players}</span>
          </div>
        </div>

        {/* Players List & Progress Card */}
        <div className="multiplayer-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Progres Siswa</h3>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {activePlayers.map(p => {
              // Find progress for this player
              const pProg = progress.find(pr => pr.player_id === p.id);
              
              return (
                <div key={p.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pProg ? '0.5rem' : '0' }}>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1rem' }}>{p.nickname}</span>
                    {room.status === 'waiting' ? (
                      <span style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>Siap</span>
                    ) : pProg?.completed ? (
                      <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>✅ Selesai</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#FBBF24', background: 'rgba(251,191,36,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>🟡 Bermain</span>
                    )}
                  </div>
                  
                  {room.status === 'playing' && pProg && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Percobaan: <span style={{ color: '#fff' }}>{pProg.attempts}</span></div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Perintah: <span style={{ color: '#fff' }}>{pProg.command_count}</span></div>
                      {pProg.completed && (
                        <>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Bintang: <span style={{ color: '#FBBF24' }}>{'⭐'.repeat(pProg.stars)}</span></div>
                        </>
                      )}
                    </div>
                  )}
                  {room.status === 'playing' && !pProg && (
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>Belum ada progres tersimpan.</p>
                  )}
                </div>
              );
            })}
            
            {activePlayers.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Belum ada siswa yang bergabung.</p>
                <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '0.5rem' }}>Bagikan kode room di layar kiri ke siswa.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
