"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CARDS = ["🎮", "👾", "🕹️", "🎲", "🎰", "🎯", "🎪", "🎨"];
const DOUBLE_CARDS = [...CARDS, ...CARDS];

type Card = {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...DOUBLE_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setIsLocked(false);
  };

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(moves + 1);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = ([first, second]: number[]) => {
    const isMatch = cards[first].content === cards[second].content;

    if (isMatch) {
      const newCards = [...cards];
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
      setCards(newCards);
      setFlippedCards([]);
      setIsLocked(false);
      
      if (newCards.every((c) => c.isMatched)) {
        setIsWon(true);
      }
    } else {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[first].isFlipped = false;
        newCards[second].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-white/10">
      <div className="flex justify-between w-full mb-4 px-4 text-white">
        <div className="font-bold text-blue-400">Moves: {moves}</div>
        <button 
           onClick={shuffleCards}
           className="text-xs text-gray-400 hover:text-white"
        >
           Restart
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={false}
            animate={{ rotateY: card.isFlipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-12 h-16 sm:w-14 sm:h-20 bg-gray-700 rounded-lg cursor-pointer"
            onClick={() => handleCardClick(card.id)}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg backface-hidden flex items-center justify-center text-white text-xl font-bold"
                 style={{ backfaceVisibility: "hidden", display: card.isFlipped ? 'none' : 'flex' }}
            >
              ?
            </div>
            
            <div 
                className="absolute inset-0 bg-gray-800 border border-blue-500 rounded-lg flex items-center justify-center text-3xl"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {card.content}
            </div>
          </motion.div>
        ))}
      </div>

      {isWon && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white rounded-xl z-10">
          <h3 className="text-xl font-bold mb-2 text-green-400">You Won! 🎉</h3>
          <p className="text-sm mb-4">Total Moves: {moves}</p>
          <button
            onClick={shuffleCards}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
