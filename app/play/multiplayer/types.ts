export type RoomStatus = 'waiting' | 'playing' | 'finished' | 'closed';
export type PlayerStatus = 'connected' | 'playing' | 'finished' | 'disconnected';

export interface Room {
  id: string;
  room_code: string;
  game_type: string;
  host_name: string;
  host_token: string;
  max_players: number;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
  expires_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  nickname: string;
  player_token: string;
  status: PlayerStatus;
  joined_at: string;
  last_seen_at: string;
}

export interface GameSession {
  id: string;
  room_id: string;
  current_level: number;
  status: string;
  started_at: string;
  finished_at: string | null;
}

export interface PlayerGameProgress {
  id: string;
  session_id: string;
  player_id: string;
  level: number;
  attempts: number;
  command_count: number;
  stars: number;
  completion_time_ms: number | null;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
}
