"use client";

import { motion } from "framer-motion";

const technologies = [
  { name: "Next.js", color: "#ffffff" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "PHP", color: "#777BB4" },
  { name: "Laravel", color: "#FF2D20" },
  { name: "MySQL", color: "#4479A1" },
  { name: "Node.js", color: "#339933" },
  { name: "Framer Motion", color: "#BB4BFF" },
  { name: "After Effects", color: "#9999FF" },
  { name: "Photoshop", color: "#31A8FF" },
  { name: "Figma", color: "#F24E1E" },
];

const stats = [
  { number: "20+", label: "Projects Completed", description: "Across web, video, and design" },
  { number: "3+", label: "Years Building", description: "Continuously learning & growing" },
  { number: "5+", label: "Happy Clients", description: "Organizations & businesses" },
  { number: "24/7", label: "Dedicated Support", description: "Always here when you need me" },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 section-glow overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase mb-4 block">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Tools & technologies
            <span className="gradient-text"> I work with</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A versatile toolkit built around delivering quality — from modern
            frameworks to creative suites.
          </p>
        </motion.div>

        {/* Technologies Marquee */}
        <div className="mb-24">
          <div
            className="relative w-full overflow-hidden py-6"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee">
              {[...technologies, ...technologies].map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-4 group"
                >
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full glass-card hover:border-white/20 transition-all duration-300 cursor-default">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_10px_var(--dot-color)]"
                      style={
                        {
                          backgroundColor: tech.color,
                          "--dot-color": tech.color,
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group glass-card rounded-2xl p-6 md:p-8 text-center glass-card-hover"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </p>
              <p className="text-sm font-semibold text-white mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-muted">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
