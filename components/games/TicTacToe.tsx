"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    const win = calculateWinner(nextBoard);
    if (win) {
      setWinner(win);
    } else if (!nextBoard.includes(null)) {
      setWinner("Draw");
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-white/10">
      <div className="flex justify-between w-full mb-4 px-4 text-white">
        <div className="font-bold text-blue-400">
          {winner
            ? winner === "Draw"
              ? "It's a Draw!"
              : `Winner: ${winner}`
            : `Next Player: ${xIsNext ? "X" : "O"}`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-gray-900 p-2 rounded-xl">
        {board.map((square, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-lg text-3xl font-bold flex items-center justify-center transition-colors ${
              square === "X" ? "text-blue-400" : "text-purple-400"
            } hover:bg-gray-600/50`}
            onClick={() => handleClick(i)}
          >
            {square}
          </motion.button>
        ))}
      </div>

      {winner && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetGame}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold transition-colors"
        >
          Play Again
        </motion.button>
      )}
      
       <div className="mt-4 text-xs text-center text-gray-500">
        Local 2 Player • Take turns
      </div>
    </div>
  );
}
