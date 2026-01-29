import { Github, Instagram, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-white/10 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left Spacer (or Logo if needed later) */}
        <div className="hidden md:block"></div>

        <div className="text-center order-first md:order-none">
          <p>&copy; {new Date().getFullYear()} Envy. All rights reserved.</p>
        </div>
        
        <div className="flex justify-center md:justify-end space-x-6">
          <a href="#" className="hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
