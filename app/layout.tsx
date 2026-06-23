import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

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
  metadataBase: new URL("https://shojunz.my.id"),
  title: "Nvy — Creative Developer & Digital Media Specialist",
  description:
    "Building modern digital solutions, web applications, multimedia experiences, and technology systems for businesses and UMKM.",
  keywords: [
    "web developer",
    "portfolio",
    "creative developer",
    "digital media",
    "UI/UX design",
    "android development",
    "network administration",
    "UMKM",
    "freelancer",
    "Nvy",
  ],
  authors: [{ name: "Nvy", url: "https://shojunz.my.id" }],
  creator: "Nvy",
  openGraph: {
    title: "Nvy — Creative Developer & Digital Media Specialist",
    description:
      "Building modern digital solutions, web applications, multimedia experiences, and technology systems.",
    url: "https://shojunz.my.id",
    siteName: "Nvy Portfolio",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nvy — Creative Developer & Digital Media Specialist",
    description: "Building modern digital solutions, web applications, and multimedia experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
