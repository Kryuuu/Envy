import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />
      <Pricing />
      <Footer />
      <LiveChat />
    </main>
  );
}
