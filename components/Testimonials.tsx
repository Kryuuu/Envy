"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const testimonials = [
  {
    name: "Rumah BUMN Banjarmasin",
    role: "Organization",
    text: "Website yang dihasilkan sangat profesional dan sesuai dengan kebutuhan organisasi kami. Proses pengerjaan cepat dan komunikasi sangat baik.",
    avatar: "RB",
  },
  {
    name: "UMKM Partner",
    role: "Business Owner",
    text: "Berkat website dan sistem yang dibuatkan, bisnis kami sekarang lebih mudah ditemukan secara online. Sangat puas dengan hasilnya.",
    avatar: "UP",
  },
  {
    name: "BEM FTI UNISKA",
    role: "Student Organization",
    text: "Video promosi yang dihasilkan sangat menarik dan profesional. Editing modern dengan transisi yang smooth, sangat membantu branding organisasi kami.",
    avatar: "BF",
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      if (newDirection === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="relative py-32 section-glow overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-block">
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {t.testimonials.title1}
            <span className="gradient-text">{t.testimonials.title2}</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
              >
                <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
                    <Quote className="w-5 h-5 text-primary-light" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  {/* Avatar & Info */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {testimonials[current].avatar}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        {testimonials[current].name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/30 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/30 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
