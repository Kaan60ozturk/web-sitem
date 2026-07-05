import { useState, useEffect } from 'react';
import { Menu, X, Mail, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Giriş' },
    { id: 'projects', label: 'Projeler' },
    { id: 'skills', label: 'Yetenekler' },
    { id: 'contact', label: 'İletişim' }
  ];

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-strong/95 backdrop-blur-xl border-b border-accent/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            id="header-logo-btn"
            onClick={() => handleScrollTo('hero')}
            className="flex items-center group cursor-pointer text-left focus:outline-none"
          >
            <div>
              <span className="block font-serif font-bold text-[#e7f5ff] tracking-tight text-base leading-none">
                Kaan Öztürk
              </span>
              <span className="block font-sans text-[10px] text-[#98d8ff] uppercase tracking-widest font-semibold mt-0.5">
                Full-Stack Geliştirici
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#e7f5ff] font-semibold border-b-2 border-[#64d9ff]/40 pb-1' : 'text-[#aacfff] hover:text-[#e7f5ff] hover:bg-[#0a2b4f]/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#6de0ff] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Contact Badges / Social Links */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="header-social-github"
              href="https://github.com/Kaan60ozturk"
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="p-2 text-[#aacfff] hover:text-[#e7f5ff] hover:bg-[#0a375f]/70 rounded-xl transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              id="header-social-linkedin"
              href="https://www.linkedin.com/in/kaan-%C3%B6zt%C3%BCrk-a7901b294/"
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="p-2 text-[#aacfff] hover:text-[#e7f5ff] hover:bg-[#0a375f]/70 rounded-xl transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              id="header-contact-cta"
              onClick={() => handleScrollTo('contact')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#c7efff] hover:text-[#ffffff] bg-[#062a52] border border-[#6de0ff]/20 hover:border-[#8fe3ff] rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              İletişime Geç
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#aacfff] hover:text-[#e7f5ff] hover:bg-[#0b3b6b] rounded-xl transition-colors"
            aria-label="Menüyü Aç"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#062a52] border-b border-[#6de0ff]/15 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  id={`mobile-nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#0b3b6f] text-[#e7f5ff] font-semibold border-l-2 border-[#64d9ff]/40 pl-3'
                      : 'text-[#aacfff] hover:bg-[#0a375f]/70 hover:text-[#e7f5ff]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-[#5fd3ff]/15 flex items-center justify-between px-4">
                <div className="flex gap-4">
                  <a
                    id="mobile-social-github"
                    href="https://github.com/Kaan60ozturk"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="p-2 text-[#aacfff] hover:text-[#e7f5ff] rounded-xl"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    id="mobile-social-linkedin"
                    href="https://www.linkedin.com/in/kaan-%C3%B6zt%C3%BCrk-a7901b294/"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="p-2 text-[#aacfff] hover:text-[#e7f5ff] rounded-xl"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
                <button
                  id="mobile-contact-cta"
                  onClick={() => handleScrollTo('contact')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#041522] bg-[#6de0ff] hover:bg-[#47c8ff] rounded-xl"
                >
                  <Mail className="w-4 h-4" />
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
