"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Development",
    image: "/api/placeholder/600/400", // Placeholder
    description: "A full-stack e-commerce solution with payment integration.",
    tags: ["Next.js", "Stripe", "Tailwind"],
  },
  {
    title: "Cinematic Travel Vlog",
    category: "Video Editing",
    image: "/api/placeholder/600/400",
    description: "Travel montage featuring seamless transitions and sound design.",
    tags: ["Premiere Pro", "After Effects"],
  },
  {
    title: "Product Photography",
    category: "Photography",
    image: "/api/placeholder/600/400",
    description: "High-end product shots for a luxury watch brand.",
    tags: ["Lightroom", "Studio Lighting"],
  },
  {
    title: "Corporate Brand Identity",
    category: "Design",
    image: "/api/placeholder/600/400",
    description: "Complete branding package including logo, guidelines, and stationery.",
    tags: ["Illustrator", "Photoshop"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-gray-400">Selected works from my portfolio.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10"
            >
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-xl">
                   {project.title} Preview
                </div>
              </div>
              
              <div className="p-6 relative z-20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-primary text-sm font-medium mb-2 block">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
