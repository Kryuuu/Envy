"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Suit = "spades" | "hearts" | "clubs" | "diamonds";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

const SUITS: Suit[] = ["spades", "hearts", "clubs", "diamonds"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const getCardValue = (rank: Rank): number => {
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return parseInt(rank);
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ suit, rank, value: getCardValue(rank) });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function Blackjack() {
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealerTurn" | "won" | "lost" | "push" | "blackjack">("betting");

  // Betting Actions
  const placeBet = (amount: number) => {
      if (balance >= amount) {
          setBalance(prev => prev - amount);
          setCurrentBet(prev => prev + amount);
      }
  };

  const clearBet = () => {
      setBalance(prev => prev + currentBet);
      setCurrentBet(0);
  };

  const dealGame = () => {
      if (currentBet === 0) return;
      const newDeck = createDeck();
      const pHand = [newDeck.pop()!, newDeck.pop()!];
      const dHand = [newDeck.pop()!, newDeck.pop()!];
      
      setDeck(newDeck);
      setPlayerHand(pHand);
      setDealerHand(dHand);
      setGameState("playing");

      // Check instant Blackjack
      const pScore = calculateScore(pHand);
      if (pScore === 21) {
          // Check if dealer also has BJ (later), for now simplified
          setGameState("blackjack");
          endGame(pHand, dHand, "blackjack");
      }
  };

  // Game Logic
  const calculateScore = (hand: Card[]) => {
      let score = 0;
      let aces = 0;
      hand.forEach(card => {
          score += card.value;
          if (card.rank === "A") aces += 1;
      });
      while (score > 21 && aces > 0) {
          score -= 10;
          aces -= 1;
      }
      return score;
  };

  const hit = () => {
      if (gameState !== "playing") return;
      const newDeck = [...deck];
      const card = newDeck.pop()!;
      const newHand = [...playerHand, card];
      
      setDeck(newDeck);
      setPlayerHand(newHand);
      
      if (calculateScore(newHand) > 21) {
          setGameState("lost");
          endGame(newHand, dealerHand, "lost");
      }
  };

  const stand = async () => {
      if (gameState !== "playing") return;
      setGameState("dealerTurn");
      
      // Dealer logic simulation
      let currentDeck = [...deck];
      let currentDealerHand = [...dealerHand];
      let dScore = calculateScore(currentDealerHand);
      
      // Artificial delay for dealer ease
      await new Promise(r => setTimeout(r, 600));

      while (dScore < 17) {
          const card = currentDeck.pop()!;
          currentDealerHand = [...currentDealerHand, card];
          dScore = calculateScore(currentDealerHand);
          setDealerHand([...currentDealerHand]); // Force update for animation
          setDeck(currentDeck); // Update deck ref
          await new Promise(r => setTimeout(r, 800));
      }

      endGame(playerHand, currentDealerHand, null); // Let endGame decide result
  };

  const endGame = (pHand: Card[], dHand: Card[], forcedState: string | null) => {
      const pScore = calculateScore(pHand);
      const dScore = calculateScore(dHand);
      let result = forcedState;

      if (!result) {
          if (dScore > 21) result = "won";
          else if (pScore > dScore) result = "won";
          else if (pScore < dScore) result = "lost";
          else result = "push";
      }

      setGameState(result as any);

      // Payouts
      if (result === "won") setBalance(prev => prev + currentBet * 2);
      if (result === "blackjack") setBalance(prev => prev + currentBet * 2.5); // 3:2 payout standard + stake
      if (result === "push") setBalance(prev => prev + currentBet);
      
      // Reset bet for next round (handled in render usually, or manually)
  };

  const resetGame = () => {
      setPlayerHand([]);
      setDealerHand([]);
      setCurrentBet(0);
      setGameState("betting");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 min-h-[600px] bg-[#0f5132] rounded-3xl border-8 border-[#3d2b1f] shadow-2xl relative overflow-hidden">
        {/* Felt Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between w-full mb-8 z-10 px-4 pt-2">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-yellow-500/30">
                 <div className="w-8 h-8 rounded-full bg-yellow-500 shadow-lg border-2 border-yellow-300 flex items-center justify-center font-bold text-yellow-900">$</div>
                 <div className="text-yellow-400 font-bold font-mono text-xl">{balance.toLocaleString()}</div>
            </div>
            <div className="text-white font-serif italic text-2xl opacity-50">Blackjack Pays 3:2</div>
        </div>

        {/* Dealer Area */}
        <div className="flex flex-col items-center gap-4 mb-10 min-h-[160px] z-10">
            {gameState !== "betting" && (
                <>
                    <div className="flex -space-x-12">
                        {dealerHand.map((card, i) => (
                            <PlayingCard 
                                key={i} 
                                card={card} 
                                index={i} 
                                isHidden={i === 0 && gameState === "playing"} 
                            />
                        ))}
                    </div>
                    {(gameState !== "playing") && (
                        <div className="bg-black/60 px-3 py-1 rounded-full text-white font-bold text-sm">
                            Dealer: {calculateScore(dealerHand)}
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Center Status */}
        <div className="h-16 flex items-center justify-center z-20">
             <AnimatePresence>
                 {gameState === "won" && <ResultBanner text="YOU WIN!" color="text-yellow-400" />}
                 {gameState === "blackjack" && <ResultBanner text="BLACKJACK!" color="text-yellow-400" />}
                 {gameState === "lost" && <ResultBanner text="DEALER WINS" color="text-red-400" />}
                 {gameState === "push" && <ResultBanner text="PUSH (TIE)" color="text-gray-300" />}
             </AnimatePresence>
        </div>

        {/* Player Area */}
        <div className="flex flex-col items-center gap-4 mb-8 min-h-[160px] z-10">
            {gameState !== "betting" && (
                <>
                    <div className="bg-black/60 px-3 py-1 rounded-full text-white font-bold text-sm mb-2">
                            Count: {calculateScore(playerHand)}
                    </div>
                    <div className="flex -space-x-12">
                        {playerHand.map((card, i) => (
                            <PlayingCard key={i} card={card} index={i} />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-xl z-20">
            {gameState === "betting" ? (
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="text-green-200 font-bold uppercase tracking-widest text-sm">Place Your Bet</div>
                    <div className="flex gap-4">
                        {[10, 50, 100, 500].map(amt => (
                             <button 
                                key={amt}
                                onClick={() => placeBet(amt)}
                                className="group relative w-16 h-16 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 border-4 border-dashed border-yellow-700/50 shadow-xl flex items-center justify-center transform transition-all hover:-translate-y-2 active:scale-95"
                             >
                                 <div className="absolute inset-1 rounded-full border border-white/30"></div>
                                 <span className="font-black text-yellow-900 drop-shadow-sm">{amt}</span>
                             </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="text-white font-mono text-xl bg-black/40 px-6 py-2 rounded-lg border border-white/10">
                            Bet: ${currentBet}
                        </div>
                        {currentBet > 0 && (
                            <button onClick={clearBet} className="text-red-400 hover:text-red-300 text-sm font-bold underline">
                                Clear
                            </button>
                        )}
                    </div>
                    <button 
                        disabled={currentBet === 0}
                        onClick={dealGame}
                        className={`mt-4 px-12 py-3 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl transition-all
                            ${currentBet > 0 
                                ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105" 
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"}
                        `}
                    >
                        Deal
                    </button>
                </div>
            ) : (
                <div className="flex justify-center gap-6">
                    {gameState === "playing" ? (
                        <>
                            <ActionButton onClick={hit} color="bg-green-600" label="HIT" icon="👇" />
                            <ActionButton onClick={stand} color="bg-red-600" label="STAND" icon="✋" />
                        </>
                    ) : (
                        <button 
                            onClick={resetGame}
                            className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black px-8 py-3 rounded-full shadow-xl transition-all hover:scale-105"
                        >
                            PLAY AGAIN
                        </button>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}

// Subcomponents

const ActionButton = ({ onClick, color, label, icon }: { onClick: () => void, color: string, label: string, icon: string }) => (
    <button 
        onClick={onClick}
        className={`${color} w-32 py-4 rounded-xl flex flex-col items-center justify-center shadow-lg border-b-4 border-black/20 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all group`}
    >
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-white font-bold tracking-wider">{label}</span>
    </button>
);

const ResultBanner = ({ text, color }: { text: string, color: string }) => (
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`text-5xl font-black ${color} drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] stroke-black`}
        style={{ WebkitTextStroke: "2px black" }}
    >
        {text}
    </motion.div>
);

const PlayingCard = ({ card, index, isHidden }: { card: Card, index: number, isHidden?: boolean }) => {
    const isRed = card.suit === "hearts" || card.suit === "diamonds";
    
    // Suit Icons
    const SuitIcon = () => {
        switch(card.suit) {
            case "spades": return <span>♠</span>;
            case "hearts": return <span>♥</span>;
            case "clubs": return <span>♣</span>;
            case "diamonds": return <span>♦</span>;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative w-24 h-36 rounded-xl shadow-2xl border border-gray-300 transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer
                ${isHidden ? "bg-blue-800" : "bg-white"}
            `}
            style={{ 
                backgroundImage: isHidden 
                    ? "repeating-linear-gradient(45deg, #1e40af 0, #1e40af 10px, #1d4ed8 10px, #1d4ed8 20px)" 
                    : "none" 
            }}
        >
            {!isHidden && (
                <div className={`w-full h-full flex flex-col justify-between p-2 ${isRed ? "text-red-600" : "text-black"}`}>
                    {/* Top Corner */}
                    <div className="flex flex-col items-center leading-none">
                        <span className="font-bold text-xl font-serif">{card.rank}</span>
                        <span className="text-lg"><SuitIcon /></span>
                    </div>

                    {/* Center Art */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="text-6xl"><SuitIcon /></span>
                    </div>
                    
                    {/* Unique Face Card Art (Simple placeholder for now) */}
                    {(["J", "Q", "K"].includes(card.rank)) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className={`w-12 h-16 border-2 ${isRed ? "border-red-200" : "border-gray-200"} flex items-center justify-center font-serif text-2xl bg-white/50 backdrop-blur-sm rounded`}>
                                 {card.rank}
                             </div>
                        </div>
                    )}

                    {/* Bottom Corner */}
                    <div className="flex flex-col items-center leading-none transform rotate-180">
                        <span className="font-bold text-xl font-serif">{card.rank}</span>
                        <span className="text-lg"><SuitIcon /></span>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
