"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FolderKanban, Cpu, Clock, Flame } from "lucide-react";

const stats = [
  {
    icon: FolderKanban,
    value: 5,
    suffix: "+",
    label: "Projects Completed",
    description: "Across web, mobile & multimedia",
    color: "text-primary-light",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Cpu,
    value: 3,
    suffix: "+",
    label: "Technologies Mastered",
    description: "Modern frameworks & tools",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: Clock,
    value: 2,
    suffix: "+",
    label: "Years Learning",
    description: "Continuously growing & improving",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Flame,
    value: 100,
    suffix: "%",
    label: "Passion for Technology",
    description: "Driven by curiosity & purpose",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="stat-counter">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
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
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
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
