import type { Metadata } from 'next';
import './play.css';

export const metadata: Metadata = {
  title: 'NVY Code Playground — Belajar Coding Sambil Bermain 🚀',
  description: 'Belajar logika, coding, dan robotika lewat permainan interaktif.',
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
