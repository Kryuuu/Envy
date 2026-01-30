"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Project {
  title: string;
  category: string;
  image: string;
  videoSrc?: string;
  youtubeId?: string;
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
                {(!project.videoSrc && !project.youtubeId && project.link !== "#") && (
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
                  {project.link !== "#" && !project.videoSrc && !project.youtubeId && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {/* Play Button Icon Logic */}
                  {(project.videoSrc || project.youtubeId) && (
                     <button onClick={() => setSelectedVideo(project.youtubeId ? `youtube:${project.youtubeId}` : project.videoSrc!)} className="text-gray-400 hover:text-primary transition-colors">
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
               className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
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
