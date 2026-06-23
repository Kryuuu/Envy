"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Rocket, Heart, GraduationCap, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  const values = [
    { icon: Target, title: t.about.values[0].title, description: t.about.values[0].desc },
    { icon: Lightbulb, title: t.about.values[1].title, description: t.about.values[1].desc },
    { icon: Rocket, title: t.about.values[2].title, description: t.about.values[2].desc },
    { icon: Heart, title: t.about.values[3].title, description: t.about.values[3].desc },
  ];

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
                alt="Nvy — Creative Developer"
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
                    Creative Developer · Informatics Student · Network Admin
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 z-20"
            >
              <div className="glass-card rounded-xl p-3 shadow-xl shadow-primary/5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary-light" />
                  <div>
                    <p className="text-[10px] font-semibold text-white/80">UNISKA</p>
                    <p className="text-[9px] text-muted-foreground">Informatics Engineering</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-3 -left-4 z-20"
            >
              <div className="glass-card rounded-xl p-3 shadow-xl shadow-secondary/5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-[10px] font-semibold text-white/80">Freelancer</p>
                    <p className="text-[9px] text-muted-foreground">Web & Multimedia</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl border border-primary/15 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl border border-secondary/10 -z-10" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-badge mb-6 block w-fit">
              {t.about.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
              {t.about.title1}
              <br />
              <span className="gradient-text">{t.about.title2}</span>
            </h2>

            <div className="space-y-5 mb-12">
              <p className="text-muted-foreground leading-relaxed">
                {t.about.desc1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.desc2}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.desc3}
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
                  className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 transition-all duration-300 hover:bg-white/[0.04]"
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
