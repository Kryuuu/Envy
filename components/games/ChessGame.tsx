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
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

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

                peer.on("connection", (connection: any) => {
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
              updateGameState(gameCopy);
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

  // AI Turn Handling
  useEffect(() => {
    if (gameMode === "ai" && game.turn() === "b" && !game.isGameOver()) {
       // Add a small delay for better UX (so it feels like "thinking" and doesn't snap instantly)
       const timer = setTimeout(() => {
           makeAiMove();
       }, 1000); 
       return () => clearTimeout(timer);
    }
  }, [game, gameMode]);

  function makeAiMove() {
     // Safety check in case component unmounted or state changed rapidly
     if (game.isGameOver() || game.isDraw() || game.turn() !== 'b') return;

    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    let move;
    
    // 1. Try to find a capture (Simple Heuristic)
    const captures = possibleMoves.filter((m: any) => m.captured);
    if (captures.length > 0) {
        // Prepare to sort captures by value if we wanted 'smarter' AI
        // For now, random capture is better than purely random move
        move = captures[Math.floor(Math.random() * captures.length)];
    } else {
        // 2. Otherwise random move
        move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    const gameCopy = new Chess(game.fen());
    try {
        const result = gameCopy.move(move.san); 
        if (result) {
            setGame(gameCopy);
            updateGameState(gameCopy);
        }
    } catch (e) {
        console.error("AI Move Failed", e);
    }
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (winner) return false;
    
    // Online Turn Validation
    if (gameMode === "online" && conn) {
        if (isHost && game.turn() === 'b') return false; 
        if (!isHost && game.turn() === 'w') return false; 
    }

    // AI Turn Guard - Prevent user from moving for AI
    if (gameMode === "ai" && game.turn() === "b") return false;

    const gameCopy = new Chess(game.fen());
    try {
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (move === null) return false;

        setGame(gameCopy);
        updateGameState(gameCopy);
        
        // Broadcast Move
        if (gameMode === "online" && conn) {
            conn.send({ type: "move", fen: gameCopy.fen() });
        }
        
        return true;
    } catch (error) {
        return false;
    }
  }

  function updateGameState(currentGame: Chess) {
      setMoveHistory(currentGame.history());
      checkGameOver(currentGame);
  }

  function checkGameOver(currentGame = game) {
      if (currentGame.isCheckmate()) {
          setWinner(currentGame.turn() === "w" ? "Black" : "White");
      } else if (currentGame.isDraw() || currentGame.isStalemate() || currentGame.isThreefoldRepetition()) {
          setWinner("Draw");
      }
  }

  function resetGame(emit = true) {
      const newGame = new Chess();
      setGame(newGame);
      setWinner(null);
      setMoveHistory([]);
      if (gameMode === "online" && conn && emit) {
          conn.send({ type: "reset" });
      }
  }

  // Helper: Calculate Material Difference
  const getMaterial = (fen: string) => {
      // Simplified: Just count piece values
      const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      const board = new Chess(fen).board();
      let w = 0, b = 0;
      board.forEach(row => row.forEach(piece => {
          if (!piece) return;
          if (piece.color === 'w') w += pieceValues[piece.type];
          else b += pieceValues[piece.type];
      }));
      return { w, b, diff: w - b };
  };

  const material = getMaterial(game.fen());

  // UI Components
  const ModeSelection = () => (
      <div className="flex flex-col items-center gap-6 w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">CHESS ARENA</h2>
          <div className="grid grid-cols-1 gap-4 w-full">
              <button 
                 onClick={() => setGameMode("local")}
                 className="group p-6 bg-[#262522] hover:bg-[#3d3b38] rounded-xl border-l-4 border-green-500 shadow-xl flex items-center gap-4 transition-all"
              >
                  <span className="text-4xl">👥</span>
                  <div className="text-left">
                      <div className="font-bold text-gray-200 text-lg group-hover:text-green-400 transition-colors">Pass & Play</div>
                      <div className="text-sm text-gray-500">Local multiplayer on this device</div>
                  </div>
              </button>
              
              <button 
                 onClick={() => { setGameMode("ai"); setDifficulty("easy"); }}
                 className="group p-6 bg-[#262522] hover:bg-[#3d3b38] rounded-xl border-l-4 border-blue-500 shadow-xl flex items-center gap-4 transition-all"
              >
                  <span className="text-4xl">🤖</span>
                  <div className="text-left">
                      <div className="font-bold text-gray-200 text-lg group-hover:text-blue-400 transition-colors">Vs Computer</div>
                      <div className="text-sm text-gray-500">Challenge the engine</div>
                  </div>
              </button>
              
              <button 
                 onClick={() => setGameMode("online")}
                 className="group p-6 bg-[#262522] hover:bg-[#3d3b38] rounded-xl border-l-4 border-purple-500 shadow-xl flex items-center gap-4 transition-all"
              >
                  <span className="text-4xl">🌍</span>
                  <div className="text-left">
                      <div className="font-bold text-gray-200 text-lg group-hover:text-purple-400 transition-colors">Online PvP</div>
                      <div className="text-sm text-gray-500">Play via Room Code</div>
                  </div>
              </button>
          </div>
      </div>
  );

  const OnlineLobby = () => (
      <div className="bg-[#262522] p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
          <button onClick={() => setGameMode(null)} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2">← Back</button>
          <h3 className="text-2xl font-bold text-white mb-6">Online Lobby</h3>
          {!conn ? (
              <div className="space-y-6">
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Your Room Code</p>
                      <div className="flex items-center justify-between bg-black/40 rounded p-3">
                          <code className="text-green-400 font-mono font-bold text-xl">{peerId || "Generating..."}</code>
                          <button onClick={() => navigator.clipboard.writeText(peerId || "")} className="text-gray-500 hover:text-white">📋</button>
                      </div>
                  </div>
                  
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                      <div className="relative flex justify-center"><span className="bg-[#262522] px-2 text-sm text-gray-500">OR</span></div>
                  </div>

                  <div className="space-y-2">
                       <p className="text-gray-400 text-xs uppercase tracking-widest">Join Room</p>
                       <div className="flex gap-2">
                           <input 
                              type="text" 
                              className="flex-grow bg-[#1e1d1b] border border-gray-600 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-green-500 transition-colors"
                              placeholder="Enter Code..."
                              value={joinId}
                              onChange={(e) => setJoinId(e.target.value)}
                           />
                           <button 
                              onClick={joinGame}
                              className="bg-green-600 hover:bg-green-500 px-6 rounded-lg font-bold text-white shadow-lg transition-all"
                           >
                               JOIN
                           </button>
                       </div>
                  </div>
              </div>
          ) : (
             <div className="text-center py-8">
                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔗</div>
                 <h4 className="text-white font-bold text-lg mb-2">Connected!</h4>
                 <p className="text-gray-400 text-sm mb-6">Ready to start the match.</p>
                 <button 
                    onClick={() => setIsHost(true)} 
                    className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-bold shadow-lg transition-all"
                 >
                     START GAME
                 </button>
             </div>
          )}
      </div>
  );

  const MoveList = () => (
      <div className="bg-[#262522] rounded-lg overflow-hidden flex flex-col h-[300px] lg:h-[400px]">
          <div className="bg-[#21201d] px-4 py-2 text-gray-400 text-sm font-bold border-b border-gray-700">Move History</div>
          <div className="flex-grow overflow-y-auto p-2 font-mono text-sm scrollbar-thin scrollbar-thumb-gray-600">
              <div className="grid grid-cols-[3rem_1fr_1fr] gap-y-1">
                  {moveHistory.map((move, i) => {
                      if (i % 2 !== 0) return null; // Only render pairs
                      return (
                          <div key={i} className="contents text-gray-300">
                              <div className="bg-[#302e2b] text-gray-500 text-center py-1">{(i/2)+1}.</div>
                              <div className="pl-3 py-1 hover:bg-white/5 rounded cursor-pointer">{move}</div>
                              <div className="pl-3 py-1 hover:bg-white/5 rounded cursor-pointer">{moveHistory[i+1] || ""}</div>
                          </div>
                      );
                  })}
              </div>
              {/* Dummy auto-scroll anchor */}
              <div className="h-4"></div> 
          </div>
      </div>
  );

  if (!isClientLoaded) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 min-h-[600px] bg-[#312e2b] rounded-none sm:rounded-xl shadow-2xl">
      {!gameMode ? (
          <div className="py-20"><ModeSelection /></div>
      ) : gameMode === "online" && !conn ? (
          <div className="py-20"><OnlineLobby /></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
            {/* Left/Top Sidebar (Opponent Info) */}
            <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
                 {/* Opponent Profile */}
                <div className="bg-[#262522] p-4 rounded-lg flex items-center gap-3 border-b-4 border-gray-700">
                     <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-xl">👤</div>
                     <div>
                         <div className="font-bold text-gray-200">
                              {gameMode === 'ai' ? 'Stockfish (AI)' : 'Opponent'}
                              {gameMode === 'ai' && game.turn() === 'b' && !winner && (
                                  <span className="ml-2 text-xs text-yellow-500 animate-pulse">Thinking...</span>
                              )}
                         </div>
                         <div className="text-xs text-gray-500">Rating: 800</div>
                     </div>
                 </div>
                 
                 {/* Material Advantage */}
                 <div className="flex gap-1 h-6">
                     {material.diff < 0 && (
                         <div className="bg-[#262522] text-xs text-white px-2 rounded-sm flex items-center">
                             +{Math.abs(material.diff)}
                         </div>
                     )}
                     {/* Captured Pieces Visuals can go here */}
                 </div>
            </div>

            {/* Main Board Area */}
            <div className="flex-grow flex flex-col items-center justify-center">
                 {/* Mobile Opponent Info */}
                 <div className="lg:hidden w-full flex justify-between items-center mb-2 px-2 text-gray-300">
                      <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">👤</div>
                          <span className="font-bold text-sm">{gameMode === 'ai' ? 'AI' : 'Opponent'}</span>
                      </div>
                      {material.diff < 0 && <span className="bg-gray-700 text-xs px-2 py-1 rounded">+{Math.abs(material.diff)}</span>}
                 </div>

                 <div className="w-[300px] sm:w-[450px] lg:w-[500px] shadow-2xl relative">
                    <Chessboard 
                        position={game.fen()} 
                        onPieceDrop={onDrop}
                        boardOrientation={gameMode === "online" && !isHost ? "black" : "white"}
                        customDarkSquareStyle={{ backgroundColor: "#769656" }} // Chess.com Green
                        customLightSquareStyle={{ backgroundColor: "#eeeed2" }} // Off-white
                        customBoardStyle={{
                            borderRadius: "4px",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
                        }}
                    />
                    
                    {winner && (
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded">
                             <div className="bg-[#262522] p-8 rounded-xl shadow-2xl text-center border border-white/10">
                                 <h2 className="text-3xl font-black text-white mb-2">{winner === "Draw" ? "🤝 DRAW" : `${winner === "White" ? "🏳️ WHITE" : "🏴 BLACK"} WINS`}</h2>
                                 <div className="flex gap-3 justify-center mt-6">
                                     <button onClick={() => resetGame(true)} className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded font-bold text-white shadow-lg">Rematch</button>
                                     <button onClick={() => setGameMode(null)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-bold text-gray-200">Main Menu</button>
                                 </div>
                             </div>
                         </div>
                    )}
                 </div>

                 {/* Mobile Player Info */}
                 <div className="lg:hidden w-full flex justify-between items-center mt-2 px-2 text-gray-300">
                      <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">👤</div>
                          <span className="font-bold text-sm">You</span>
                      </div>
                      {material.diff > 0 && <span className="bg-gray-700 text-xs px-2 py-1 rounded">+{material.diff}</span>}
                 </div>
            </div>

            {/* Right Sidebar (History & Controls) */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
                 <MoveList />
                 
                 {/* Game Controls */}
                 <div className="bg-[#262522] p-4 rounded-lg grid grid-cols-2 gap-2">
                     <button onClick={() => resetGame(true)} className="bg-[#3d3b38] hover:bg-[#4a4845] py-3 rounded text-gray-300 font-bold text-sm flex items-center justify-center gap-2">
                         <span>🏳️</span> Resign
                     </button>
                     <button className="bg-[#3d3b38] hover:bg-[#4a4845] py-3 rounded text-gray-300 font-bold text-sm flex items-center justify-center gap-2">
                         <span>🤝</span> Draw
                     </button>
                     <button onClick={() => setGameMode(null)} className="col-span-2 bg-[#3d3b38] hover:bg-gray-700 py-3 rounded text-gray-400 hover:text-white font-bold text-sm">
                         Back to Menu
                     </button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
}
