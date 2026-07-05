import { Code2, Brain, Shield, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { SkillCategory } from '../types';

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Ön Yüz (Frontend) Teknolojileri',
      skills: [
        { name: 'React', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Vite', level: 85 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'HTML5 & CSS3', level: 90 }
      ]
    },
    {
      title: 'Arka Yüz (Backend) & Yapay Zeka',
      skills: [
        { name: 'Node.js (Fastify/Express)', level: 85 },
        { name: 'Supabase / PostgreSQL / SQLite', level: 80 },
        { name: 'Google Gemini, Embedding & RAG', level: 85 },
        { name: 'Edge Functions & RLS / SSE', level: 80 },
        { name: 'Python (PyMuPDF & OpenCV)', level: 90 }
      ]
    },
    {
      title: 'Sistem, Oyun & DevOps / Araçlar',
      skills: [
        { name: 'C# / WPF & .NET', level: 85 },
        { name: 'Unity 3B Oyun Geliştirme', level: 80 },
        { name: 'Git & GitHub / GitHub Actions', level: 90 },
        { name: 'Docker / Bulut & DevOps', level: 75 },
        { name: 'Microsoft Excel (Ön Muhasebe)', level: 85 }
      ]
    }
  ];

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code2 className="w-5 h-5 text-[#8fd4ff]" />;
      case 1:
        return <Brain className="w-5 h-5 text-[#8fd4ff]" />;
      default:
        return <Shield className="w-5 h-5 text-[#8fd4ff]" />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-surface border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#98d8ff] font-bold block mb-2.5">
            Yetenekler
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#e7f5ff] tracking-tight">
            Yetenekler & Yetkinlikler
          </h2>
          <p className="mt-4 text-[#b7dcff] font-sans leading-relaxed">
            Kullandığım, uzmanlaştığım ve projelerimde aktif olarak tercih ettiğim teknoloji kütüphanesi.
          </p>
        </div>

        {/* Skills Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => {
            return (
              <motion.div
                id={`skill-category-${idx}`}
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-8 rounded-xl border border-accent/10 bg-surface hover:border-[#64d9ff]/30 hover:bg-[#062d52] transition-all flex flex-col justify-between shadow-accent"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="p-2.5 bg-[#0b3a69]/95 border border-accent/10 rounded-xl shadow-xs inline-flex">
                      {getCategoryIcon(idx)}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#e7f5ff] leading-none">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills Progress Lines */}
                  <div className="space-y-5">
                    {category.skills.map((skill, sIdx) => (
                      <div id={`skill-item-${idx}-${sIdx}`} key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-sans font-medium text-[#b7e3ff]">
                            {skill.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#91cbf7]">
                            {skill.level}%
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="w-full h-1 bg-[#061c38] border border-[#64d9ff]/15 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-[#6de0ff] via-[#4bc8ff] to-[#72d6ff] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footnote Badge */}
                <div className="mt-8 pt-4 border-t border-accent/20 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#6de0ff]" />
                  <span className="text-xs text-[#a8d8ff] font-medium font-sans">
                    Gerçek projelerle kanıtlanmış pratik tecrübe.
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
