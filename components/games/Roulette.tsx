"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const COLORS: Record<number, string> = {
  0: "green",
};
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

WHEEL_NUMBERS.forEach(num => {
  if (num !== 0) {
    COLORS[num] = RED_NUMBERS.includes(num) ? "red" : "black";
  }
});

// Sound simulation helpers (visual only for now)
// In a real app, we'd use new Audio('/sounds/spin.mp3')

export default function Roulette() {
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const controls = useAnimation();
  const rotationRef = useRef(0);

  const placeBet = (type: string, amount: number) => {
    if (spinning) return;
    if (balance < amount) {
        // Simple shake animation trigger could go here
        return;
    }
    setBalance(prev => prev - amount);
    setCurrentBet(prev => prev + amount);
    setBets(prev => ({
        ...prev,
        [type]: (prev[type] || 0) + amount
    }));
    setWinAmount(null);
  };

  const spinWheel = async () => {
    if (spinning || currentBet === 0) return;

    setSpinning(true);
    setResult(null);
    setWinAmount(null);

    const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
    const winningNumber = WHEEL_NUMBERS[randomIndex];
    
    // Spin Logic
    const segmentAngle = 360 / WHEEL_NUMBERS.length;
    const targetAngle = 360 - (randomIndex * segmentAngle); 
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3)); // 5-8 spins
    const finalRotation = rotationRef.current + extraSpins + targetAngle;
    
    // Add jitter slightly to simulate ball bounce (optional visual complexity)
    
    await controls.start({
        rotate: finalRotation,
        transition: { duration: 5, ease: [0.3, 0, 0.2, 1] } // Ease-out cubic
    });
    
    rotationRef.current = finalRotation % 360; 
    
    handleResult(winningNumber);
    setSpinning(false);
  };

  const handleResult = (number: number) => {
      setResult(number);
      setHistory(prev => [number, ...prev].slice(0, 10));
      
      let winnings = 0;
      const color = COLORS[number];
      const isEven = number !== 0 && number % 2 === 0;
      
      // Payouts
      if (bets[number.toString()]) winnings += bets[number.toString()] * 36;
      if (bets["red"] && color === "red") winnings += bets["red"] * 2;
      if (bets["black"] && color === "black") winnings += bets["black"] * 2;
      if (bets["even"] && isEven) winnings += bets["even"] * 2;
      if (bets["odd"] && !isEven && number !== 0) winnings += bets["odd"] * 2;
      if (bets["1-18"] && number >= 1 && number <= 18) winnings += bets["1-18"] * 2;
      if (bets["19-36"] && number >= 19 && number <= 36) winnings += bets["19-36"] * 2;
      
      if (winnings > 0) {
          setBalance(prev => prev + winnings);
          setWinAmount(winnings);
      }
      
      // Clear bets after a short delay or immediately? Standard is clear lost bets, keep won. 
      // For simplicity, we clear all for now, or let user 'Rebet'.
      setBets({});
      setCurrentBet(0);
  };

  const Chip = ({ amount }: { amount: number }) => (
      <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center shadow-lg text-[10px] font-bold text-yellow-900 z-10 pointer-events-none">
          {amount >= 1000 ? '1k' : amount}
      </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 bg-[#1a2c20] min-h-screen rounded-3xl border-8 border-[#2d1b0e] shadow-2xl overflow-hidden relative">
       
       {/* Background Noise/Texture */}
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] pointer-events-none"></div>

       {/* Header */}
       <div className="flex justify-between w-full mb-4 px-4 pt-4 z-10">
           <div className="bg-black/60 p-3 rounded-full border border-yellow-500/30 flex items-center gap-3 backdrop-blur-sm">
               <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-yellow-900 font-bold border-2 border-yellow-300 shadow shadow-yellow-500/50">$</div>
               <span className="text-yellow-400 font-bold text-xl font-mono">{balance.toLocaleString()}</span>
           </div>
           <div className="bg-black/60 p-3 rounded-full border border-blue-500/30 flex items-center gap-3 backdrop-blur-sm">
               <span className="text-blue-200 text-xs uppercase font-bold tracking-wider">Current Bet</span>
               <span className="text-white font-bold font-mono">{currentBet}</span>
           </div>
       </div>

       {/* Main Stage: Wheel & Result */}
       <div className="relative w-full flex flex-col items-center justify-center py-6 z-10">
           {/* Result Popup */}
           <AnimatePresence>
               {winAmount !== null && (
                   <motion.div 
                     initial={{ scale: 0, y: 50 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                   >
                       <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 p-1 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.6)]">
                           <div className="bg-red-900 px-8 py-4 rounded-xl border-4 border-yellow-400 text-center">
                               <div className="text-yellow-400 font-bold text-lg uppercase tracking-widest mb-1">You Won</div>
                               <div className="text-4xl font-black text-white drop-shadow-md">+{winAmount}</div>
                           </div>
                       </div>
                   </motion.div>
               )}
           </AnimatePresence>

           {/* Wheel Container */}
           <div className="relative group">
                {/* Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-8 h-10 filter drop-shadow-xl">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-zinc-200"></div>
                </div>
                
               <motion.div 
                   className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border-[12px] border-[#4a2c18] shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative bg-[#2a2a2a]"
                   animate={controls}
                   style={{ 
                       background: `conic-gradient(
                           ${WHEEL_NUMBERS.map((n, i) => {
                               const start = (i / 37) * 100;
                               const end = ((i + 1) / 37) * 100;
                               return `${COLORS[n] === 'green' ? '#16a34a' : COLORS[n] === 'red' ? '#dc2626' : '#171717'} ${start}% ${end}%`;
                           }).join(', ')}
                       )`
                   }}
               >
                   {/* Realistic Inner Rings */}
                   <div className="absolute inset-0 m-auto w-[70%] h-[70%] rounded-full border-2 border-yellow-600/30"></div>
                   
                   {/* Numbers */}
                   <div className="absolute inset-0 w-full h-full">
                       {WHEEL_NUMBERS.map((num, i) => {
                           // 360 / 37 segments
                           // Each segment is ~9.7deg
                           // We want to center the number in the segment
                           // Start angle is i * (360/37). Center is + (360/37)/2
                           const rotation = (i * (360 / 37)) + (360 / 37) / 2;
                           
                           return (
                               <div 
                                   key={i}
                                   className="absolute top-0 left-1/2 -ml-[1px] h-1/2 origin-bottom flex justify-center pt-2"
                                   style={{ transform: `rotate(${rotation}deg)` }}
                               >
                                   <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-md transform -scale-x-100">
                                       {num}
                                   </span>
                               </div>
                           )
                       })}
                   </div>

                   <div className="absolute inset-0 m-auto w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6e1e] shadow-lg border-4 border-[#5c4a17] flex items-center justify-center">
                       {/* Center Cap */}
                       <div className="w-4 h-4 rounded-full bg-zinc-300 shadow-inner"></div>
                   </div>
               </motion.div>
           </div>
           
           {/* Spin Button */}
           <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={spinWheel}
              disabled={spinning}
              className={`mt-8 px-10 py-3 rounded-full font-black text-white text-lg tracking-widest uppercase shadow-[0_4px_0_rgba(0,0,0,0.5)] transition-all
                  ${spinning 
                      ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 hover:shadow-[0_6px_0_rgba(0,0,0,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none'}
              `}
           >
               {spinning ? "Spinning..." : "SPIN Wheel"}
           </motion.button>
       </div>

       {/* Betting Table */}
       <div className="w-full max-w-3xl bg-[#0f5132] p-4 sm:p-6 rounded-t-3xl border-t-8 border-[#d4af37] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] z-10 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-30 pointer-events-none rounded-t-3xl"></div>
            
            <p className="text-center text-green-200/50 text-xs font-bold uppercase tracking-widest mb-4">Place Your Bets</p>

            <div className="grid grid-cols-12 gap-2 sm:gap-3">
                {/* 0 Zero */}
                <div className="col-span-12 sm:col-span-1 relative">
                    <BetButton 
                        label="0" 
                        color="green" 
                        betAmount={bets["0"]}
                        onClick={() => placeBet("0", 10)}
                        fullHeight
                    />
                </div>

                {/* Numbers Grid */}
                <div className="col-span-12 sm:col-span-11 grid grid-cols-12 gap-1 sm:gap-2">
                     {/* Row 1: 3, 6, 9... */}
                     {/* Standard Layout is tricky in flex/grid. We'll do simple numeric order for mobile friendliness */}
                     {Array.from({length: 36}, (_, i) => i + 1).map(num => (
                        <div key={num} className="col-span-2 relative aspect-square">
                            <BetButton 
                                label={num.toString()}
                                color={COLORS[num] === "red" ? "red" : "black"}
                                betAmount={bets[num.toString()]}
                                onClick={() => placeBet(num.toString(), 10)}
                            />
                        </div>
                    ))}
                </div>

                {/* Outside Bets */}
                <div className="col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <BetButton label="1-18" color="special" onClick={() => placeBet("1-18", 50)} betAmount={bets["1-18"]} subtitle="x2" />
                    <BetButton label="EVEN" color="special" onClick={() => placeBet("even", 50)} betAmount={bets["even"]} subtitle="x2" />
                    <BetButton label="RED" color="red" onClick={() => placeBet("red", 50)} betAmount={bets["red"]} subtitle="x2" />
                    <BetButton label="BLACK" color="black" onClick={() => placeBet("black", 50)} betAmount={bets["black"]} subtitle="x2" />
                    <BetButton label="ODD" color="special" onClick={() => placeBet("odd", 50)} betAmount={bets["odd"]} subtitle="x2" />
                    <BetButton label="19-36" color="special" onClick={() => placeBet("19-36", 50)} betAmount={bets["19-36"]} subtitle="x2" />
                </div>
            </div>
       </div>
    </div>
  );
}

