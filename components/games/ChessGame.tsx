"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<"local" | "ai" | "online" | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [winner, setWinner] = useState<string | null>(null);

  // Online State
  const [peerId, setPeerId] = useState<string | null>(null);
  const [conn, setConn] = useState<any>(null);
  const [joinId, setJoinId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Initialize PeerJS
  useEffect(() => {
    if (gameMode === "online" && !peerId && typeof window !== 'undefined') {
        const initPeer = async () => {
             try {
                const { Peer } = await import("peerjs");
                const peer = new Peer();
                
                peer.on("open", (id: string) => {
                    setPeerId(id);
                });

                peer.on("connection", (connection) => {
                    setConn(connection);
                    setupConnection(connection);
                });
                
                peer.on("error", (err: any) => {
                    console.error("PeerJS Error:", err);
                    alert("Connection Error. Please refresh.");
                });

                return peer; 
             } catch (e) {
                 console.error("Failed to load PeerJS", e);
             }
        };
        initPeer();
    }
  }, [gameMode, peerId]);

  function setupConnection(connection: any) {
      connection.on("data", (data: any) => {
          if (data.type === "move") {
              const gameCopy = new Chess(data.fen);
              setGame(gameCopy);
              checkGameOver(gameCopy);
          } else if (data.type === "reset") {
              resetGame(false); 
          }
      });
      connection.on("open", () => {
          console.log("Connected!");
      });
  }

  function joinGame() {
       if (!joinId || !gameMode) return;
       import("peerjs").then(({ Peer }) => {
           const peer = new Peer();
           peer.on("open", () => {
               const connection = peer.connect(joinId);
               setConn(connection);
               setupConnection(connection);
               setIsHost(false);
           });
       });
  }

  // Game Logic
  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
       checkGameOver();
       return;
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    setTimeout(() => {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(possibleMoves[randomIndex]);
        setGame(gameCopy);
        checkGameOver(gameCopy);
    }, 500);
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (winner) return false;
    
    // Online Turn Validation
    if (gameMode === "online" && conn) {
        if (isHost && game.turn() === 'b') return false; 
        if (!isHost && game.turn() === 'w') return false; 
    }

    const gameCopy = new Chess(game.fen());
    try {
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (move === null) return false;

        setGame(gameCopy);
        checkGameOver(gameCopy);
        
        // Broadcast Move
        if (gameMode === "online" && conn) {
            conn.send({ type: "move", fen: gameCopy.fen() });
        }

        // AI Response
        if (gameMode === "ai" && !gameCopy.isGameOver()) {
            makeRandomMove();
        }
        
        return true;
    } catch (error) {
        return false;
    }
  }

  function checkGameOver(currentGame = game) {
      if (currentGame.isCheckmate()) {
          setWinner(currentGame.turn() === "w" ? "Black" : "White");
      } else if (currentGame.isDraw() || currentGame.isStalemate() || currentGame.isThreefoldRepetition()) {
          setWinner("Draw");
      }
  }

  function resetGame(emit = true) {
      setGame(new Chess());
      setWinner(null);
      if (gameMode === "online" && conn && emit) {
          conn.send({ type: "reset" });
      }
  }

  // UI Components
  const ModeSelection = () => (
      <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
             onClick={() => setGameMode("local")}
             className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-between"
          >
              <span>👥 Local Multiplayer</span>
              <span className="text-sm opacity-70">Play vs Friend</span>
          </button>
          
          <button 
             onClick={() => { setGameMode("ai"); setDifficulty("easy"); }}
             className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-between"
          >
              <span>🤖 Play vs AI</span>
              <span className="text-sm opacity-70">Easy Random</span>
          </button>
          
          <button 
             onClick={() => setGameMode("online")}
             className="p-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-between"
          >
              <span>🌍 Online PvP</span>
              <span className="text-sm opacity-70">Room Code</span>
          </button>
      </div>
  );

  const OnlineLobby = () => (
      <div className="flex flex-col gap-4 w-full max-w-sm bg-gray-800 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white text-center mb-4">Online Lobby</h3>
          {!conn ? (
              <>
                  <div className="bg-black/40 p-4 rounded text-center">
                      <p className="text-gray-400 text-xs mb-1">Your Room Code:</p>
                      <div className="text-2xl font-mono text-green-400 font-bold tracking-widest select-all cursor-pointer"
                           onClick={() => {navigator.clipboard.writeText(peerId || "")}}
                      >
                          {peerId || "Generating..."}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Share this code with your friend</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-300">Or join existing room:</p>
                      <div className="flex gap-2">
                          <input 
                             type="text" 
                             className="flex-grow bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono"
                             placeholder="Enter Code..."
                             value={joinId}
                             onChange={(e) => setJoinId(e.target.value)}
                          />
                          <button 
                             onClick={joinGame}
                             className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold text-white"
                          >
                              JOIN
                          </button>
                      </div>
                  </div>
              </>
          ) : (
             <div className="text-center py-4">
                 <div className="text-green-500 text-lg font-bold mb-2">● Connected!</div>
                 <button 
                    onClick={() => setIsHost(true)} 
                    className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold"
                 >
                     Start Game
                 </button>
             </div>
          )}
           <button onClick={() => setGameMode(null)} className="text-gray-500 text-sm mt-4">Cancel</button>
      </div>
  );

  if (!isClientLoaded) return null; // Hydration fix

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {!gameMode ? (
          <ModeSelection />
      ) : gameMode === "online" && !conn ? (
          <OnlineLobby />
      ) : (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full flex flex-col items-center"
        >
            <div className="w-full flex justify-between mb-4 items-center px-2">
                <button 
                   onClick={() => { setGameMode(null); resetGame(); setConn(null); }}
                   className="text-gray-400 hover:text-white text-sm"
                >
                    ← Exit
                </button>
                <div className="font-bold text-white text-lg">
                    {winner ? (
                        <span className="text-yellow-400">
                           {winner === "Draw" ? "Game Drawn!" : `${winner} Wins! 🎉`}
                        </span>
                    ) : (
                        <span>
                           Turn: <span className={game.turn() === "w" ? "text-white" : "text-gray-400"}>
                               {game.turn() === "w" ? "White" : "Black"}
                           </span>
                        </span>
                    )}
                </div>
                 <button 
                   onClick={() => resetGame(true)}
                   className="text-blue-400 hover:text-blue-300 text-sm font-bold"
                >
                    Reset
                </button>
            </div>

            <div className="w-full aspect-square max-w-[400px] border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl relative">
                <Chessboard 
                    position={game.fen()} 
                    onPieceDrop={onDrop}
                    boardOrientation={gameMode === "online" && !isHost ? "black" : "white"}
                    customDarkSquareStyle={{ backgroundColor: "#779556" }}
                    customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
                />
            </div>
            
            <div className="mt-4 text-xs text-center text-gray-500">
                {gameMode === 'local' ? 'Pass device given turns' : 
                 gameMode === 'online' ? `You are ${isHost ? 'White (Host)' : 'Black (Client)'}` : 
                 'You play as White'}
            </div>
        </motion.div>
      )}
    </div>
  );
}
