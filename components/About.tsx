"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Rocket, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Problem-First Thinking",
    description: "I start with understanding your challenge before writing a single line of code.",
  },
  {
    icon: Lightbulb,
    title: "Always Learning",
    description: "Technology evolves fast. I stay sharp to bring you the best solutions.",
  },
  {
    icon: Rocket,
    title: "Ship With Quality",
    description: "Fast delivery without cutting corners. Every detail matters.",
  },
  {
    icon: Heart,
    title: "Genuine Partnership",
    description: "Your success is my success. I treat every project as my own.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-32 section-glow">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Photo + Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Photo container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card">
              <img
                src="/projects/my.png"
                alt="Nvy — Digital Experience Builder"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm font-semibold text-white mb-1">
                    Ahmad Shawity
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Developer · Creator · Problem Solver
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl border border-primary/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl border border-secondary/10 -z-10" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-sm font-medium text-primary tracking-wider uppercase mb-4 block">
              About
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
              Not just a developer.
              <br />
              <span className="gradient-text">A digital partner.</span>
            </h2>

            <div className="space-y-5 mb-12">
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m a multidisciplinary developer and creative based in
                Banjarmasin, Indonesia. I specialize in building modern web
                experiences that are not just visually impressive, but
                genuinely useful for the people who use them.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With a background spanning full-stack development, video
                production, and visual design, I bring a unique perspective
                to every project. I don&apos;t just build websites — I craft
                digital experiences that help businesses grow and ideas come
                to life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re a small business looking to go digital, a
                startup needing a custom platform, or an organization wanting
                a professional web presence — I&apos;m here to make it happen.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 transition-all duration-300"
                >
                  <value.icon className="w-5 h-5 text-primary-light mb-3" />
                  <p className="text-sm font-semibold text-white mb-1">
                    {value.title}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
