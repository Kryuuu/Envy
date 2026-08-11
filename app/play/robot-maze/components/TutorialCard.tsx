'use client';

import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

interface TutorialCardProps {
  title: string;
  content: string;
}

export default function TutorialCard({ title, content }: TutorialCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="tutorial-toggle"
        aria-label="Tampilkan tutorial"
      >
        <Lightbulb size={16} />
        <span>Tips</span>
      </button>
    );
  }

  return (
    <div className="tutorial-card">
      <div className="tutorial-header">
        <h4 className="tutorial-title">{title}</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="tutorial-close"
          aria-label="Tutup tutorial"
        >
          <X size={14} />
        </button>
      </div>
      <p className="tutorial-content">{content}</p>
    </div>
  );
}
