"use client";

import { motion } from "framer-motion";
import { Code, Video, Camera, Image, PenTool, Megaphone } from "lucide-react";

const services = [
  {
    title: "Programmer",
    description: "Developing modern, fast, and responsive websites and applications using the latest tech stack.",
    icon: Code,
  },
  {
    title: "Video Editor",
    description: "Creating compelling visual narratives, seamless transitions, and professional color grading.",
    icon: Video,
  },
  {
    title: "Photographer",
    description: "Capturing moments with artistic composition and perfect lighting for portraits, events, and products.",
    icon: Camera,
  },
  {
    title: "Videographer",
    description: "Cinematic filming for events, commercials, and creative projects with high-end equipment.",
    icon: Image,
  },
  {
    title: "Graphic Designer",
    description: "Designing brand identities, social media assets, and marketing materials that stand out.",
    icon: PenTool,
  },
  {
    title: "Content Creator",
    description: "Producing engaging digital content for social media platforms to grow audience reach.",
    icon: Megaphone,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">My Services</h2>
          <p className="text-gray-400">Comprehensive creative solutions for your needs.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-white group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
