'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Direction,
  CommandType,
  GameCommand,
  RepeatCommand,
  RobotState,
  GameLevel,
  GameStatus,
  Position,
} from '../types/game';

const DIRECTION_ORDER: Direction[] = ['north', 'east', 'south', 'west'];

const DIRECTION_DELTA: Record<Direction, Position> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

function turnRight(dir: Direction): Direction {
  const idx = DIRECTION_ORDER.indexOf(dir);
  return DIRECTION_ORDER[(idx + 1) % 4];
}

function turnLeft(dir: Direction): Direction {
  const idx = DIRECTION_ORDER.indexOf(dir);
  return DIRECTION_ORDER[(idx + 3) % 4];
}

function isObstacle(pos: Position, obstacles: Position[]): boolean {
  return obstacles.some((o) => o.x === pos.x && o.y === pos.y);
}

function isOutOfBounds(pos: Position, gridSize: number): boolean {
  return pos.x < 0 || pos.y < 0 || pos.x >= gridSize || pos.y >= gridSize;
}

function isGoal(pos: Position, goal: Position): boolean {
  return pos.x === goal.x && pos.y === goal.y;
}

// Flatten commands (expand repeats into atomic commands)
function flattenCommands(commands: GameCommand[]): CommandType[] {
  const result: CommandType[] = [];
  for (const cmd of commands) {
    if (typeof cmd === 'string') {
      result.push(cmd);
    } else {
      // RepeatCommand
      for (let i = 0; i < cmd.count; i++) {
        result.push(...cmd.commands);
      }
    }
  }
  return result;
}

export function calculateStars(commandsUsed: number, optimal: number): number {
  if (commandsUsed <= optimal) return 3;
  if (commandsUsed <= optimal + 3) return 2;
  return 1;
}

export interface UseRobotMazeReturn {
  robotState: RobotState;
  commands: GameCommand[];
  status: GameStatus;
  currentCommandIndex: number;
  failureMessage: string;
  totalFlatCommands: number;
  addCommand: (cmd: CommandType) => void;
  addRepeatCommand: (count: number, cmds: CommandType[]) => void;
  removeCommand: (index: number) => void;
  clearCommands: () => void;
  moveCommandUp: (index: number) => void;
  moveCommandDown: (index: number) => void;
  executeCommands: () => Promise<{ success: boolean; commandsUsed: number; stars: number }>;
  resetLevel: () => void;
  isExecuting: boolean;
}

export function useRobotMaze(level: GameLevel): UseRobotMazeReturn {
  const [robotState, setRobotState] = useState<RobotState>({
    position: { x: level.robot.x, y: level.robot.y },
    direction: level.robot.direction,
  });
  const [commands, setCommands] = useState<GameCommand[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);
  const [failureMessage, setFailureMessage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const abortRef = useRef(false);

  const addCommand = useCallback((cmd: CommandType) => {
    setCommands((prev) => [...prev, cmd]);
  }, []);

  const addRepeatCommand = useCallback((count: number, cmds: CommandType[]) => {
    const repeatCmd: RepeatCommand = { type: 'repeat', count, commands: cmds };
    setCommands((prev) => [...prev, repeatCmd]);
  }, []);

  const removeCommand = useCallback((index: number) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  const moveCommandUp = useCallback((index: number) => {
    if (index <= 0) return;
    setCommands((prev) => {
      const newCmds = [...prev];
      [newCmds[index - 1], newCmds[index]] = [newCmds[index], newCmds[index - 1]];
      return newCmds;
    });
  }, []);

  const moveCommandDown = useCallback((index: number) => {
    setCommands((prev) => {
      if (index >= prev.length - 1) return prev;
      const newCmds = [...prev];
      [newCmds[index], newCmds[index + 1]] = [newCmds[index + 1], newCmds[index]];
      return newCmds;
    });
  }, []);

  const resetLevel = useCallback(() => {
    abortRef.current = true;
    setRobotState({
      position: { x: level.robot.x, y: level.robot.y },
      direction: level.robot.direction,
    });
    setStatus('idle');
    setCurrentCommandIndex(-1);
    setFailureMessage('');
    setIsExecuting(false);
  }, [level]);

  const executeCommands = useCallback(async () => {
    const flat = flattenCommands(commands);
    if (flat.length === 0) {
      return { success: false, commandsUsed: 0, stars: 0 };
    }

    abortRef.current = false;
    setIsExecuting(true);
    setStatus('running');
    setFailureMessage('');

    let currentRobot: RobotState = {
      position: { x: level.robot.x, y: level.robot.y },
      direction: level.robot.direction,
    };

    setRobotState(currentRobot);

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < flat.length; i++) {
      if (abortRef.current) {
        setIsExecuting(false);
        return { success: false, commandsUsed: i, stars: 0 };
      }

      setCurrentCommandIndex(i);
      await delay(500);

      const cmd = flat[i];

      if (cmd === 'forward') {
        const delta = DIRECTION_DELTA[currentRobot.direction];
        const newPos: Position = {
          x: currentRobot.position.x + delta.x,
          y: currentRobot.position.y + delta.y,
        };

        if (isOutOfBounds(newPos, level.gridSize)) {
          setStatus('failure');
          setFailureMessage('Ups! Robot keluar dari arena 🤖');
          setIsExecuting(false);
          return { success: false, commandsUsed: i + 1, stars: 0 };
        }

        if (isObstacle(newPos, level.obstacles)) {
          setStatus('failure');
          setFailureMessage('Ups! Robot menabrak rintangan 🤖');
          setIsExecuting(false);
          return { success: false, commandsUsed: i + 1, stars: 0 };
        }

        currentRobot = { ...currentRobot, position: newPos };
        setRobotState(currentRobot);

        if (isGoal(newPos, level.goal)) {
          await delay(300);
          const stars = calculateStars(flat.length, level.optimalCommands);
          setStatus('success');
          setCurrentCommandIndex(-1);
          setIsExecuting(false);
          return { success: true, commandsUsed: flat.length, stars };
        }
      } else if (cmd === 'left') {
        currentRobot = { ...currentRobot, direction: turnLeft(currentRobot.direction) };
        setRobotState(currentRobot);
      } else if (cmd === 'right') {
        currentRobot = { ...currentRobot, direction: turnRight(currentRobot.direction) };
        setRobotState(currentRobot);
      }
    }

    // Ran all commands but didn't reach goal
    setStatus('failure');
    setFailureMessage('Robot belum sampai ke tujuan. Coba tambahkan perintah lagi! 🤔');
    setIsExecuting(false);
    return { success: false, commandsUsed: flat.length, stars: 0 };
  }, [commands, level]);

  const totalFlatCommands = flattenCommands(commands).length;

  return {
    robotState,
    commands,
    status,
    currentCommandIndex,
    failureMessage,
    totalFlatCommands,
    addCommand,
    addRepeatCommand,
    removeCommand,
    clearCommands,
    moveCommandUp,
    moveCommandDown,
    executeCommands,
    resetLevel,
    isExecuting,
  };
}
