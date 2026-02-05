"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface GameProps {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  genre: string;
  platform: string;
  game_url: string;
}

export default function GameCard({ game, index }: { game: GameProps; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white border border-white/10">
          {game.genre}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {game.short_description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
           <span className="text-xs text-gray-500 flex items-center gap-1">
            {game.platform === "PC (Windows)" ? "🖥️ PC" : "🌐 Browser"}
           </span>
           <Link 
             href={game.game_url} 
             target="_blank"
             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
           >
             Play Now
           </Link>
        </div>
      </div>
    </motion.div>
  );
}