function BetButton({ label, color, onClick, betAmount, subtitle, fullHeight }: { label: string, color: string, onClick: () => void, betAmount?: number, subtitle?: string, fullHeight?: boolean }) {
    const bg = color === "red" ? "bg-red-700 hover:bg-red-600" : 
               color === "black" ? "bg-zinc-800 hover:bg-zinc-700" : 
               color === "green" ? "bg-green-700 hover:bg-green-600" :
               "bg-green-900/50 hover:bg-green-800/50 border-2 border-green-500/20"; // Special
    
    return (
        <button 
           onClick={onClick}
           className={`
             w-full ${fullHeight ? 'h-full min-h-[60px]' : 'h-full aspect-auto'} 
             ${bg} rounded-md flex flex-col items-center justify-center relative transition-all active:scale-95 shadow-sm
           `}
        >
            <span className="text-white font-bold text-sm sm:text-base shadow-black drop-shadow-md">{label}</span>
            {subtitle && <span className="text-[10px] text-white/50">{subtitle}</span>}
            
            {betAmount && (
                <motion.div 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }}
                   className="absolute -top-2 -right-2 z-20"
                >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 border border-yellow-700 shadow-md flex items-center justify-center">
                        <span className="text-[8px] sm:text-[10px] font-black text-yellow-900 leading-none">
                           {betAmount >= 1000 ? (betAmount/1000).toFixed(1)+'k' : betAmount}
                        </span>
                    </div>
                </motion.div>
            )}
        </button>
    )
}

import { AnimatePresence } from "framer-motion";
