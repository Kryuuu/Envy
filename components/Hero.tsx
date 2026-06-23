"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: Github, href: "https://github.com/Kryuuu", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/nvy.ly_/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmad-shawity-8840582a6/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ahmadshawity@gmail.com", label: "Email" },
];

export default function Hero() {
  const { t } = useLanguage();
  const roles = t.hero.role;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-28 pb-16">
      {/* ─── Ambient Background ─── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary glow orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[180px]"
        />
        {/* Secondary glow orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[180px]"
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                {t.hero.freelance}
              </span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-4"
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-white leading-[0.9] tracking-tighter">
                Nvy
              </h1>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                {t.hero.title}
                <br />
                <span className="gradient-text-hero inline-grid">
                  <AnimatePresence>
                    <motion.span
                      key={currentIndex}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="col-start-1 row-start-1"
                    >
                      {roles[currentIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed mb-10"
            >
              {t.hero.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <a href="#projects" className="btn-primary w-full sm:w-auto justify-center">
                <span>{t.hero.viewProjects}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="btn-ghost w-full sm:w-auto justify-center">
                <Download className="w-4 h-4" />
                <span>{t.hero.downloadCv}</span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center gap-3"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_-6px_rgba(59,130,246,0.3)]"
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Floating Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Ambient glow behind laptop */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-[100px]" />

              {/* Floating Laptop Mock */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Laptop Screen */}
                <div className="glass-card rounded-2xl p-1 shadow-2xl shadow-primary/10">
                  <div className="bg-surface rounded-xl overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface-elevated/50 border-b border-white/[0.06]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="bg-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-muted-foreground font-mono text-center">
                          nvy.dev
                        </div>
                      </div>
                    </div>
                    {/* Dashboard Content */}
                    <div className="p-5 space-y-4">
                      {/* Mini Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                            <div className="w-3 h-3 rounded bg-primary/60" />
                          </div>
                          <span className="text-xs font-semibold text-white/80">Dashboard</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded bg-white/[0.06]" />
                          <div className="w-4 h-4 rounded bg-white/[0.06]" />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Projects", value: "20+", color: "bg-primary/20 text-primary-light" },
                          { label: "Clients", value: "5+", color: "bg-secondary/20 text-secondary" },
                          { label: "Years", value: "3+", color: "bg-success/20 text-success" },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06]">
                            <p className={`text-sm font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Code Preview */}
                      <div className="bg-background/50 rounded-lg p-3 border border-white/[0.04]">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-primary/70 font-mono">const</span>
                            <span className="text-[10px] text-secondary font-mono">developer</span>
                            <span className="text-[10px] text-white/40 font-mono">=</span>
                            <span className="text-[10px] text-white/40 font-mono">{"{"}</span>
                          </div>
                          <div className="pl-4 flex items-center gap-2">
                            <span className="text-[10px] text-primary-light/60 font-mono">name:</span>
                            <span className="text-[10px] text-success/70 font-mono">&quot;Nvy&quot;</span>
                          </div>
                          <div className="pl-4 flex items-center gap-2">
                            <span className="text-[10px] text-primary-light/60 font-mono">role:</span>
                            <span className="text-[10px] text-success/70 font-mono">&quot;Creative Dev&quot;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/40 font-mono">{"}"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Activity Bar */}
                      <div className="flex gap-1.5">
                        {[40, 65, 30, 80, 55, 45, 70, 60, 35, 75, 50, 85].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 1 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/10 max-h-8"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 1 - Top Right */}
              <motion.div
                animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -right-4 z-20"
              >
                <div className="glass-card rounded-xl p-3 shadow-xl shadow-primary/5 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-success/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-success" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80">Deploy Success</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-success to-primary"
                      />
                    </div>
                    <span className="text-[9px] text-success font-bold">100%</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 - Bottom Left */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, -3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-2 -left-6 z-20"
              >
                <div className="glass-card rounded-xl p-3 shadow-xl shadow-secondary/5 min-w-[130px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded bg-primary" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80">Tech Stack</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {["React", "PHP", "Docker"].map((tech) => (
                      <span key={tech} className="text-[8px] px-1.5 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/15 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
        >
          <motion.div className="w-1 h-2 bg-primary/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
