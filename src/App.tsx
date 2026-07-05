import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import { ArrowUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll state for Scroll-to-Top CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to dynamically highlight header navigation
  useEffect(() => {
    const sectionIds = ['hero', 'projects', 'skills', 'contact'];
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px' // Trigger activation when the section covers the upper-middle part of viewport
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="app-container" className="min-h-screen flex flex-col justify-between selection:bg-[#64d9ff]/20 selection:text-[#a1d9ff]">
      {/* Dynamic Header */}
      <Header activeSection={activeSection} />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Styled Footer */}
      <footer id="app-footer" className="bg-surface border-t border-accent text-[#cde9ff] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <span className="block font-serif font-bold text-lg text-zinc-100">
                Kaan Öztürk
              </span>
              <span className="text-sm">
                Full-Stack Geliştirici Portfolyosu &copy; {new Date().getFullYear()}
              </span>
            </div>

            {/* Quick tech credentials */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span>Built with</span>
              <span className="px-2 py-0.5 bg-surface-strong text-[#99d9ff] border border-accent rounded-sm font-mono">React 19</span>
              <span>&middot;</span>
              <span className="px-2 py-0.5 bg-surface-strong text-[#99d9ff] border border-accent rounded-sm font-mono">Vite</span>
              <span>&middot;</span>
              <span className="px-2 py-0.5 bg-surface-strong text-[#99d9ff] border border-accent rounded-sm font-mono">Tailwind CSS</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span>Sevgilerle tasarlanmıştır</span>
              <Heart className="w-3.5 h-3.5 text-zinc-600 fill-zinc-700" />
            </div>
          </div>
        </div>
      </footer>

      {/* Float Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-surface-strong border border-accent hover:bg-[#0c365d] text-[#d8f3ff] rounded-sm shadow-accent transition-all cursor-pointer z-40 active:scale-95 focus:outline-none"
            aria-label="Yukarı Çık"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
