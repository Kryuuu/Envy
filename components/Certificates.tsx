"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Award, Calendar, ExternalLink, FileText, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import certificatesData from "@/data/certificates.json";
import { useLanguage } from "@/context/LanguageContext";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  date: string;
  credentialNo: string;
  file: string;
}

interface CertificatesProps {
  limit?: number;
  showViewAll?: boolean;
  variant?: "home" | "page";
  sectionClassName?: string;
}

const certificates: Certificate[] = certificatesData as Certificate[];

function CertificateThumbnail({ certificate }: { certificate: Certificate }) {
  const previewSrc = `${certificate.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="relative aspect-[4/3] overflow-hidden border-b border-white/[0.06] bg-white">
      <iframe
        src={previewSrc}
        title={`${certificate.title} thumbnail`}
        tabIndex={-1}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[136%] w-[136%] -translate-x-1/2 -translate-y-1/2 border-0 bg-white"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-70" />
      <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
        {certificate.category}
      </div>
    </div>
  );
}

function CertificateCard({
  certificate,
  index,
  onPreview,
  t,
}: {
  certificate: Certificate;
  index: number;
  onPreview: (certificate: Certificate) => void;
  t: any;
}) {
  return (
    <motion.article
      key={certificate.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative overflow-hidden rounded-2xl glass-card glass-card-hover flex flex-col h-full"
    >
      <button
        onClick={() => onPreview(certificate)}
        className="absolute inset-0 z-10"
        aria-label={`Preview ${certificate.title}`}
      />

      <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CertificateThumbnail certificate={certificate} />

      <div className="relative z-20 flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-light">
            <Award className="h-4 w-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {certificate.date}
          </span>
        </div>

        <h3 className="text-lg font-bold leading-tight text-white transition-colors duration-300 group-hover:text-primary-light">
          {certificate.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {certificate.issuer}
        </p>
        <p className="mt-auto pt-4 text-xs text-muted truncate">
          No. {certificate.credentialNo}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="h-4 w-4" />
            {t.certificates.preview}
          </span>
          <a
            href={certificate.file}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="relative z-30 inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-xs font-semibold text-white transition-all hover:bg-white/[0.1] hover:border-primary/30"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t.certificates.open}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Certificates({
  limit,
  showViewAll = false,
  variant = "home",
  sectionClassName = "py-32 section-glow",
}: CertificatesProps) {
  const { t } = useLanguage();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const displayedCertificates = limit ? certificates.slice(0, limit) : certificates;
  const isPage = variant === "page";

  return (
    <section id="certificates" className={`relative ${sectionClassName}`}>
      <div className="absolute left-0 top-1/4 h-[420px] w-[420px] rounded-full bg-accent/5 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="section-badge mb-6 block w-fit">
              {t.certificates.badge}
            </span>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              {isPage ? t.certificates.titlePage : t.certificates.titleHome}
              <span className="gradient-text">
                {isPage ? t.certificates.subtitlePage : t.certificates.subtitleHome}
              </span>
            </h2>
          </div>
          <div className="max-w-md space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isPage
                ? t.certificates.descPage
                : t.certificates.descHome}
            </p>
            {showViewAll && displayedCertificates.length < certificates.length && (
              <Link
                href="/certificates"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.09] hover:shadow-[0_8px_30px_-14px_rgba(59,130,246,0.55)]"
              >
                {t.certificates.viewAll}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </motion.div>

        <div
          className={`grid gap-5 sm:grid-cols-2 ${
            limit === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {displayedCertificates.map((certificate, index) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              index={index}
              onPreview={setSelectedCertificate}
              t={t}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                    {selectedCertificate.title}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {selectedCertificate.issuer} - {selectedCertificate.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedCertificate.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white transition-all hover:bg-white/[0.1] sm:inline-flex"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
                    aria-label="Close certificate preview"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <iframe
                src={selectedCertificate.file}
                title={selectedCertificate.title}
                className="min-h-0 flex-1 bg-white"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
