"use client";

import { motion } from "framer-motion";
import {
  Globe,
  LayoutDashboard,
  Palette,
  Smartphone,
  Zap,
  Code2,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Portfolio & Company Websites",
    description:
      "Professional websites that establish credibility and attract customers to your business.",
    benefit: "Get discovered online",
  },
  {
    icon: Zap,
    title: "Landing Pages",
    description:
      "High-converting pages designed to turn visitors into leads and customers.",
    benefit: "Increase conversions",
  },
  {
    icon: LayoutDashboard,
    title: "Custom Web Systems",
    description:
      "Dashboards, management tools, and internal systems tailored to your workflow.",
    benefit: "Streamline operations",
  },
  {
    icon: Palette,
    title: "UI/UX Implementation",
    description:
      "Pixel-perfect frontend development that brings designs to life with smooth interactions.",
    benefit: "Delight your users",
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description:
      "Websites that look and perform beautifully on every device and screen size.",
    benefit: "Reach every device",
  },
  {
    icon: Code2,
    title: "Full-Stack Solutions",
    description:
      "End-to-end development from database architecture to polished user interfaces.",
    benefit: "Complete solutions",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Services() {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Section background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

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
            Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Solutions that move your
            <span className="gradient-text"> business forward</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I focus on building digital experiences that solve real problems —
            from establishing your online presence to streamlining your
            operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group glass-card glass-card-hover rounded-2xl p-8 relative"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                <service.icon className="w-5 h-5 text-primary-light" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-light transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Benefit tag */}
              <div className="flex items-center gap-2 text-xs text-muted group-hover:text-primary-light transition-colors duration-300">
                <ArrowUpRight className="w-3 h-3" />
                <span className="font-medium">{service.benefit}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
