"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NeuralBackground from "@/components/NeuralBackground";
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

const projects: Project[] = projectsData as Project[];

function getPlayableSource(project: Project) {
  if (project.tiktokId) return `tiktok:${project.tiktokId}`;
  if (project.youtubeId) return `youtube:${project.youtubeId}`;
  return project.videoSrc ?? null;
}

function ProjectMedia({
  project,
  playableSource,
  onWatch,
}: {
  project: Project;
  playableSource: string | null;
  onWatch: (source: string) => void;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-surface">
      {project.youtubeId ? (
        <Image
          src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : project.tiktokId ? (
        <div className="relative h-full w-full">
          <Image
            src={project.image || ""}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M34.1451 13.3456C32.7321 12.1858 31.7891 10.4804 31.7891 8.5625H27.1016V28.2969C27.1016 30.6484 25.1953 32.5547 22.8438 32.5547C20.4922 32.5547 18.5859 30.6484 18.5859 28.2969C18.5859 25.9453 20.4922 24.0391 22.8438 24.0391C23.3203 24.0391 23.7773 24.1172 24.2031 24.2578V19.5078C23.7578 19.4453 23.3047 19.4062 22.8438 19.4062C17.9375 19.4062 13.9531 23.3906 13.9531 28.2969C13.9531 33.2031 17.9375 37.1875 22.8438 37.1875C27.75 37.1875 31.7344 33.2031 31.7344 28.2969V18.1562C33.6172 19.5547 35.9375 20.375 38.4375 20.375V15.7422C36.8438 15.7422 35.3672 15.1953 34.1451 13.3456Z" fill="white" />
            </svg>
            <span className="text-[11px] font-semibold text-white/90">TikTok</span>
          </div>
        </div>
      ) : project.videoSrc ? (
        <video
          src={project.videoSrc}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          playsInline
          loop
          autoPlay
        />
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
          <span className="text-sm font-medium text-muted-foreground">Preview unavailable</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
      <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-light backdrop-blur-md">
        {project.category}
      </div>

      {playableSource && (
        <button
          onClick={() => onWatch(playableSource)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
          aria-label={`Watch ${project.title}`}
        >
          <PlayCircle className="h-3.5 w-3.5" />
          Watch
        </button>
      )}
    </div>
  );
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.link || project.link === "#") return null;

  const className =
    "group/link inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-primary-light";

  if (project.link.startsWith("/")) {
    return (
      <Link href={project.link} className={className}>
        <ExternalLink className="h-4 w-4" />
        <span>View Project</span>
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all duration-300" />
      </Link>
    );
  }

  return (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className={className}>
      <ExternalLink className="h-4 w-4" />
      <span>Visit Project</span>
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all duration-300" />
    </a>
  );
}

function ProjectCard({
  project,
  index,
  onWatch,
}: {
  project: Project;
  index: number;
  onWatch: (source: string) => void;
}) {
  const playableSource = getPlayableSource(project);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.06,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-2xl glass-card glass-card-hover"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <ProjectMedia project={project} playableSource={playableSource} onWatch={onWatch} />

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-primary-light">
          {project.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
          <ProjectLink project={project} />

          {playableSource && (
            <button
              onClick={() => onWatch(playableSource)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 text-sm font-semibold text-primary-light transition-all duration-300 hover:bg-primary/20"
            >
              <PlayCircle className="h-4 w-4" />
              Watch
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function AllProjects() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <NeuralBackground />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_52%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.08),transparent_55%)]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20 sm:pt-36">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 mb-14 max-w-3xl"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-primary">
            Complete portfolio
          </span>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            All projects,
            <span className="gradient-text"> built with purpose.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A fuller look at the development, design, and creative production work behind the selected pieces on the homepage.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              index={index}
              onWatch={setSelectedVideo}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${
                selectedVideo.startsWith("tiktok:")
                  ? "aspect-[9/16] w-full max-w-sm"
                  : "aspect-video w-full max-w-5xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
                aria-label="Close video"
              >
                <X size={18} />
              </button>

              {selectedVideo.startsWith("youtube:") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.split(":")[1]}?autoplay=1`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideo.startsWith("tiktok:") ? (
                <iframe
                  src={`https://www.tiktok.com/player/v1/${selectedVideo.split(":")[1]}?autoplay=1&music_info=1&description=1`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope"
                  allowFullScreen
                />
              ) : (
                <video src={selectedVideo} controls autoPlay className="h-full w-full" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
