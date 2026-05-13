"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const capabilities = [
  "Web Experiences",
  "Digital Products",
  "Custom Dashboards",
  "Landing Pages",
  "Brand Identities",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % capabilities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* ─── Ambient Background ─── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary glow orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[150px]"
        />
        {/* Secondary glow orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[180px]"
        />
        {/* Accent glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute top-[60%] left-[50%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[160px]"
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 sm:mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            Available for freelance projects
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.1] tracking-tight mb-6 sm:mb-8"
        >
          <span className="block">Building modern</span>
          <span className="block mt-1 sm:mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="block gradient-text pb-2"
              >
                {capabilities[currentIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="block mt-1 sm:mt-2 text-white/60">
            that help ideas grow.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
        >
          I design and develop scalable digital solutions for businesses,
          startups, and organizations — turning complex problems into clean,
          intuitive experiences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#projects" className="btn-primary w-full sm:w-auto">
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#contact" className="btn-ghost w-full sm:w-auto">
            <Sparkles className="w-4 h-4" />
            <span>Start a Project</span>
          </a>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 sm:mt-20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12"
        >
          {[
            { value: "20+", label: "Projects" },
            { value: "3+", label: "Years" },
            { value: "100%", label: "Dedication" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-2">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
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
          <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
