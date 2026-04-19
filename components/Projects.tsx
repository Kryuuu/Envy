"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, PlayCircle, X, Music2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Project {
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

import projectsData from "@/data/projects.json";

interface Project {
  id?: string;
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

const projects: Project[] = projectsData;

export default function Projects() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-gray-400 mb-8">Selected works from my portfolio.</p>
          
          <a 
            href="/projects" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:scale-105 group"
          >
            See All Projects 
            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1"
            >
              <div className="aspect-video bg-gray-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                
                {/* YouTube Video Handling */}
                {project.youtubeId ? (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => setSelectedVideo(`youtube:${project.youtubeId}`)}>
                        <img 
                            src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-16 h-16 text-white/90 group-hover:text-red-600 transition-colors hover:scale-110 transform duration-300" />
                        </div>
                    </div>
                ) : project.tiktokId ? (
                    /* TikTok Video Handling */
                    <div className="w-full h-full relative cursor-pointer" onClick={() => setSelectedVideo(`tiktok:${project.tiktokId}`)}>
                        <img 
                            src={project.image || ""}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-16 h-16 text-white/90 group-hover:text-[#fe2c55] transition-colors hover:scale-110 transform duration-300" />
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1">
                            <svg viewBox="0 0 48 48" className="w-4 h-4" fill="none">
                                <path d="M34.1451 13.3456C32.7321 12.1858 31.7891 10.4804 31.7891 8.5625H27.1016V28.2969C27.1016 30.6484 25.1953 32.5547 22.8438 32.5547C20.4922 32.5547 18.5859 30.6484 18.5859 28.2969C18.5859 25.9453 20.4922 24.0391 22.8438 24.0391C23.3203 24.0391 23.7773 24.1172 24.2031 24.2578V19.5078C23.7578 19.4453 23.3047 19.4062 22.8438 19.4062C17.9375 19.4062 13.9531 23.3906 13.9531 28.2969C13.9531 33.2031 17.9375 37.1875 22.8438 37.1875C27.75 37.1875 31.7344 33.2031 31.7344 28.2969V18.1562C33.6172 19.5547 35.9375 20.375 38.4375 20.375V15.7422C36.8438 15.7422 35.3672 15.1953 34.1451 13.3456Z" fill="white"/>
                            </svg>
                            <span className="text-white/80 text-xs font-medium">TikTok</span>
                        </div>
                    </div>
                ) : (
                    /* Local Video Handling */
                    project.videoSrc ? (
                        <div className="w-full h-full relative cursor-pointer" onClick={() => setSelectedVideo(project.videoSrc!)}>
                            <video 
                                src={project.videoSrc} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                muted
                                playsInline
                                onMouseOver={event => (event.target as HTMLVideoElement).play()}
                                onMouseOut={event => (event.target as HTMLVideoElement).pause()}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-primary transition-colors hover:scale-110 transform duration-300" />
                            </div>
                        </div>
                    ) : ( 
                        /* Image Handling */
                        project.image.startsWith("http") || project.image.startsWith("/") ? (
                           <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-xl">
                              {project.title} Preview
                           </div>
                        )
                    )
                )}
                
                {/* Overlay for non-video projects */}
                {(!project.videoSrc && !project.youtubeId && !project.tiktokId && project.link !== "#") && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all"
                        >
                          Visit Project <ExternalLink size={18} />
                        </a>
                    </div>
                )}
              </div>
              
              <div className="p-6 relative z-20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-primary text-sm font-medium mb-2 block">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  </div>
                  {/* Link Icon Logic */}
                  {project.link !== "#" && !project.videoSrc && !project.youtubeId && !project.tiktokId && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {/* Play Button Icon Logic */}
                  {(project.videoSrc || project.youtubeId || project.tiktokId) && (
                     <button onClick={() => setSelectedVideo(project.tiktokId ? `tiktok:${project.tiktokId}` : project.youtubeId ? `youtube:${project.youtubeId}` : project.videoSrc!)} className="text-gray-400 hover:text-primary transition-colors">
                        <PlayCircle size={20} />
                     </button>
                  )}
                </div>
                
                <p className="text-gray-400 mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
    </section>
  );
}
