"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import { Instagram, Github, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/nvy.ly_/", label: "Instagram" },
  { icon: Github, href: "https://github.com/Kryuuu", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmad-shawity-8840582a6/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ahmadshawity@gmail.com", label: "Email" },
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.services, href: "#services" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.contact, href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-white/[0.04]">
      {/* Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/3 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_12px_-2px_rgba(59,130,246,0.4)]">
                <span className="text-sm font-extrabold text-white leading-none">N</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                Nvy
              </span>
            </div>
            <p className="text-sm font-medium text-white/70 mb-2 whitespace-pre-line">
              {t.footer.role}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
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
            <h4 className="text-sm font-semibold text-white mb-4">{t.footer.connect}</h4>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:border-primary/30 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_-4px_rgba(59,130,246,0.2)]"
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground whitespace-pre-line">
              {t.footer.freelance}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Nvy. {t.footer.rights}
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            {t.footer.crafted} <Heart className="w-3 h-3 text-primary-light" /> in Banjarmasin
          </p>
        </div>
      </div>
    </footer>
  );
}
