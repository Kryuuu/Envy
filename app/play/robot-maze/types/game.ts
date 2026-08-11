// ─── Robot Maze Game Types ───

export type Direction = 'north' | 'east' | 'south' | 'west';

export type CommandType = 'forward' | 'left' | 'right';

export interface RepeatCommand {
  type: 'repeat';
  count: number;
  commands: CommandType[];
}

export type GameCommand = CommandType | RepeatCommand;

export interface Position {
  x: number;
  y: number;
}

export interface RobotState {
  position: Position;
  direction: Direction;
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  gridSize: number;
  robot: {
    x: number;
    y: number;
    direction: Direction;
  };
  goal: Position;
  obstacles: Position[];
  allowedCommands: ('forward' | 'left' | 'right' | 'repeat')[];
  optimalCommands: number;
  tutorial?: {
    title: string;
    content: string;
  };
}

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestCommands?: number;
}

export interface GameProgress {
  currentLevel: number;
  unlockedLevel: number;
  xp: number;
  levels: Record<string, LevelProgress>;
}

export type GameStatus = 'idle' | 'running' | 'success' | 'failure';

export interface GameState {
  robot: RobotState;
  commands: GameCommand[];
  status: GameStatus;
  currentCommandIndex: number;
  failureMessage?: string;
}
