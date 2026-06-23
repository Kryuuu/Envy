"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  ArrowUpRight,
  Send,
  Instagram,
  Github,
  Linkedin,
  MapPin,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/nvy.ly_/", label: "Instagram" },
  { icon: Github, href: "https://github.com/Kryuuu", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmad-shawity-8840582a6/", label: "LinkedIn" },
];

export default function Contact() {
  const { t } = useLanguage();

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat Langsung",
      description: t.contact.waDesc,
      href: "https://wa.me/6281913715220?text=Halo%20Nvy,%20saya%20tertarik%20dengan%20jasa%20Anda",
      color: "#25D366",
      primary: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: "ahmadshawity@gmail.com",
      description: t.contact.emailDesc,
      href: "mailto:ahmadshawity@gmail.com",
      color: "#3B82F6",
      primary: false,
    },
  ];

  return (
    <section id="contact" className="relative py-32 section-glow">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-badge mb-6 block w-fit">
              {t.contact.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              {t.contact.title1}
              <br />
              <span className="gradient-text">{t.contact.title2}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {t.contact.desc}
            </p>

            {/* Quick Info */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span className="text-sm">Banjarmasin, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span className="text-sm">
                  {t.contact.availability}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group w-11 h-11 rounded-xl glass-card flex items-center justify-center hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_-6px_rgba(59,130,246,0.3)]"
                >
                  <social.icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 flex flex-col justify-center"
          >
            {contactMethods.map((method, index) => (
              <a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className={`relative rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 ${
                    method.primary
                      ? "glass-card border-[#25D366]/20 hover:border-[#25D366]/40 hover:shadow-[0_0_60px_-15px_rgba(37,211,102,0.2)]"
                      : "glass-card glass-card-hover"
                  }`}
                >
                  {/* Top glow line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${method.color}60, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${method.color}15`,
                        border: `1px solid ${method.color}30`,
                      }}
                    >
                      <method.icon
                        className="w-6 h-6 transition-colors duration-300"
                        style={{ color: method.color }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {method.label}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {method.value}
                      </p>
                      <p className="text-xs text-muted">{method.description}</p>
                    </div>
                  </div>

                  {/* Primary CTA emphasis */}
                  {method.primary && (
                    <div className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-semibold text-sm group-hover:bg-[#25D366]/20 transition-all duration-300">
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </div>
                  )}
                </motion.div>
              </a>
            ))}

            {/* Quick Contact Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center pt-4"
            >
              <p className="text-xs text-muted">
                💡 Untuk estimasi harga dan timeline, ceritakan kebutuhan
                project Anda via WhatsApp.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
