import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useResolveRoomCode(roomCode: string) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) return;
    
    const resolve = async () => {
      const code = decodeURIComponent(roomCode).toUpperCase().trim().replace(/\s+/g, '-');
      const { data, error } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', code)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error || !data) {
        setError('Room tidak ditemukan');
      } else {
        setRoomId(data.id);
      }
      setLoading(false);
    };
    resolve();
  }, [roomCode]);

  return { roomId, loading, error };
}
