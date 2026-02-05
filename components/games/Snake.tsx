"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRID_SIZE = 20;
const CELL_SIZE = 18; // Reduced from 25 to fit mobile/container (360px total width)
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 }); // Moving up initially
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Track inputs to prevent rapid dual-key inputs causing self-collision
  const lastProcessedDirection = useRef<Point>({ x: 0, y: -1 });

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: -1 });
    lastProcessedDirection.current = { x: 0, y: -1 };
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood());
        // Snake grows, don't pop tail
      } else {
        newSnake.pop();
      }
      
      setSnake(newSnake);
      lastProcessedDirection.current = direction;
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5); // Increase speed with score
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPaused, score, highScore, generateFood]);

  // Joystick logic
  const joystickRef = useRef<HTMLDivElement>(null);
  
  const handleDrag = (event: any, info: any) => {
    if (gameOver || isPaused) return;
    
    const { x, y } = info.offset;
    if (Math.abs(x) < 10 && Math.abs(y) < 10) return; // Deadzone

    const currentDir = lastProcessedDirection.current;
    let newDir = { x: 0, y: 0 };

    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal
      if (x > 0 && currentDir.x !== -1) newDir = { x: 1, y: 0 };
      if (x < 0 && currentDir.x !== 1) newDir = { x: -1, y: 0 };
    } else {
      // Vertical
      if (y > 0 && currentDir.y !== -1) newDir = { x: 0, y: 1 };
      if (y < 0 && currentDir.y !== 1) newDir = { x: 0, y: -1 };
    }

    if (newDir.x !== 0 || newDir.y !== 0) {
      setDirection(newDir);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === " ") {
          setIsPaused(prev => !prev);
          return;
      }

      const currentDir = lastProcessedDirection.current;
      let newDir = { x: 0, y: 0 };

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case "arrowdown":
        case "s":
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case "arrowleft":
        case "a":
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case "arrowright":
        case "d":
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
        default: return;
      }

      if (newDir.x !== 0 || newDir.y !== 0) {
        setDirection(newDir);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  // Helper to determine segment style (corner rounding)
  const getSegmentStyle = (index: number) => {
    if (index === 0) { // Head
        // Round based on direction
        const d = direction;
        return {
            borderTopLeftRadius: (d.y === -1 || d.x === -1) ? '50%' : '20%',
            borderTopRightRadius: (d.y === -1 || d.x === 1) ? '50%' : '20%',
            borderBottomRightRadius: (d.y === 1 || d.x === 1) ? '50%' : '20%',
            borderBottomLeftRadius: (d.y === 1 || d.x === -1) ? '50%' : '20%',
        };
    }
    if (index === snake.length - 1) { // Tail
        const prev = snake[index - 1];
        const curr = snake[index];
        return {
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%',
            borderBottomLeftRadius: '50%',
            transform: `scale(0.7)`, // Tapered tail
        };
    }
    // Body - Smart joining logic could go here, but simple rounding is often enough "organic" look
    return { borderRadius: '30%' };
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 rounded-3xl border-4 border-gray-800 shadow-2xl w-full max-w-md">
      <div className="flex justify-between w-full mb-6 px-4 text-white font-mono">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">SCORE</span>
          <span className="text-3xl font-bold text-green-400">{score}</span>
        </div>
        <div className="flex flex-col text-right">
             <span className="text-gray-400 text-xs">HIGH SCORE</span>
             <span className="text-2xl font-bold text-blue-400">{highScore}</span>
        </div>
      </div>

      <div
        className="relative bg-gray-800 rounded-lg overflow-hidden shadow-inner border border-gray-700"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }}
      >
        {/* Food */}
        <motion.div
          className="absolute flex items-center justify-center text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        >
          🍎
        </motion.div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`} // Unique key for smooth re-rendering
            className={`absolute flex items-center justify-center ${i === 0 ? 'z-10' : 'z-0'}`}
            layoutId={i === 0 ? "head" : undefined}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              ...getSegmentStyle(i)
            }}
          >
            <div className={`w-full h-full ${i === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg' : i % 2 === 0 ? 'bg-green-500' : 'bg-green-600'} transition-all duration-300`}>
                 {i === 0 && (
                     <div className="relative w-full h-full">
                         {/* Eyes */}
                         <div className={`absolute bg-white rounded-full w-2 h-2 shadow-sm ${
                             direction.y === -1 ? 'top-1 left-1' : 
                             direction.y === 1 ? 'bottom-1 left-1' : 
                             direction.x === -1 ? 'top-1 left-1' : 'top-1 right-1'
                         }`} />
                         <div className={`absolute bg-white rounded-full w-2 h-2 shadow-sm ${
                             direction.y === -1 ? 'top-1 right-1' : 
                             direction.y === 1 ? 'bottom-1 right-1' : 
                             direction.x === -1 ? 'bottom-1 left-1' : 'bottom-1 right-1'
                         }`} />
                     </div>
                 )}
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
            {gameOver && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20"
            >
                <motion.h3 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="text-4xl font-black mb-2 text-red-500 tracking-wider"
                >
                    GAME OVER
                </motion.h3>
                <p className="text-gray-300 mb-6">You scored {score} points</p>
                <button
                onClick={resetGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-full text-white font-bold shadow-lg transform transition-transform hover:scale-105"
                >
                Try Again
                </button>
            </motion.div>
            )}
            
             {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <h2 className="text-3xl font-bold text-white tracking-widest">PAUSED</h2>
                </div>
            )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 text-sm text-gray-500 font-mono w-full">
        {/* PC Controls */}
        <div className="hidden md:flex gap-4">
             <div className="flex items-center gap-2">
                <div className="flex gap-1">
                   <kbd className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded border border-gray-700">W</kbd>
                   <div className="flex gap-1">
                       <kbd className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded border border-gray-700">A</kbd>
                       <kbd className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded border border-gray-700">S</kbd>
                       <kbd className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded border border-gray-700">D</kbd>
                   </div>
                </div>
                <span>Move</span>
            </div>
            <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Space</kbd> 
                <span>Pause</span>
            </div>
        </div>

        {/* Mobile Joystick - Visible only on mobile/touch */}
        <div className="md:hidden relative w-32 h-32 bg-gray-800/50 rounded-full border border-gray-600 flex items-center justify-center" ref={joystickRef}>
            <motion.div
                className="w-12 h-12 bg-blue-500 rounded-full shadow-lg border-2 border-blue-400 z-10"
                drag
                dragConstraints={joystickRef}
                dragElastic={0.2}
                onDrag={handleDrag}
                onDragEnd={() => {
                    // Optional: Reset position visually if needed, though Framer does it with constraints usually
                }}
                whileTap={{ scale: 0.9, cursor: "grabbing" }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-1 bg-white absolute" />
                <div className="h-full w-1 bg-white absolute" />
            </div>
        </div>
        <p className="md:hidden text-xs opacity-50">Drag joystick to move</p>
      </div>
    </div>
  );
}
