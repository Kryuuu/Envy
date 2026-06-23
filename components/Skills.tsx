"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Technology {
  name: string;
  slug: string;
  color: string;
  category: string;
  iconUrl?: string;
}

const categories = ["All", "Frontend", "Backend", "Mobile", "Database", "Networking", "Tools"];

const technologies: Technology[] = [
  // Frontend
  { name: "React", slug: "react", color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", slug: "nextdotjs", color: "#ffffff", category: "Frontend" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6", category: "Frontend" },
  { name: "JavaScript", slug: "javascript", color: "#F7DF1E", category: "Frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", category: "Frontend" },
  { name: "Framer Motion", slug: "framer", color: "#BB4BFF", category: "Frontend" },

  // Backend
  { name: "PHP", slug: "php", color: "#777BB4", category: "Backend" },
  { name: "Laravel", slug: "laravel", color: "#FF2D20", category: "Backend" },
  { name: "Node.js", slug: "nodedotjs", color: "#339933", category: "Backend" },
  { name: "Supabase", slug: "supabase", color: "#3ECF8E", category: "Backend" },

  // Mobile
  { name: "Flutter", slug: "flutter", color: "#02569B", category: "Mobile" },
  { name: "Dart", slug: "dart", color: "#0175C2", category: "Mobile" },

  // Database
  { name: "MySQL", slug: "mysql", color: "#4479A1", category: "Database" },
  { name: "PostgreSQL", slug: "postgresql", color: "#4169E1", category: "Database" },

  // Networking
  { name: "Mikrotik", slug: "mikrotik", color: "#293239", category: "Networking" },
  { name: "Linux", slug: "linux", color: "#FCC624", category: "Networking" },
  { name: "Docker", slug: "docker", color: "#2496ED", category: "Networking" },

  // Tools
  { name: "Git", slug: "git", color: "#F05032", category: "Tools" },
  { name: "Figma", slug: "figma", color: "#F24E1E", category: "Tools" },
  { name: "After Effects", slug: "aftereffects", color: "#9999FF", category: "Tools", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/aftereffects/aftereffects-original.svg" },
  { name: "Photoshop", slug: "photoshop", color: "#31A8FF", category: "Tools", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" },
  { name: "VS Code", slug: "vscode", color: "#007ACC", category: "Tools", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
  { name: "CapCut", slug: "capcut", color: "#FFFFFF", category: "Tools", iconUrl: "https://api.iconify.design/hugeicons:capcut.svg?color=%23ffffff" },
  { name: "Antigravity", slug: "antigravity", color: "#8B5CF6", category: "Tools", iconUrl: "/antigravity.png" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Skills() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Frontend", "Backend", "Mobile", "Database", "Networking", "Tools"];

  const filteredTechs = activeCategory === "All"
    ? technologies
    : technologies.filter((t) => t.category === activeCategory);

  return (
    <section id="skills" className="relative py-32 section-glow overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <span className="section-badge mb-6 block w-fit">
            {t.skills.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {t.skills.title1}
            <span className="gradient-text">{t.skills.title2}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.skills.desc}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                  : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-white border border-white/[0.05]"
              }`}
            >
              {t.skills.categories[cat] || cat}
            </button>
          ))}
        </motion.div>

        {/* Technologies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20"
          key={activeCategory}
        >
          {filteredTechs.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              layout
              className="group glass-card glass-card-hover rounded-xl p-5 flex flex-col items-center gap-3 cursor-default"
            >
              {/* Color dot */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--dot-color)]"
                style={{
                  backgroundColor: `${tech.color}15`,
                  border: `1px solid ${tech.color}30`,
                  "--dot-color": `${tech.color}40`,
                } as React.CSSProperties}
              >
                <img
                  src={tech.iconUrl || `https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace("#", "")}`}
                  alt={`${tech.name} icon`}
                  className="w-6 h-6 transition-all duration-300 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to color dot if icon fails to load
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
                <div
                  className="w-4 h-4 rounded transition-all duration-300 hidden"
                  style={{ backgroundColor: tech.color }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors text-center">
                {tech.name}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-medium">
                {tech.category}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Technologies Marquee */}
        <div className="relative">
          <div
            className="relative w-full overflow-hidden py-4"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            {/* Row 1 */}
            <div className="flex w-max animate-marquee mb-4">
              {[...technologies, ...technologies].map((tech, index) => (
                <div key={index} className="flex-shrink-0 mx-3 group">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg glass-card hover:border-white/20 transition-all duration-300 cursor-default">
                    <img
                      src={tech.iconUrl || `https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace("#", "")}`}
                      alt={`${tech.name} icon`}
                      className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_10px_var(--dot-color)] hidden"
                      style={{ backgroundColor: tech.color, "--dot-color": tech.color } as React.CSSProperties}
                    />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex w-max animate-marquee-reverse">
              {[...[...technologies].reverse(), ...[...technologies].reverse()].map((tech, index) => (
                <div key={index} className="flex-shrink-0 mx-3 group">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg glass-card hover:border-white/20 transition-all duration-300 cursor-default">
                    <img
                      src={tech.iconUrl || `https://cdn.simpleicons.org/${tech.slug}/${tech.color.replace("#", "")}`}
                      alt={`${tech.name} icon`}
                      className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_10px_var(--dot-color)] hidden"
                      style={{ backgroundColor: tech.color, "--dot-color": tech.color } as React.CSSProperties}
                    />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
