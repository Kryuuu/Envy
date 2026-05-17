import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certificates from "@/components/Certificates";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import NeuralBackground from "@/components/NeuralBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <NeuralBackground />
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Skills />
      <Certificates limit={4} showViewAll />
      <About />
      <Contact />
      <Footer />
      <LiveChat />
    </main>
  );
}
