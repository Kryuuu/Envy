"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
  { name: "Credentials", href: "#certificates" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

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
              className="relative group flex items-center gap-2"
            >
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                nvy
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-primary-light transition-colors" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-300 group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary rounded-full group-hover:w-4 transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <a
                href="#contact"
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-primary/30 rounded-full transition-all duration-300"
              >
                <span>Let&apos;s Talk</span>
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
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
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
          <motion.a
            href="#contact"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="btn-primary mt-4"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
