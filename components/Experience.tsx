"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Code2, Network, Calendar, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const timelineItems = [
  {
    year: "2022 — Present",
    title: "Informatics Engineering Student",
    organization: "UNISKA Banjarmasin",
    description: "Studying informatics engineering, focusing on web development, database design, network administration, and software engineering.",
    icon: GraduationCap,
    type: "education" as const,
    tags: ["Database Design", "Web Dev", "Networking"],
  },
  {
    year: "2024 — Present",
    title: "Freelance Developer & Creative",
    organization: "Independent",
    description: "Building modern web applications, Android apps, company profile websites, and multimedia content for businesses and UMKM organizations.",
    icon: Briefcase,
    type: "work" as const,
    tags: ["Next.js", "Laravel", "Flutter", "After Effects"],
  },
  {
    year: "2025 — 2026",
    title: "Video Editor Intern",
    organization: "Rumah BUMN Banjarmasin",
    description: "Spearheaded multimedia production, creating engaging video content to support UMKM digital branding, while also contributing to the development of internal web systems.",
    icon: Video,
    type: "internship" as const,
    tags: ["Video Editing", "After Effects", "Web Dev"],
  },
  {
    year: "2023 — Present",
    title: "Network Administration Journey",
    organization: "Self-Learning & Practicum",
    description: "Building expertise in Linux server administration, Docker containerization, and Mikrotik network configuration through academic practicum and personal projects.",
    icon: Network,
    type: "journey" as const,
    tags: ["Linux", "Docker", "Mikrotik"],
  },
];

const typeStyles = {
  education: {
    color: "text-primary-light",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
  },
  work: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    dot: "bg-success",
  },
  internship: {
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    dot: "bg-secondary",
  },
  journey: {
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    dot: "bg-accent",
  },
};

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="relative py-32 section-glow overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <span className="section-badge mb-6 block w-fit">
            {t.experience.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {t.experience.title1}
            <span className="gradient-text">{t.experience.title2}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.experience.desc}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="timeline-line" />

          <div className="space-y-12">
            {timelineItems.map((item, index) => {
              const styles = typeStyles[item.type];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-16 md:pl-0"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-[16px] md:left-1/2 md:-translate-x-1/2 top-2 w-4 h-4 rounded-full ${styles.bg} border-2 ${styles.border} z-10 flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                  </div>

                  {/* Content Card */}
                  <div className={`md:w-[calc(50%-2rem)] ${isEven ? "md:ml-auto md:pl-8" : "md:mr-auto md:pr-8 md:text-right"}`}>
                    <div className="group glass-card glass-card-hover rounded-2xl p-6 md:p-8">
                      {/* Year */}
                      <div className={`flex items-center gap-2 mb-4 ${!isEven ? "md:justify-end" : ""}`}>
                        <Calendar className={`w-3.5 h-3.5 ${styles.color}`} />
                        <span className={`text-xs font-semibold ${styles.color} uppercase tracking-wider`}>
                          {item.year}
                        </span>
                      </div>

                      {/* Icon + Title */}
                      <div className={`flex items-start gap-3 mb-3 ${!isEven ? "md:flex-row-reverse md:text-right" : ""}`}>
                        <div className={`w-10 h-10 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center flex-shrink-0`}>
                          <item.icon className={`w-4.5 h-4.5 ${styles.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary-light transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium mt-0.5">
                            {item.organization}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-sm text-muted-foreground leading-relaxed mb-4 ${!isEven ? "md:text-right" : ""}`}>
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className={`flex flex-wrap gap-2 ${!isEven ? "md:justify-end" : ""}`}>
                        {item.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
