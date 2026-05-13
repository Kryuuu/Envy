import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nvy — Digital Experience Studio",
  description:
    "Building modern web experiences that help ideas grow. Web development, UI design, and digital solutions for businesses and startups.",
  keywords: [
    "web developer",
    "portfolio",
    "digital experience",
    "web design",
    "freelancer",
    "UMKM",
    "landing page",
    "custom dashboard",
  ],
  authors: [{ name: "Nvy" }],
  openGraph: {
    title: "Nvy — Digital Experience Studio",
    description:
      "Building modern web experiences that help ideas grow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased bg-background text-foreground noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
