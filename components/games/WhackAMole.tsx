"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let moleTimer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      moleTimer = setInterval(() => {
        const randomSlot = Math.floor(Math.random() * 9);
        setActiveSlot(randomSlot);
      }, 700);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setActiveSlot(null);
    }

    return () => {
      clearInterval(timer);
      clearInterval(moleTimer);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
  };

  const whack = (index: number) => {
    if (index === activeSlot && isPlaying) {
      setScore((prev) => prev + 1);
      setActiveSlot(null); // Hide mole immediately
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-white/10">
      <div className="flex justify-between w-full mb-4 px-4 text-white">
        <div className="font-bold text-blue-400">Score: {score}</div>
        <div className={`font-mono ${timeLeft < 10 ? 'text-red-500' : 'text-gray-400'}`}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-gray-900 p-4 rounded-xl relative">
         {!isPlaying && timeLeft === 30 && (
             <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-xl">
                 <button 
                    onClick={startGame}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full animate-pulse"
                 >
                     Start Game
                 </button>
             </div>
         )}
         
         {!isPlaying && timeLeft === 0 && (
             <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center rounded-xl">
                 <h3 className="text-xl font-bold text-white mb-2">Time's Up!</h3>
                 <p className="text-blue-400 mb-4 text-lg">Score: {score}</p>
                 <button 
                    onClick={startGame}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full"
                 >
                     Play Again
                 </button>
             </div>
         )}

        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-full relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
            onClick={() => whack(i)}
          >
            <AnimatePresence>
              {activeSlot === i && isPlaying && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-2 bg-yellow-500 rounded-full flex items-center justify-center text-2xl border-4 border-yellow-600 shadow-inner"
                >
                  🐹
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
       <div className="mt-4 text-xs text-center text-gray-500">
        Tap the moles quickly!
      </div>
    </div>
  );
}
