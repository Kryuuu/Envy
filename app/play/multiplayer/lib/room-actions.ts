'use server';

import { supabase } from './supabase';
import { randomBytes } from 'crypto';

function generateSimpleRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateToken() {
  return randomBytes(16).toString('hex');
}

export async function createRoomAction(hostName: string, maxPlayers: number) {
  let uniqueCode = '';
  let isUnique = false;

  // Generate unique room code
  while (!isUnique) {
    uniqueCode = generateSimpleRoomCode();
    const { data } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_code', uniqueCode)
      .in('status', ['waiting', 'playing'])
      .limit(1);
    if (!data || data.length === 0) {
      isUnique = true;
    }
  }

  const hostToken = generateToken();

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      room_code: uniqueCode,
      host_name: hostName,
      max_players: maxPlayers,
      host_token: hostToken,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal membuat room' };
  }

  return { success: true, room: data, hostToken };
}

export async function joinRoomAction(roomCode: string, nickname: string) {
  const code = roomCode.toUpperCase().trim().replace(/\s+/g, '-');
  
  // Find active room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('room_code', code)
    .in('status', ['waiting', 'playing'])
    .single();

  if (roomError || !room) return { success: false, error: 'Room tidak ditemukan atau sudah ditutup.' };
  if (room.status === 'playing') return { success: false, error: 'Game sudah dimulai. Minta pengajar membuat room baru.' };

  // Check player limit
  const { count } = await supabase
    .from('room_players')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', room.id)
    .not('status', 'eq', 'disconnected');

  if (count !== null && count >= room.max_players) {
    return { success: false, error: 'Room sudah penuh.' };
  }

  // Check unique nickname
  const { data: existingPlayer } = await supabase
    .from('room_players')
    .select('*')
    .eq('room_id', room.id)
    .ilike('nickname', nickname)
    .single();

  if (existingPlayer) {
    return { success: false, error: 'Nama itu sudah digunakan di room ini.' };
  }

  const playerToken = generateToken();
  const { data: player, error: joinError } = await supabase
    .from('room_players')
    .insert({
      room_id: room.id,
      nickname,
      player_token: playerToken,
    })
    .select()
    .single();

  if (joinError || !player) return { success: false, error: 'Gagal bergabung.' };

  return { success: true, room, player, playerToken };
}

export async function startRoomAction(roomId: string, hostToken: string) {
  const { data: room } = await supabase.from('rooms').select('host_token, status').eq('id', roomId).single();
  if (!room || room.host_token !== hostToken) return { success: false, error: 'Unauthorized' };
  if (room.status !== 'waiting') return { success: false, error: 'Room tidak dalam status waiting' };

  // Start room and create session
  await supabase.from('rooms').update({ status: 'playing', started_at: new Date().toISOString() }).eq('id', roomId);
  const { data: session } = await supabase.from('game_sessions').insert({ room_id: roomId }).select().single();

  // Update players to playing
  await supabase.from('room_players').update({ status: 'playing' }).eq('room_id', roomId).eq('status', 'connected');

  return { success: true, session };
}

export async function closeRoomAction(roomId: string, hostToken: string) {
  const { data: room } = await supabase.from('rooms').select('host_token').eq('id', roomId).single();
  if (!room || room.host_token !== hostToken) return { success: false, error: 'Unauthorized' };

  await supabase.from('rooms').update({ status: 'closed', finished_at: new Date().toISOString() }).eq('id', roomId);
  await supabase.from('game_sessions').update({ status: 'finished', finished_at: new Date().toISOString() }).eq('room_id', roomId).eq('status', 'running');
  return { success: true };
}

export async function leaveRoomAction(playerId: string, playerToken: string) {
  const { data: player } = await supabase.from('room_players').select('player_token').eq('id', playerId).single();
  if (!player || player.player_token !== playerToken) return { success: false, error: 'Unauthorized' };

  await supabase.from('room_players').update({ status: 'disconnected' }).eq('id', playerId);
  return { success: true };
}

export async function savePlayerProgressAction(
  sessionId: string, playerId: string, playerToken: string, level: number,
  attempts: number, commandCount: number, stars: number, completed: boolean
) {
  const { data: player } = await supabase.from('room_players').select('player_token').eq('id', playerId).single();
  if (!player || player.player_token !== playerToken) return { success: false, error: 'Unauthorized' };

  const { data: existing } = await supabase
    .from('player_game_progress')
    .select('*')
    .eq('session_id', sessionId)
    .eq('player_id', playerId)
    .eq('level', level)
    .single();

  if (existing) {
    const isNewComplete = completed && !existing.completed;
    await supabase.from('player_game_progress').update({
      attempts,
      command_count: commandCount,
      stars: Math.max(stars, existing.stars),
      completed: completed || existing.completed,
      completed_at: isNewComplete ? new Date().toISOString() : existing.completed_at,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id);
  } else {
    await supabase.from('player_game_progress').insert({
      session_id: sessionId,
      player_id: playerId,
      level,
      attempts,
      command_count: commandCount,
      stars,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    });
  }
  return { success: true };
}
