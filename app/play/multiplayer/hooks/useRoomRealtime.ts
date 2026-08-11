import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Room, RoomPlayer, GameSession, PlayerGameProgress } from '../types';

export function useRoomRealtime(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [session, setSession] = useState<GameSession | null>(null);
  const [progress, setProgress] = useState<PlayerGameProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      const [roomRes, playersRes, sessionRes] = await Promise.all([
        supabase.from('rooms').select('*').eq('id', roomId).single(),
        supabase.from('room_players').select('*').eq('room_id', roomId),
        supabase.from('game_sessions').select('*').eq('room_id', roomId).eq('status', 'running').maybeSingle()
      ]);

      if (roomRes.error) {
        setError('Room tidak ditemukan');
        setIsLoading(false);
        return;
      }

      setRoom(roomRes.data as Room);
      if (playersRes.data) setPlayers(playersRes.data as RoomPlayer[]);
      
      if (sessionRes.data) {
        setSession(sessionRes.data as GameSession);
        const progRes = await supabase.from('player_game_progress').select('*').eq('session_id', sessionRes.data.id);
        if (progRes.data) setProgress(progRes.data as PlayerGameProgress[]);
      }
      setIsLoading(false);
    };

    fetchInitialData();

    // Subscribe to Room changes
    const roomSub = supabase.channel(`room:${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        setRoom(payload.new as Room);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` }, (payload) => {
        setPlayers((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as RoomPlayer];
          if (payload.eventType === 'UPDATE') return prev.map(p => p.id === payload.new.id ? payload.new as RoomPlayer : p);
          if (payload.eventType === 'DELETE') return prev.filter(p => p.id !== payload.old.id);
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `room_id=eq.${roomId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSession(payload.new as GameSession);
          setProgress([]); // Reset progress for new session
        } else if (payload.eventType === 'UPDATE') {
          setSession(payload.new as GameSession);
        }
      })
      .subscribe();

    // Subscribe to progress changes (only if session exists)
    let progressSub: ReturnType<typeof supabase.channel> | null = null;
    
    // We handle progress subscribing in a separate channel if we have a session, 
    // or we just subscribe globally for this room's progress (filtering by session is better but we might not have it yet).
    // The easiest is to subscribe to all progress changes and filter locally if needed, but RLS might prevent that.
    // Actually, we can just fetch progress whenever it changes.
    const setupProgressSub = async () => {
      // Find current active session
      const { data: currSession } = await supabase.from('game_sessions').select('id').eq('room_id', roomId).eq('status', 'running').maybeSingle();
      if (currSession) {
        progressSub = supabase.channel(`progress:${currSession.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'player_game_progress', filter: `session_id=eq.${currSession.id}` }, (payload) => {
            setProgress((prev) => {
              if (payload.eventType === 'INSERT') return [...prev, payload.new as PlayerGameProgress];
              if (payload.eventType === 'UPDATE') return prev.map(p => p.id === payload.new.id ? payload.new as PlayerGameProgress : p);
              return prev;
            });
          })
          .subscribe();
      }
    };
    setupProgressSub();

    return () => {
      roomSub.unsubscribe();
      if (progressSub) progressSub.unsubscribe();
    };
  }, [roomId]);

  // Handle dynamic session progress subscription updates
  useEffect(() => {
    if (!session?.id) return;
    const sub = supabase.channel(`progress:${session.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_game_progress', filter: `session_id=eq.${session.id}` }, (payload) => {
        setProgress((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as PlayerGameProgress];
          if (payload.eventType === 'UPDATE') return prev.map(p => p.id === payload.new.id ? payload.new as PlayerGameProgress : p);
          return prev;
        });
      })
      .subscribe();
      
    return () => { sub.unsubscribe(); };
  }, [session?.id]);

  return { room, players, session, progress, isLoading, error };
}
