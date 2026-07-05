import React, { useState, useEffect } from 'react';
import { ArrowDown, Code2, Sparkles, Terminal, FileDown, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  const [profilePhoto, setProfilePhoto] = useState<string>('https://avatars.githubusercontent.com/u/220545165?v=4');

  useEffect(() => {
    // Purge any stale cache to ensure the user sees the fresh GitHub profile photo
    localStorage.removeItem('profile_photo');

    // Fetch the latest avatar dynamically from GitHub API
    fetch('https://api.github.com/users/Kaan60ozturk')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.avatar_url) {
          setProfilePhoto(data.avatar_url);
        }
      })
      .catch((err) => {
        console.error('GitHub avatar fetch error:', err);
      });
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const codeSnippet = `const developer = {
  name: "Kaan Öztürk",
  title: "Full-Stack Developer",
  coffeeLover: true,
  status: "Müsait",
  skills: [
    "TypeScript", "React", "Node.js", 
    "Vite", "TailwindCSS", "Next.js"
  ],
  interests: [
    "Yapay Zekâ", "Açık Kaynak", 
    "UX Tasarım", "Cloud Native"
  ],
  code: () => "Fikirleri çalışan ürünlere dönüştürüyorum."
};`;

  return (
    <section
      id="hero"
      className="min-h-screen pt-28 pb-16 flex flex-col justify-center bg-gradient-to-b from-[#07122b] via-[#021026] to-[#020612]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* Tagline and Profile Photo */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group shrink-0"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#64d9ff]/40 via-[#cb9cff]/30 to-[#4bc8ff]/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-accent/20 bg-surface-strong">
                  <img
                    src={profilePhoto}
                    alt="Kaan Öztürk"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-strong border border-accent/20 text-[#a8e5ff] rounded-xl font-mono text-[10px] uppercase tracking-widest font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8ed3ff]" />
                Projelere ve İş Birliklerine Açık
              </motion.div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#e7f5ff] tracking-tight leading-[1.1]"
              >
                Geleceğin Web <span className="text-[#e7f5ff] italic relative inline-block">Deneyimlerini</span> Bugünden İnşa Ediyorum
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-[#b7dfff] max-w-xl font-sans font-normal leading-relaxed"
              >
                Ben <strong>Kaan Öztürk</strong>. Modern full-stack teknolojileriyle şık, hızlı ve kullanıcı odaklı web uygulamaları geliştiren bir yazılımcıyım. Fikirlerinizi en güncel standartlarda hayata geçiriyorum.
              </motion.p>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-view-projects-btn"
                onClick={() => handleScrollTo('projects')}
                className="flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#041522] bg-[#6ce0ff] hover:bg-[#48c8ff] active:scale-95 rounded-xl transition-all cursor-pointer"
              >
                Projelerimi İncele
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                id="hero-download-cv-btn"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contact');
                }}
                className="flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#a8e5ff] bg-surface-strong border border-accent/20 hover:bg-[#0a345c] active:scale-95 rounded-xl transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                İletişime Geç
              </a>
            </motion.div>
          </div>

          {/* Right Column: Code Playground UI mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#081b33]/50 to-[#051022]/10 rounded-xl blur-2xl -z-10" />

            {/* Code Window Container */}
            <div className="bg-surface-strong text-[#d7f5ff] rounded-xl border border-accent/15 shadow-accent overflow-hidden font-mono text-sm leading-relaxed max-w-md mx-auto lg:max-w-none">
              {/* Window Header */}
              <div className="bg-[#062d52] border-b border-accent/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0a2d51] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0a2d51] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0a2d51] inline-block" />
                </div>
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#a8d8ff] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#7db7d8]" />
                  kaan_ozturk.ts
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Code Editor body */}
              <div className="p-5 overflow-x-auto text-[13px] bg-[#071a33]/95 scrollbar-thin">
                <pre className="text-[#a8d8ff]">
                  <code>
                    {codeSnippet.split('\n').map((line, i) => {
                      // Colorize code snippet for extra polish
                      let colorized = line;
                      if (line.includes('const ')) {
                        colorized = line.replace('const ', '<span class="text-[#7db7d8] italic">const </span>');
                      }
                      if (line.includes('name:')) {
                        colorized = colorized.replace('name:', '<span class="text-[#d6f5ff] font-medium">name</span>:');
                      }
                      if (line.includes('title:')) {
                        colorized = colorized.replace('title:', '<span class="text-[#d6f5ff] font-medium">title</span>:');
                      }
                      if (line.includes('coffeeLover:')) {
                        colorized = colorized.replace('coffeeLover:', '<span class="text-[#d6f5ff] font-medium">coffeeLover</span>:');
                      }
                      if (line.includes('status:')) {
                        colorized = colorized.replace('status:', '<span class="text-[#d6f5ff] font-medium">status</span>:');
                      }
                      if (line.includes('skills:')) {
                        colorized = colorized.replace('skills:', '<span class="text-[#d6f5ff] font-medium">skills</span>:');
                      }
                      if (line.includes('interests:')) {
                        colorized = colorized.replace('interests:', '<span class="text-[#d6f5ff] font-medium">interests</span>:');
                      }
                      if (line.includes('code:')) {
                        colorized = colorized.replace('code:', '<span class="text-[#a8d8ff] italic font-medium">code</span>:');
                      }
                      return (
                        <div key={i} className="table-row">
                          <span className="table-cell text-[#7db7d8] text-right pr-4 select-none w-5 text-[11px]">{i + 1}</span>
                          <span className="table-cell" dangerouslySetInnerHTML={{ __html: colorized }} />
                        </div>
                      );
                    })}
                  </code>
                </pre>
              </div>
              
              {/* Terminal footer mock */}
              <div className="bg-[#062d52] border-t border-accent/20 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-[#9fdfff] uppercase tracking-widest">
                <span>UTF-8</span>
                <span>TypeScript</span>
              </div>
            </div>

            {/* Little Float UI Elements */}
            <div className="absolute -bottom-6 -right-2 bg-surface-strong border border-accent/20 rounded-xl p-3 shadow-accent flex items-center gap-2.5 max-w-[190px]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4bc8ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8ed3ff]"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a6e4ff] font-semibold leading-none">Aktif Çalışıyor</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative arrow down to scroll */}
      <div className="flex justify-center mt-12">
        <button
          id="hero-scroll-down-btn"
          onClick={() => handleScrollTo('experience')}
          className="p-2.5 text-[#9ed4ff] hover:text-[#e7f5ff] bg-[#041b33] border border-[#4bc8ff]/15 hover:border-[#64d9ff]/40 rounded-full shadow-sm hover:shadow-md transition-all animate-bounce cursor-pointer"
          title="Aşağı Kaydır"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
