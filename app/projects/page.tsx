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
  description: string;
  tags: string[];
  link: string;
}

const projects: Project[] = projectsData as unknown as Project[];

export default function AllProjects() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1 h-full flex flex-col"
            >
              <div className="aspect-video bg-gray-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                
                {/* Thumbnail Logic */}
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
                ) : project.videoSrc ? (
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
                ) : project.image && (project.image.startsWith("http") || project.image.startsWith("/")) ? (
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                        <ImageIcon size={48} />
                    </div>
                )}
                
                {/* Overlay Link */}
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
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-primary text-sm font-medium mb-2 block">{project.category}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  </div>
                  
                  {project.link !== "#" && !project.videoSrc && !project.youtubeId && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  
                  {(project.videoSrc || project.youtubeId) && (
                     <button onClick={() => setSelectedVideo(project.youtubeId ? `youtube:${project.youtubeId}` : project.videoSrc!)} className="text-gray-400 hover:text-primary transition-colors">
                        <PlayCircle size={20} />
                     </button>
                  )}
                </div>
                
                <p className="text-gray-400 mb-6 text-sm flex-1">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
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
    </div>
  );
}
