"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Network,
  Lightbulb,
  Palette,
  Video,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { icon: Globe, title: t.services.items[0].title, description: t.services.items[0].desc, benefit: t.services.items[0].benefit, color: "#3B82F6" },
    { icon: Smartphone, title: t.services.items[1].title, description: t.services.items[1].desc, benefit: t.services.items[1].benefit, color: "#06B6D4" },
    { icon: Network, title: t.services.items[2].title, description: t.services.items[2].desc, benefit: t.services.items[2].benefit, color: "#10B981" },
    { icon: Lightbulb, title: t.services.items[3].title, description: t.services.items[3].desc, benefit: t.services.items[3].benefit, color: "#F59E0B" },
    { icon: Palette, title: t.services.items[4].title, description: t.services.items[4].desc, benefit: t.services.items[4].benefit, color: "#8B5CF6" },
    { icon: Video, title: t.services.items[5].title, description: t.services.items[5].desc, benefit: t.services.items[5].benefit, color: "#EC4899" },
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
          <span className="section-badge mb-6 block w-fit">
            {t.services.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {t.services.title1}
            <span className="gradient-text">{t.services.title2}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.services.desc}
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
              {/* Top glow line */}
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${service.color}60, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500"
                style={{
                  backgroundColor: `${service.color}15`,
                  border: `1px solid ${service.color}25`,
                }}
              >
                <service.icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: service.color }}
                />
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
