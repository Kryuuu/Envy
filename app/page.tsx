import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certificates from "@/components/Certificates";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import NeuralBackground from "@/components/NeuralBackground";

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden relative">
      <NeuralBackground />
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Skills />
      <Projects />
      <Experience />
      <Certificates limit={4} showViewAll />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
      <LiveChat />
    </main>
  );
}
