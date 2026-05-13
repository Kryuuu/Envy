"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import { Instagram, Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/envy.ly_/", label: "Instagram" },
  { icon: Github, href: "https://github.com/Kryuuu", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmad-shawity-8840582a6/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ahmadshawity@gmail.com", label: "Email" },
];

const footerNav = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                nvy
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Building modern web experiences that help ideas grow. Based in
              Banjarmasin, available worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigate</h4>
            <ul className="space-y-3">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:border-primary/30 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Nvy. All rights reserved.
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-primary-light" /> in Banjarmasin
          </p>
        </div>
      </div>
    </footer>
  );
}
