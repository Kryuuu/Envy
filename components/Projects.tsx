"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, X, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

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
  problem?: string;
  solution?: string;
  impact?: string;
}

import projectsData from "@/data/projects.json";

const projects: Project[] = projectsData;

export default function Projects() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayedProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="relative py-32 section-glow">
      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[180px]" />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="section-badge mb-6 block w-fit">
              {t.projects.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {t.projects.title1}
              <span className="gradient-text">{t.projects.title2}</span>
            </h2>
          </div>
          <a
            href="/projects"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.09] hover:shadow-[0_8px_30px_-14px_rgba(59,130,246,0.55)]"
          >
            {t.projects.viewAll}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative rounded-2xl overflow-hidden glass-card glass-card-hover"
            >
              {/* Project Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                {project.youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : project.tiktokId ? (
                  <div className="relative w-full h-full">
                    <img
                      src={project.image || ""}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* TikTok badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                      <svg viewBox="0 0 48 48" className="w-3.5 h-3.5" fill="none">
                        <path d="M34.1451 13.3456C32.7321 12.1858 31.7891 10.4804 31.7891 8.5625H27.1016V28.2969C27.1016 30.6484 25.1953 32.5547 22.8438 32.5547C20.4922 32.5547 18.5859 30.6484 18.5859 28.2969C18.5859 25.9453 20.4922 24.0391 22.8438 24.0391C23.3203 24.0391 23.7773 24.1172 24.2031 24.2578V19.5078C23.7578 19.4453 23.3047 19.4062 22.8438 19.4062C17.9375 19.4062 13.9531 23.3906 13.9531 28.2969C13.9531 33.2031 17.9375 37.1875 22.8438 37.1875C27.75 37.1875 31.7344 33.2031 31.7344 28.2969V18.1562C33.6172 19.5547 35.9375 20.375 38.4375 20.375V15.7422C36.8438 15.7422 35.3672 15.1953 34.1451 13.3456Z" fill="white"/>
                      </svg>
                      <span className="text-[11px] font-semibold text-white/90">TikTok</span>
                    </div>
                  </div>
                ) : project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
                    <span className="text-muted text-sm">Preview</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play button for video content */}
                {(project.videoSrc || project.youtubeId || project.tiktokId) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(
                        project.tiktokId
                          ? `tiktok:${project.tiktokId}`
                          : project.youtubeId
                          ? `youtube:${project.youtubeId}`
                          : project.videoSrc!
                      );
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/20 hover:scale-110"
                  >
                    <PlayCircle className="w-6 h-6 text-white" />
                  </button>
                )}

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 backdrop-blur-md border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 md:p-8">
                {/* Title */}
                <h3 className="text-xl font-bold text-white mt-1 mb-3 leading-tight group-hover:text-primary-light transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t.projects.viewProject}
                    </a>
                  )}
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${
                selectedVideo.startsWith("tiktok:")
                  ? "w-full max-w-sm aspect-[9/16]"
                  : "w-full max-w-5xl aspect-video"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <X size={18} />
              </button>

              {selectedVideo.startsWith("youtube:") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.split(":")[1]}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideo.startsWith("tiktok:") ? (
                <iframe
                  src={`https://www.tiktok.com/player/v1/${selectedVideo.split(":")[1]}?autoplay=1&music_info=1&description=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope"
                  allowFullScreen
                />
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
