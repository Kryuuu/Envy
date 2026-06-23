"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * NeuralBackground — Canvas-based neural network particle animation.
 * Adapted from NeuroTask's "Neural Glassmorphism" background.
 * Features: floating particles, connecting lines, mouse interaction, and cursor glow.
 */

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 150;
const MOUSE_RADIUS = 200;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1,
    baseAlpha: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.5 + 0.2,
  };
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const count = window.innerWidth < 768 ? PARTICLE_COUNT / 2 : PARTICLE_COUNT;
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial setup
    resize();
    createParticles();

    const handleResize = () => {
      resize();
      createParticles();
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    let lastScrollY = window.scrollY;
    let lastScrollX = window.scrollX;

    const handleScroll = () => {
      if (!canvasRef.current) return;
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;
      const deltaY = currentScrollY - lastScrollY;
      const deltaX = currentScrollX - lastScrollX;
      
      lastScrollY = currentScrollY;
      lastScrollX = currentScrollX;

      const w = canvasRef.current.width;
      const h = canvasRef.current.height;

      particlesRef.current.forEach((p) => {
        // Move opposite to scroll direction (parallax effect)
        p.y -= deltaY * (p.radius * 0.15); 
        p.x -= deltaX * (p.radius * 0.15);
        
        // Add a little bit of momentum/velocity from the scroll
        p.vy -= deltaY * 0.0015;
        p.vx -= deltaX * 0.0015;

        // Wrap around bounds
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse interaction — subtle attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.02;
          p.vx += dx * force;
          p.vy += dy * force;
          p.alpha = Math.min(1, p.baseAlpha + 0.3);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        // Draw particle — Nvy Blue
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [resize, createParticles]);

  return (
    <>
      {/* Neural particle canvas — covers full viewport, behind everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-[100dvh] pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      {/* Cursor glow — follows mouse, subtle blue radial gradient */}
      <CursorGlow />
    </>
  );
}

/** Separate component so the glow div can track the mouse position */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow-effect"
      aria-hidden="true"
    />
  );
}
