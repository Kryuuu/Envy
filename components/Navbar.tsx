"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Globe, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const languages: Language[] = ["ID", "EN", "JP", "CN"];

  // Map nav items dynamically based on dictionary
  const dynamicNavItems = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.services, href: "#services" },
    { name: t.nav.contact, href: "#contact" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="relative group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_12px_-2px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_20px_-2px_rgba(59,130,246,0.6)] transition-shadow duration-300">
                <span className="text-sm font-extrabold text-white leading-none">N</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-heading">
                Nvy
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {dynamicNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-300 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary rounded-full group-hover:w-4 transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Desktop CTA & Language */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setIsLangOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/10 rounded-xl transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-24 p-1 bg-surface-elevated/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    >
                      {languages.map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setLang(l);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            lang === l
                              ? "bg-primary/20 text-primary-light font-semibold"
                              : "text-muted-foreground hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href="#contact"
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-primary/30 rounded-xl transition-all duration-300"
              >
                <span>{t.nav.letsTalk}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, pointerEvents: "auto" as const } : { opacity: 0, pointerEvents: "none" as const }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-background/98 backdrop-blur-3xl md:hidden"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {dynamicNavItems.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.1 + 0.1, duration: 0.4 }}
              className="text-3xl font-bold text-white/70 hover:text-white transition-colors font-heading"
            >
              {item.name}
            </motion.a>
          ))}
          
          {/* Mobile Language Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: dynamicNavItems.length * 0.1 + 0.1, duration: 0.4 }}
            className="flex items-center gap-3 mt-4"
          >
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                  lang === l
                    ? "bg-primary/20 border border-primary/30 text-primary-light"
                    : "bg-white/[0.05] border border-white/5 text-muted-foreground hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </motion.div>
          <motion.a
            href="#contact"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="btn-primary mt-4"
          >
            <span>{t.nav.letsTalk}</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
