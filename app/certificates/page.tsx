import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Certificates from "@/components/Certificates";
import NeuralBackground from "@/components/NeuralBackground";

export default function CertificatesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <NeuralBackground />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_52%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </div>

      <Certificates variant="page" sectionClassName="pt-12 pb-20" />
    </main>
  );
}
