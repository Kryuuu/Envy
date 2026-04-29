"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, PlayCircle, X, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import projectsData from "@/data/projects.json";



interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  videoSrc?: string;
  youtubeId?: string;
  tiktokId?: string;
  description: string;
  tags: string[];
  link: string;
}

const projects: Project[] = projectsData as unknown as Project[];

export default function AllProjects() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
           <Link 
             href="/" 
             className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden md:block"
           >
             <ArrowLeft className="text-white" />
           </Link>
           <motion.h1 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-6xl font-bold text-white mb-4"
           >
             All Projects
           </motion.h1>
           <p className="text-gray-400 max-w-2xl mx-auto">
             Explore my complete portfolio of development, design, and creative works.
           </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative h-[400px] sm:h-[420px] w-full [perspective:1000px] cursor-pointer md:cursor-default"
            >
              <div 
                 className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedIndex === index ? '[transform:rotateY(180deg)]' : ''}`}
                 onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
              >
                
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex flex-col">
                   <div className="w-full h-full relative overflow-hidden">
                      {project.youtubeId ? (
                          <img 
                              src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                              alt={project.title}
                              className="w-full h-full object-cover"
                          />
                      ) : project.tiktokId ? (
                          <div className="w-full h-full relative">
                              <img 
                                  src={project.image || ""}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1 z-10">
                                  <svg viewBox="0 0 48 48" className="w-4 h-4" fill="none">
                                      <path d="M34.1451 13.3456C32.7321 12.1858 31.7891 10.4804 31.7891 8.5625H27.1016V28.2969C27.1016 30.6484 25.1953 32.5547 22.8438 32.5547C20.4922 32.5547 18.5859 30.6484 18.5859 28.2969C18.5859 25.9453 20.4922 24.0391 22.8438 24.0391C23.3203 24.0391 23.7773 24.1172 24.2031 24.2578V19.5078C23.7578 19.4453 23.3047 19.4062 22.8438 19.4062C17.9375 19.4062 13.9531 23.3906 13.9531 28.2969C13.9531 33.2031 17.9375 37.1875 22.8438 37.1875C27.75 37.1875 31.7344 33.2031 31.7344 28.2969V18.1562C33.6172 19.5547 35.9375 20.375 38.4375 20.375V15.7422C36.8438 15.7422 35.3672 15.1953 34.1451 13.3456Z" fill="white"/>
                                  </svg>
                                  <span className="text-white/80 text-xs font-medium">TikTok</span>
                              </div>
                          </div>
                      ) : project.videoSrc ? (
                          <video 
                              src={project.videoSrc} 
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              loop
                              autoPlay
                          />
                      ) : project.image && (project.image.startsWith("http") || project.image.startsWith("/")) ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600 font-bold text-xl">
                              {project.title} Preview
                          </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                         <span className="text-primary text-sm font-medium mb-2 block">{project.category}</span>
                         <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      </div>
                   </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-gray-900 border border-primary/50 p-6 flex flex-col z-20">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-6 flex-1">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-auto">
                        {project.link !== "#" && (
                            <a href={project.link} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium text-sm">
                              <ExternalLink size={16} /> Visit
                            </a>
                        )}
                        {(project.videoSrc || project.youtubeId || project.tiktokId) && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedVideo(project.tiktokId ? `tiktok:${project.tiktokId}` : project.youtubeId ? `youtube:${project.youtubeId}` : project.videoSrc!); }} 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 rounded-lg transition-colors font-medium text-sm"
                            >
                                <PlayCircle size={16} /> Watch
                            </button>
                        )}
                    </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0.9 }}
               className={`relative bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 ${
                 selectedVideo.startsWith("tiktok:") 
                   ? "w-full max-w-sm aspect-[9/16]" 
                   : "w-full max-w-5xl aspect-video"
               }`}
               onClick={(e) => e.stopPropagation()}
            >
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
                >
                    <X size={24} />
                </button>
                
                {selectedVideo.startsWith("youtube:") ? (
                   <iframe 
                     src={`https://www.youtube.com/embed/${selectedVideo.split(":")[1]}?autoplay=1`} 
                     className="w-full h-full"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                ) : selectedVideo.startsWith("tiktok:") ? (
                   <iframe 
                     src={`https://www.tiktok.com/player/v1/${selectedVideo.split(":")[1]}?autoplay=1&music_info=1&description=1`} 
                     className="w-full h-full"
                     allow="accelerometer; autoplay; encrypted-media; gyroscope" 
                     allowFullScreen
                   ></iframe>
                ) : (
                   <video 
                     src={selectedVideo} 
                     controls 
                     autoPlay 
                     className="w-full h-full"
                   />
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
