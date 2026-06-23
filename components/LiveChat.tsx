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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[370px] max-w-[370px] bg-background/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-4 flex justify-between items-center shadow-md">
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white overflow-hidden">
                      <img src="/projects/my.png" alt="Nvy" className="w-full h-full object-cover" /> 
                   </div>
                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-primary rounded-full"></span>
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
            <div className="h-[350px] p-4 overflow-y-auto bg-surface/30 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
               <p className="text-center text-xs text-muted my-4">Today</p>
               
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-white/[0.06] text-gray-200 rounded-bl-sm border border-white/[0.06]'
                     }`}>
                        {msg.type === 'contact' ? (
                          <div className="flex flex-col gap-2">
                            <p className="mb-2">{msg.text}</p>
                            <div className="flex gap-2">
                              <a 
                                href="https://wa.me/6281913715220?text=Halo,%20saya%20ingin%20tanya%20jasa%20Nvy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-success/20 hover:bg-success/30 text-success border border-success/20 px-3 py-2 rounded-lg text-xs transition-colors font-medium"
                              >
                                <MessageSquare size={14} /> WhatsApp
                              </a>
                              <a 
                                href="mailto:ahmadshawity@gmail.com" 
                                className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/20 px-3 py-2 rounded-lg text-xs transition-colors font-medium"
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
                                 strong: ({node, ...props}) => <strong className="font-bold text-primary-light" {...props} />,
                                 a: ({node, ...props}) => <a className="underline hover:text-primary-light" target="_blank" rel="noopener noreferrer" {...props} />
                               }}
                             >
                               {msg.text}
                             </ReactMarkdown>
                           </div>
                        )}
                       
                       <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-muted'}`}>
                         {msg.time}
                       </p>
                    </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white/[0.06] p-3 rounded-2xl rounded-bl-sm flex gap-1 border border-white/[0.06]">
                       <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75"></span>
                       <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150"></span>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-background/80 border-t border-white/[0.06] flex gap-2">
               <input 
                 type="text" 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Type a message..." 
                 className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
               />
               <button 
                 type="submit" 
                 disabled={!message.trim()}
                 className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white disabled:opacity-30 hover:bg-primary/90 transition-all hover:shadow-[0_4px_15px_-4px_rgba(59,130,246,0.4)]"
               >
                 <Send size={18} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-primary hover:bg-primary/90 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all hover:scale-105 hover:shadow-primary/30"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <>
             <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
