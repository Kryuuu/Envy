"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CHOICES = [
  { id: "rock", icon: "✊", beats: "scissors" },
  { id: "paper", icon: "✋", beats: "rock" },
  { id: "scissors", icon: "✌️", beats: "paper" },
];

export default function RPS() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const handleChoice = (choiceId: string) => {
    const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setPlayerChoice(choiceId);
    setComputerChoice(randomChoice.id);

    if (choiceId === randomChoice.id) {
      setResult("Draw!");
    } else {
      const playerSelection = CHOICES.find((c) => c.id === choiceId);
      if (playerSelection?.beats === randomChoice.id) {
        setResult("You Win!");
        setScore((s) => ({ ...s, player: s.player + 1 }));
      } else {
        setResult("CPU Wins!");
        setScore((s) => ({ ...s, computer: s.computer + 1 }));
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-white/10">
      <div className="flex justify-between w-full mb-8 px-8 text-white text-lg font-bold">
        <div className="text-blue-400">You: {score.player}</div>
        <div className="text-red-400">CPU: {score.computer}</div>
      </div>

      <div className="flex justify-center items-center gap-8 mb-8 h-24">
        <div className="text-center">
            <motion.div 
               key={playerChoice}
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }}
               className="text-6xl"
            >
                {CHOICES.find(c => c.id === playerChoice)?.icon || "❓"}
            </motion.div>
            <p className="text-xs text-gray-400 mt-2">You</p>
        </div>
        
        <div className="text-2xl font-bold text-gray-500">VS</div>

        <div className="text-center">
            <motion.div 
               key={computerChoice}
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }}
               className="text-6xl"
            >
                {CHOICES.find(c => c.id === computerChoice)?.icon || "❓"}
            </motion.div>
            <p className="text-xs text-gray-400 mt-2">CPU</p>
        </div>
      </div>

      {result && (
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }} 
           className="text-xl font-bold mb-6 text-yellow-400"
        >
            {result}
        </motion.div>
      )}

      <div className="flex gap-4">
        {CHOICES.map((choice) => (
          <motion.button
            key={choice.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleChoice(choice.id)}
            className="w-16 h-16 bg-gray-700/50 rounded-full text-3xl flex items-center justify-center hover:bg-blue-600/50 transition-colors border-2 border-transparent hover:border-blue-400"
          >
            {choice.icon}
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        Choose your weapon!
      </div>
    </div>
  );
}
