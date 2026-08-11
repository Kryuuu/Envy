'use client';

import { RobotState, Position, GameLevel, GameStatus } from '../types/game';

interface MazeBoardProps {
  level: GameLevel;
  robotState: RobotState;
  status: GameStatus;
}

const DIRECTION_ROTATION: Record<string, number> = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
};

function isObstacle(pos: Position, obstacles: Position[]): boolean {
  return obstacles.some((o) => o.x === pos.x && o.y === pos.y);
}

export default function MazeBoard({ level, robotState, status }: MazeBoardProps) {
  const { gridSize, obstacles, goal } = level;

  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isRobot = robotState.position.x === x && robotState.position.y === y;
      const isGoal = goal.x === x && goal.y === y;
      const isObs = isObstacle({ x, y }, obstacles);

      let cellContent = null;
      let cellClass = 'maze-cell';

      if (isRobot && isGoal && status === 'success') {
        cellContent = (
          <div className="maze-cell-content success-cell">
            <span className="robot-emoji success-bounce" role="img" aria-label="Robot berhasil">
              🎉
            </span>
          </div>
        );
        cellClass += ' cell-goal';
      } else if (isRobot) {
        cellContent = (
          <div className="maze-cell-content">
            <span
              className={`robot-emoji ${status === 'failure' ? 'robot-shake' : ''} ${status === 'running' ? 'robot-active' : ''}`}
              style={{
                transform: `rotate(${DIRECTION_ROTATION[robotState.direction]}deg)`,
                transition: 'transform 0.3s ease',
              }}
              role="img"
              aria-label="Robot"
            >
              🤖
            </span>
          </div>
        );
        cellClass += ' cell-robot';
      } else if (isGoal) {
        cellContent = (
          <div className="maze-cell-content">
            <span className="flag-emoji" role="img" aria-label="Tujuan">
              🚩
            </span>
          </div>
        );
        cellClass += ' cell-goal';
      } else if (isObs) {
        cellContent = (
          <div className="maze-cell-content">
            <span className="obstacle-emoji" role="img" aria-label="Rintangan">
              🌳
            </span>
          </div>
        );
        cellClass += ' cell-obstacle';
      } else {
        cellClass += ' cell-empty';
      }

      cells.push(
        <div key={`${x}-${y}`} className={cellClass}>
          {cellContent}
        </div>
      );
    }
  }

  return (
    <div className="maze-container" role="grid" aria-label="Robot Maze Grid">
      <div
        className="maze-grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}
