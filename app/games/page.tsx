"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Snake from "../../components/games/Snake";
import TicTacToe from "../../components/games/TicTacToe";
import MemoryMatch from "../../components/games/MemoryMatch";
import RPS from "../../components/games/RPS";
import WhackAMole from "../../components/games/WhackAMole";
import ChessGame from "../../components/games/ChessGame";
import Roulette from "../../components/games/Roulette";
import Blackjack from "../../components/games/Blackjack";

const GAMES = [
  { id: "snake", title: "Snake", icon: "🐍", description: "Eat food, grow longer, don't hit the wall!", color: "from-green-500 to-emerald-700" },
  { id: "blackjack", title: "Blackjack", icon: "🃏", description: "Hit 21 or beat the dealer!", color: "from-slate-800 to-slate-950" },
  { id: "roulette", title: "Roulette", icon: "🎰", description: "Spin the wheel and test your luck!", color: "from-yellow-600 to-red-800" },
  { id: "chess", title: "Chess", icon: "♟️", description: "Strategic warfare. PvP or vs AI.", color: "from-gray-600 to-slate-800" },
  { id: "tictactoe", title: "Tic Tac Toe", icon: "❌", description: "Classic 3x3 strategy game for 2 players.", color: "from-blue-500 to-indigo-700" },
  { id: "memory", title: "Memory Match", icon: "🃏", description: "Flip cards and find matching pairs.", color: "from-purple-500 to-pink-700" },
  { id: "rps", title: "Rock Paper Scissors", icon: "✊", description: "Beat the CPU in this luck-based classic.", color: "from-orange-500 to-red-700" },
  { id: "whack", title: "Whack-a-Mole", icon: "🔨", description: "Test your reaction speed!", color: "from-yellow-500 to-amber-700" },
];

export default function ArcadePage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const activeGame = GAMES.find((g) => g.id === selectedGame);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
          Retro Arcade
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          No downloads, no ads. Just pure classic fun. Select a game to start playing!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800/50 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 cursor-pointer shadow-xl transition-all group"
                onClick={() => setSelectedGame(game.id)}
              >
                <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center text-6xl shadow-inner`}>
                  {game.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {game.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                    PLAY NOW <span className="ml-1">→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="game-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Arcade
            </button>

            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-1 border border-white/10 shadow-2xl">
              <div className={`bg-gradient-to-r ${activeGame?.color} p-4 rounded-t-3xl flex items-center justify-center gap-3`}>
                <span className="text-3xl">{activeGame?.icon}</span>
                <h2 className="text-2xl font-bold text-white">{activeGame?.title}</h2>
              </div>
              
              <div className="p-6 md:p-8 bg-gray-900 rounded-b-3xl min-h-[400px] flex items-center justify-center">
                 {selectedGame === "snake" && <Snake />}
                 {selectedGame === "roulette" && <Roulette />}
                 {selectedGame === "blackjack" && <Blackjack />}
                 {selectedGame === "chess" && <ChessGame />}
                 {selectedGame === "tictactoe" && <TicTacToe />}
                 {selectedGame === "memory" && <MemoryMatch />}
                 {selectedGame === "rps" && <RPS />}
                 {selectedGame === "whack" && <WhackAMole />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
