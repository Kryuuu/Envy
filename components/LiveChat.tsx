"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'bot', time: string, type?: 'text' | 'contact'}>>([
    { id: 1, text: "Halo! 👋 Ada yang bisa saya bantu dengan project Anda?", sender: "bot", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: 'text' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMsg = { 
      id: Date.now(), 
      text: message, 
      sender: "user" as const,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: 'text' as const
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUserMsg.text }),
      });
      
      const data = await response.json();
      
      setIsTyping(false);

      if (response.status === 429 || data.text === "limit_reached") {
         const limitMsg = {
            id: Date.now() + 1,
            text: "Mohon maaf, sistem AI sedang sibuk/limit. Silakan hubungi admin langsung untuk respon cepat.",
            sender: "bot" as const,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: 'contact' as const
         };
         setMessages(prev => [...prev, limitMsg]);
      } else {
         const botReply = {
            id: Date.now() + 1,
            text: data.text || "Maaf, saya tidak mengerti.",
            sender: "bot" as const,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: 'text' as const
         };
         setMessages(prev => [...prev, botReply]);
      }

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const errorReply = {
         id: Date.now() + 1,
         text: "Maaf, koneksi terputus.",
         sender: "bot" as const,
         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
         type: 'text' as const
       };
       setMessages(prev => [...prev, errorReply]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center shadow-md">
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white overflow-hidden">
                       <img src="/projects/my.png" alt="Admin" className="w-full h-full object-cover" /> 
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Nvy AI</h3>
                    <p className="text-blue-100 text-xs">Always Active</p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                 <ChevronDown size={20} />
               </button>
            </div>

            {/* Chat Area */}
            <div className="h-[350px] p-4 overflow-y-auto bg-white/5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
               <p className="text-center text-xs text-gray-500 my-4">Today</p>
               
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white/10 text-gray-200 rounded-bl-none'
                     }`}>
                        {msg.type === 'contact' ? (
                          <div className="flex flex-col gap-2">
                            <p className="mb-2">{msg.text}</p>
                            <div className="flex gap-2">
                              <a 
                                href="https://wa.me/6281913715220?text=Halo,%20saya%20ingin%20tanya%20jasa%20Envy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs transition-colors"
                              >
                                <MessageSquare size={14} /> WhatsApp
                              </a>
                              <a 
                                href="mailto:ahmadshawity@gmail.com" 
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs transition-colors"
                              >
                                <Mail size={14} /> Email
                              </a>
                            </div>
                          </div>
                        ) : (
                           <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-left">
                             <ReactMarkdown
                               components={{
                                 p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                                 ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                 ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                 li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                                 strong: ({node, ...props}) => <strong className="font-bold text-yellow-300" {...props} />,
                                 a: ({node, ...props}) => <a className="underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />
                               }}
                             >
                               {msg.text}
                             </ReactMarkdown>
                           </div>
                        )}
                       
                       <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                         {msg.time}
                       </p>
                    </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-black/50 border-t border-white/10 flex gap-2">
               <input 
                 type="text" 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Type a message..." 
                 className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
               />
               <button 
                 type="submit" 
                 disabled={!message.trim()}
                 className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
               >
                 <Send size={18} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
             <MessageSquare className="w-6 h-6" />
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
