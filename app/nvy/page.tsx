'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Play, Film, Camera, Zap } from 'lucide-react';
import nvyData from '../../data/nvy-portfolio.json';

export default function NVYPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = ['All', ...Array.from(new Set(nvyData.portfolio.map((item) => item.category)))];

  const filteredPortfolio = selectedCategory === 'All'
    ? nvyData.portfolio
    : nvyData.portfolio.filter((item) => item.category === selectedCategory);

  // Cinematic Easing
  const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center"
        animate={{ 
          x: mousePosition.x - 8, 
          y: mousePosition.y - 8,
          scale: isHovering ? 3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        {isHovering && <span className="text-[4px] text-black font-bold uppercase tracking-widest">View</span>}
      </motion.div>

      {/* Noise Overlay for cinematic film grain */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Header */}
      <nav className="fixed top-0 w-full p-8 z-40 flex justify-between items-start mix-blend-difference text-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: cinematicEase }}
          className="flex flex-col"
        >
          <span className="text-3xl font-normal tracking-[-0.05em] leading-none">NVY.</span>
          <span className="text-[10px] mt-2 uppercase tracking-[0.3em] text-zinc-500">Director / Cinematographer</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: cinematicEase }}
          className="text-[10px] uppercase tracking-[0.3em] flex flex-col items-end gap-1"
        >
          <span>Est. 2026</span>
          <span className="text-zinc-500">Global</span>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end pb-24 px-8 md:px-16 z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-0 opacity-80" />
        
        {/* Dynamic Background Image - using first portfolio item */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2.5, ease: cinematicEase }}
          className="absolute inset-0 -z-10 object-cover w-full h-full grayscale"
        >
          {/* @ts-ignore */}
          {(nvyData.portfolio[0].mediaType === 'video' || nvyData.portfolio[0].imageUrl?.match(/\.(mp4|webm|ogg)$/i)) ? (
            <video src={nvyData.portfolio[0].imageUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={nvyData.portfolio[0].imageUrl} alt="Background" className="w-full h-full object-cover" />
          )}
        </motion.div>

        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: cinematicEase }}
              className="text-6xl md:text-[9rem] font-light tracking-tighter uppercase leading-[0.8] mb-6"
            >
              {nvyData.hero.title.split(' ')[0]} <br />
              <span className="italic font-serif text-zinc-400">{nvyData.hero.title.split(' ').slice(1).join(' ')}</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: cinematicEase }}
            className="flex-1 md:max-w-md"
          >
            <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed tracking-wide">
              {nvyData.hero.description}
            </p>
            <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
              <div className="w-12 h-[1px] bg-white"></div>
              <span>Scroll to explore</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Cinematic Cards */}
      <section className="py-32 px-8 md:px-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: cinematicEase }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5"
          >
            {nvyData.services.map((service, idx) => (
              <div key={service.id} className="group border-b md:border-b-0 md:border-r border-white/5 last:border-0 p-12 hover:bg-white/5 transition-colors duration-700">
                <div className="text-zinc-600 mb-16 group-hover:text-white transition-colors duration-500">
                  {service.id === 'photography' && <Camera size={24} strokeWidth={1} />}
                  {service.id === 'videography' && <Film size={24} strokeWidth={1} />}
                  {service.id === 'drone' && <Zap size={24} strokeWidth={1} />}
                </div>
                <h3 className="text-2xl font-light tracking-tight mb-4 uppercase">{service.name}</h3>
                <p className="text-sm text-zinc-500 font-light leading-relaxed tracking-wide mb-8">
                  {service.description}
                </p>
                {/* @ts-ignore - TS might complain until JSON is fully re-parsed */}
                {service.pricing && (
                  <div className="space-y-3 mt-auto">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 border-b border-white/10 pb-2">Pricing</h4>
                    {/* @ts-ignore */}
                    {service.pricing.map((priceItem, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                        <span className="text-zinc-400 font-light">{priceItem.package}</span>
                        <span className="text-white tracking-wide">{priceItem.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Director's Cut / Portfolio */}
      <section className="py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4">Director&apos;s Cut</h2>
            <h3 className="text-5xl md:text-7xl font-light tracking-tighter uppercase">Selected<br/><span className="italic font-serif text-zinc-400">Works</span></h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs tracking-[0.2em] uppercase text-left transition-all duration-500 flex items-center gap-4 ${
                  selectedCategory === category ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'
                }`}
              >
                <div className={`h-[1px] bg-white transition-all duration-500 ${selectedCategory === category ? 'w-8' : 'w-0'}`} />
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: cinematicEase }}
                  key={item.id}
                  className={`group relative cursor-none ${
                    idx % 3 === 0 ? 'md:col-span-12 aspect-video' : 
                    idx % 3 === 1 ? 'md:col-span-7 aspect-[4/3]' : 'md:col-span-5 aspect-[3/4]'
                  }`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="w-full h-full overflow-hidden bg-zinc-900 relative">
                    {/* Media */}
                    {/* @ts-ignore */}
                    {(item.mediaType === 'video' || item.imageUrl?.match(/\.(mp4|webm|ogg)$/i)) ? (
                      <video
                        src={item.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover w-full h-full transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                      />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                      <div className="translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out">
                        <div className="text-[10px] uppercase tracking-[0.3em] mb-2 text-zinc-400">{item.category}</div>
                        <h3 className="text-2xl md:text-3xl font-light tracking-tight">{item.title}</h3>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-700 ease-out">
                        <ArrowRight size={16} strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Footer */}
      <footer className="mt-32 border-t border-white/10 py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10rem] md:text-[15rem] leading-none font-bold tracking-tighter opacity-5 uppercase select-none"
          >
            NVY.
          </motion.div>
          <div className="flex flex-col items-end gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            <span>© {new Date().getFullYear()} NVY Studio</span>
            <span>Based in Indonesia</span>
          </div>
        </div>
      </footer>

      {/* Cinema Viewer (Modal) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: cinematicEase }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors z-10 mix-blend-difference"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} strokeWidth={1} />
              <span className="sr-only">Close</span>
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: cinematicEase }}
              className="w-full max-w-7xl p-4 md:p-12 flex flex-col md:flex-row items-center gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 w-full max-h-[75vh] overflow-y-auto relative space-y-8 pr-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Media Modal */}
                {/* @ts-ignore */}
                {selectedImage.media && selectedImage.media.length > 0 ? (
                  // @ts-ignore
                  selectedImage.media.map((m, idx) => (
                    <div key={idx} className="w-full relative">
                      {(m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg)$/i)) ? (
                        <video
                          src={m.url}
                          controls
                          autoPlay={idx === 0}
                          className="w-full object-contain shadow-2xl"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={m.url}
                          alt={`${selectedImage.title} ${idx + 1}`}
                          className="w-full object-contain shadow-2xl"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full relative">
                    {/* @ts-ignore */}
                    {(selectedImage.mediaType === 'video' || selectedImage.imageUrl?.match(/\.(mp4|webm|ogg)$/i)) ? (
                      <video
                        src={selectedImage.imageUrl}
                        controls
                        autoPlay
                        className="w-full max-h-[75vh] object-contain shadow-2xl"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedImage.imageUrl}
                        alt={selectedImage.title}
                        className="w-full max-h-[75vh] object-contain shadow-2xl"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">{selectedImage.category}</span>
                  <h3 className="text-4xl md:text-5xl font-light tracking-tight uppercase mt-2">{selectedImage.title}</h3>
                </div>
                <div className="h-[1px] w-full bg-white/10" />
                <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-sm">
                  {selectedImage.description}
                </p>
                <button className="mt-8 self-start flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
                  <Play size={16} strokeWidth={1} />
                  <span>View Project</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
