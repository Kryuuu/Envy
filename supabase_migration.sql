-- Supabase Database Migration for NVY Code Playground Multiplayer

-- Table: rooms
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT UNIQUE NOT NULL,
    game_type TEXT NOT NULL DEFAULT 'robot_maze',
    host_name TEXT NOT NULL,
    host_token TEXT NOT NULL,
    max_players INTEGER NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'waiting', -- waiting, playing, finished, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + interval '4 hours'),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE
);

-- Table: room_players
CREATE TABLE IF NOT EXISTS room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    player_token TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'connected', -- connected, playing, finished, disconnected
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, nickname)
);

-- Table: game_sessions
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    current_level INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'running', -- running, finished
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE
);

-- Table: player_game_progress
CREATE TABLE IF NOT EXISTS player_game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES room_players(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    command_count INTEGER NOT NULL DEFAULT 0,
    stars INTEGER NOT NULL DEFAULT 0,
    completion_time_ms INTEGER,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, player_id, level)
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_game_progress ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables so realtime works and clients can read state
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read room_players" ON room_players FOR SELECT USING (true);
CREATE POLICY "Public read game_sessions" ON game_sessions FOR SELECT USING (true);
CREATE POLICY "Public read player_game_progress" ON player_game_progress FOR SELECT USING (true);

-- Since we're using Server Actions for all writes, and the service role key will bypass RLS,
-- we don't strictly need insert/update policies for anon users if writes are server-only.
-- However, we can add some basic policies just in case.
CREATE POLICY "Allow public insert to rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to rooms" ON rooms FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to game_sessions" ON game_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to game_sessions" ON game_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to room_players" ON room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to room_players" ON room_players FOR UPDATE USING (true);
CREATE POLICY "Allow public insert to player_game_progress" ON player_game_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to player_game_progress" ON player_game_progress FOR UPDATE USING (true);

-- Enable Realtime
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_players;
alter publication supabase_realtime add table game_sessions;
alter publication supabase_realtime add table player_game_progress;
