"use client";

import { motion } from "framer-motion";
import { Code, Video, Camera, Image, PenTool } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center">
             {/* Placeholder for Profile Image */}
             <span className="text-gray-500 text-6xl font-bold">You</span>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About Me</h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              I am a versatile creative professional passionate about bridging the gap between technology and art. 
              With expertise in programming, video production, photography, and design, I offer a unique 
              multidisciplinary approach to every project.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Whether it's writing clean code, crafting cinematic stories, capturing timeless moments, 
              or designing stunning visuals, I am dedicated to delivering excellence.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-2xl font-bold text-primary mb-1">3+</h3>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-2xl font-bold text-secondary mb-1">20+</h3>
                <p className="text-sm text-gray-400">Projects Completed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
