import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { Experience as ExperienceType } from '../types';

export default function Experience() {
  const experiences: ExperienceType[] = [
    {
      id: 'exp1',
      role: 'Ürün Geliştirici (Start-up)',
      company: 'Yapay Zeka Destekli İK SaaS',
      location: 'Teknoloji Transfer Ofisi Destekli Bilimsel Araştırma Projesi',
      startDate: '2026',
      endDate: 'Günümüz',
      description: [
        'Projenin Teknoloji Transfer Ofisi tarafından bilimsel araştırma projesi kapsamında bütçe desteği almaya hak kazanmasında rol aldım.',
        'React & TypeScript (Vite), Node.js BFF, Supabase/PostgreSQL, RLS, kimlik doğrulama ve Edge Functions ile uçtan uca ürün geliştirme süreçlerini yürüttüm.',
        'Google Gemini, embedding + RAG, Apify, Filika, Resend, iyzico/PayTR, web push, iCal ve cron tabanlı otomasyonları başarıyla entegre ettim.'
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Supabase', 'PostgreSQL', 'Google Gemini', 'RAG', 'Edge Functions', 'Cron Automation']
    },
    {
      id: 'exp2',
      role: 'Muhasebe Stajyeri',
      company: 'Parkzon Güvenlik Sistemleri',
      location: 'İstanbul, Türkiye · Ofiste',
      startDate: 'Temmuz 2025',
      endDate: 'Kasım 2025',
      description: [
        'Uyumsoft ve Mikro ön muhasebe yazılımlarıyla muhasebe süreçlerine destek verdim.',
        'Microsoft Excel kullanarak yıl sonu hesaplarına ve finansal raporlamalara katkıda bulundum.'
      ],
      skills: ['Uyumsoft', 'Mikro', 'Microsoft Excel', 'Ön Muhasebe']
    }
  ];

  return (
    <section id="experience" className="py-24 bg-surface border-y border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8fd4ff] font-bold block mb-2.5">
            Geçmiş & Kariyer
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#e7f5ff] tracking-tight">
            İş Deneyimi & Profesyonel Geçmiş
          </h2>
          <p className="mt-4 text-[#b7dcff] font-sans leading-relaxed">
            Yazılım geliştirme serüvenim boyunca edindiğim teknik birikim ve kurumsal tecrübelerim.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-accent/20 ml-4 md:ml-32 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              id={`experience-item-${exp.id}`}
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Marker Icon */}
              <span className="absolute -left-4 top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#041b33] border-2 border-[#5fd3ff]/20 text-[#a8d8ff]">
                <Briefcase className="w-4 h-4" />
              </span>

              {/* Year Indicator on left for medium screens + */}
              <div className="hidden md:block absolute right-full top-2 pr-12 text-right w-32">
                <span className="text-sm font-serif font-semibold text-[#d6f5ff] block leading-none">
                  {exp.endDate}
                </span>
                <span className="text-xs text-[#8fd4ff] font-mono uppercase tracking-widest block mt-1.5">
                  {exp.startDate}
                </span>
              </div>

              {/* Experience Card */}
              <div className="bg-surface border border-accent/10 rounded-xl p-6 sm:p-8 hover:border-[#64d9ff]/30 hover:bg-[#062d52] transition-all shadow-accent">
                {/* Header for small screens */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#e7f5ff] leading-snug">
                      {exp.role}
                    </h3>
                    <p className="text-[#b7dcff] font-medium mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  
                  {/* Date Badge (Mobile Only) */}
                  <div className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 bg-[#062a52] border border-[#64d9ff]/15 text-[#a8d8ff] text-[10px] font-mono uppercase tracking-widest rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-[#7db7d8]" />
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>

                {/* Location Badge */}
                <div className="flex items-center gap-1.5 text-[#9ed4ff] text-xs font-medium mb-5">
                  <MapPin className="w-3.5 h-3.5 text-[#7db7d8]" />
                  {exp.location}
                </div>

                {/* Details List */}
                <ul className="space-y-3 mb-6 text-sm text-[#c7e9ff] leading-relaxed list-disc list-inside marker:text-[#82b8e9]">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      <span className="font-sans">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 bg-[#08315a] border border-[#64d9ff]/15 text-[#a8d8ff] rounded-xl text-[10px] font-mono tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
