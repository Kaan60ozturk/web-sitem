import { useState, useMemo, useEffect } from 'react';
import { Github, Search, ChevronRight, X, Cpu, Terminal, Monitor, Info, Loader2, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Project } from '../types';

const MarkdownComponents = {
  h1: (props: any) => <h1 className="text-xl font-serif font-bold text-[#e7f5ff] border-b border-[#64d9ff]/20 pb-2 mt-6 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-lg font-serif font-semibold text-[#d6efff] border-b border-[#64d9ff]/15 pb-1 mt-5 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-base font-serif font-medium text-[#c6ecff] mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-sm font-sans text-[#b7dcff] leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside space-y-2 mb-4 text-[#b7dcff] pl-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-2 mb-4 text-[#b7dcff] pl-2" {...props} />,
  li: (props: any) => <li className="text-sm font-sans text-[#c7e9ff]" {...props} />,
  code: ({ node, ...props }: any) => <code className="px-1.5 py-0.5 bg-[#061e38] border border-[#6de0ff]/15 rounded font-mono text-[12px] text-[#d6f5ff]" {...props} />,
  pre: (props: any) => <pre className="p-4 bg-[#061e38] border border-[#6de0ff]/15 rounded-xl font-mono text-xs overflow-x-auto text-[#d6f5ff] mb-4 whitespace-pre-wrap" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-[#64d9ff]/20 pl-4 italic text-[#98d8ff] mb-4" {...props} />,
  a: (props: any) => <a className="text-[#8ed3ff] hover:text-[#e7f5ff] underline decoration-[#64d9ff]/40 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  img: ({ node, ...props }: any) => <img className="max-w-full h-auto my-6 rounded-xl border border-[#6de0ff]/15 mx-auto block shadow-[0_18px_60px_rgba(72,200,255,0.18)]" referrerPolicy="no-referrer" {...props} />
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web' | 'ai' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'readme'>('overview');
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [readmeImageUrl, setReadmeImageUrl] = useState<string | null>(null);
  const [readmeStatus, setReadmeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [readmeError, setReadmeError] = useState<string>('');

  const extractFirstReadmeImage = (content: string): string | null => {
    const markdownImgMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/i);
    if (markdownImgMatch?.[1]) {
      return markdownImgMatch[1];
    }

    const htmlImgMatch = content.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (htmlImgMatch?.[1]) {
      return htmlImgMatch[1];
    }

    return null;
  };

  useEffect(() => {
    if (!selectedProject) {
      setReadmeContent('');
      setReadmeImageUrl(null);
      setReadmeStatus('idle');
      setReadmeError('');
      setActiveTab('overview');
      return;
    }

    setActiveTab('overview');
    const repoName = selectedProject.githubUrl.split('/').pop() || '';
    if (!repoName) {
      setReadmeStatus('error');
      setReadmeError('Repo ismi tespit edilemedi.');
      return;
    }

    setReadmeStatus('loading');
    setReadmeError('');

    let isMounted = true;

    fetch(`/api/github/readme?repo=${encodeURIComponent(repoName)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('README dosyası yüklenemedi.');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success) {
            setReadmeContent(data.content);
            setReadmeImageUrl(extractFirstReadmeImage(data.content));
            setReadmeStatus('success');
          } else {
            setReadmeStatus('error');
            setReadmeError(data.error || 'README alınamadı.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setReadmeStatus('error');
          setReadmeError(err.message || 'README yüklenirken bir hata oluştu.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProject?.id]);

  const projects: Project[] = [
    {
      id: 'proj-1',
      title: 'DocuMind',
      description: 'Yapay zekâ tabanlı akıllı doküman analiz ve soru-cevap asistanı. PDF ve diğer belgeleri tarayarak metin analizi gerçekleştirir.',
      longDescription: 'DocuMind, belgelerinizi yükleyip üzerlerinde akıllı analizler ve soru-cevap işlemleri gerçekleştirmenizi sağlayan Python ve yapay zekâ tabanlı bir asistan platformudur. Büyük dil modellerini (LLM) kullanarak metin içerisindeki kritik verileri ve yapılandırılmış özetleri hızlıca önünüze getirir.',
      category: 'ai',
      tags: ['Python', 'Yapay Zekâ', 'NLP', 'LLM', 'RAG'],
      githubUrl: 'https://github.com/Kaan60ozturk/DocuMind',
      liveUrl: 'https://github.com/Kaan60ozturk/DocuMind',
      features: [
        'PDF ve çoklu formatta doküman yükleme desteği',
        'Yüklenen belgelere yönelik yapay zekâ destekli anlık soru-cevap',
        'Gelişmiş metin parçalama (chunking) ve vektör tabanlı arama optimizasyonu',
        'Hassas veriler için güvenli yerel/bulut analiz mimarisi'
      ]
    },
    {
      id: 'proj-2',
      title: 'PassVault',
      description: 'Güvenli şifre saklama, rastgele güçlü şifreler üretme ve şifre geçmişinizi yerel olarak takip etme aracı.',
      longDescription: 'PassVault, hassas bilgilerinizi ve şifrelerinizi güvenli bir şekilde depolamanıza, hatırlanması kolay ama kırılması zor şifreler oluşturmanıza ve geçmiş şifrelerinizi kontrol altında tutmanıza yardımcı olan modern bir şifre yönetim uygulamasıdır.',
      category: 'web',
      tags: ['TypeScript', 'React', 'Cryptography', 'Local Storage', 'TailwindCSS'],
      githubUrl: 'https://github.com/Kaan60ozturk/PassVault',
      liveUrl: 'https://github.com/Kaan60ozturk/PassVault',
      features: [
        'Gelişmiş şifre oluşturucu (güç, özel karakter, uzunluk ayarları)',
        'Tarayıcı tabanlı güvenli yerel şifreleme ve saklama',
        'Tüm geçmiş şifrelerinizi görebileceğiniz arşivleme sistemi',
        'Kullanıcı dostu ve hızlı arayüz tasarımı'
      ]
    },
    {
      id: 'proj-3',
      title: 'Görüntü İşleme',
      description: 'Python tabanlı bilgisayarlı görü (computer vision) ve görüntü işleme algoritmaları kütüphanesi.',
      longDescription: 'goruntu-isleme, görüntü işleme ve bilgisayarlı görü alanındaki temel algoritmaların, filtrelerin ve modelleme çalışmalarının yer aldığı Python ve OpenCV tabanlı kapsamlı bir geliştirme projesidir.',
      category: 'ai',
      tags: ['Python', 'OpenCV', 'Bilgisayarlı Görü', 'Görüntü İşleme', 'NumPy'],
      githubUrl: 'https://github.com/Kaan60ozturk/goruntu-isleme',
      liveUrl: 'https://github.com/Kaan60ozturk/goruntu-isleme',
      features: [
        'OpenCV ile gerçek zamanlı görüntü ve video analizi',
        'Filtreleme, kenar belirleme ve renk uzayı dönüşümleri',
        'Gelişmiş nesne algılama ve segmentasyon uygulamaları',
        'Yapay sinir ağları destekli özel görüntü sınıflandırma modülleri'
      ]
    },
    {
      id: 'proj-4',
      title: 'Hardware Health Status',
      description: 'C# ile geliştirilmiş, donanım kaynaklarını ve sistem sağlığını gerçek zamanlı izleyen sistem asistanı.',
      longDescription: 'hardware-health, işletim sistemi üzerindeki CPU, RAM, disk ve diğer kritik donanım bileşenlerinin sağlık durumlarını, kullanım sıcaklıklarını ve yük oranlarını anlık olarak izleyen ve raporlayan C# tabanlı bir donanım analitik uygulamasıdır.',
      category: 'other',
      tags: ['C#', '.NET', 'WMI API', 'Sistem İzleme', 'Performans Analizi'],
      githubUrl: 'https://github.com/Kaan60ozturk/hardware-health',
      liveUrl: 'https://github.com/Kaan60ozturk/hardware-health',
      features: [
        'Gerçek zamanlı CPU, RAM ve Disk performansı ölçümü',
        'Sistem sıcaklığı ve kaynak tüketim limit uyarıları',
        'Donanım verilerini görselleştiren arka plan servis mimarisi',
        'Düşük sistem kaynağı kullanımı ile arka planda izleme'
      ]
    },
    {
      id: 'proj-5',
      title: 'Local Web Scanner',
      description: 'TypeScript tabanlı yerel ağ ve web güvenlik açığı tarayıcısı. Ağ analizi ve potansiyel zafiyetleri tespit eder.',
      longDescription: 'localwebscanner, yerel web uygulamalarını ve ağ servislerini tarayarak yaygın güvenlik açıklarını, açık portları ve zayıf yapılandırmaları tespit etmeyi amaçlayan TypeScript tabanlı bir siber güvenlik tarayıcı yazılımıdır.',
      category: 'web',
      tags: ['TypeScript', 'Node.js', 'Siber Güvenlik', 'Ağ Tarayıcı', 'API Testing'],
      githubUrl: 'https://github.com/Kaan60ozturk/localwebscanner',
      liveUrl: 'https://github.com/Kaan60ozturk/localwebscanner',
      features: [
        'Hızlı port tarama ve ağ üzerindeki canlı cihazları algılama',
        'Web sunucu başlıklarından sürüm ve zafiyet eşleştirmesi',
        'Siber güvenlik analizi için esnek raporlama sistemi',
        'TypeScript ile geliştirilmiş yüksek performanslı eş zamanlı tarama'
      ]
    },
    {
      id: 'proj-6',
      title: 'LinkedIn Profil Özetleyici',
      description: 'LinkedIn profillerini yapay zekâ kullanarak saniyeler içinde analiz edip özet çıkaran Chrome tarayıcı eklentisi.',
      longDescription: 'Bu tarayıcı eklentisi, LinkedIn profillerini gezerken tek tıkla adayın veya kullanıcının deneyimlerini, yeteneklerini ve kariyer geçmişini yapay zekâ gücüyle analiz ederek hızlı, anlamlı ve yapılandırılmış profesyonel özetler çıkarır.',
      category: 'ai',
      tags: ['JavaScript', 'Chrome Extension', 'Yapay Zekâ', 'Web Scraping'],
      githubUrl: 'https://github.com/Kaan60ozturk/chrome-linkedin-profil-ozetleyici-uzantisi',
      liveUrl: 'https://github.com/Kaan60ozturk/chrome-linkedin-profil-ozetleyici-uzantisi',
      features: [
        'Doğrudan LinkedIn arayüzüne entegre olan şık özetleme paneli',
        'Kariyer geçmişindeki öne çıkan başarıları ve yetenekleri ayrıştırma',
        'İşe alım yöneticileri için aday ön inceleme sürelerini kısaltma',
        'Hızlı ve hafif Chrome Extension V3 mimarisi'
      ]
    },
    {
      id: 'proj-7',
      title: 'MapShare Web',
      description: 'TypeScript tabanlı interaktif harita paylaşım ve lokasyon işaretleme web uygulaması.',
      longDescription: 'mapshare-web, haritalar üzerinde özel lokasyonlar işaretlemeyi, rotalar oluşturmayı ve bu haritaları arkadaşlarınızla veya ekibinizle anında paylaşmayı sağlayan modern, etkileşimli bir web platformudur.',
      category: 'web',
      tags: ['TypeScript', 'React', 'Leaflet', 'Google Maps', 'TailwindCSS'],
      githubUrl: 'https://github.com/Kaan60ozturk/mapshare-web',
      liveUrl: 'https://github.com/Kaan60ozturk/mapshare-web',
      features: [
        'Etkileşimli harita üzerinde özel pinler, çizimler ve rotalar ekleme',
        'Oluşturulan haritalar için benzersiz paylaşım linkleri üretme',
        'Gerçek zamanlı harita senkronizasyonu ve ortak çalışma alanı',
        'Mobil cihazlarla tam uyumlu, hassas GPS lokasyon desteği'
      ]
    },
    {
      id: 'proj-8',
      title: 'ElementCopy',
      description: 'Web sitelerindeki DOM elemanlarını, tasarımları ve stil sınıflarını kopyalamayı kolaylaştıran yardımcı geliştirici aracı.',
      longDescription: 'ElementCopy, tasarımcıların ve ön uç geliştiricilerin web sitelerini incelerken beğendikleri herhangi bir arayüz elemanını, CSS stillerini ve HTML yapısını bozmadan kopyalayıp kendi projelerine aktarmalarını sağlayan pratik bir yardımcı araçtır.',
      category: 'web',
      tags: ['JavaScript', 'DOM Manipulation', 'CSS Parser', 'Web Utility'],
      githubUrl: 'https://github.com/Kaan60ozturk/ElementCopy',
      liveUrl: 'https://github.com/Kaan60ozturk/ElementCopy',
      features: [
        'Sürükleme ve tıklama ile dilediğiniz DOM düğümünü hassas seçme',
        'Tüm ilişkili CSS stillerini ve Tailwind sınıflarını otomatik ayrıştırma',
        'Tek tıkla panoya (clipboard) kopyalayarak temiz kod aktarımı',
        'Geliştirici dostu, hafif ve yüksek performanslı çalışma'
      ]
    }
  ];

  // Filters logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 bg-surface border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#98d8ff] font-bold block mb-2.5">
            Portfolyo
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#e7f5ff] tracking-tight">
            Öne Çıkan Projelerim
          </h2>
          <p className="mt-4 text-[#b7dcff] font-sans leading-relaxed">
            Fikir aşamasından yayına kadar geliştirip hayata geçirdiğim bazı teknik çalışmalarım.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-surface border border-accent/10 rounded-xl w-full md:w-auto">
            <button
              id="category-tab-all"
              onClick={() => setSelectedCategory('all')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors focus:outline-none cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#064b8c] text-[#e7f5ff] border border-[#64d9ff]/30 shadow-sm'
                  : 'text-[#a8d8ff] hover:text-[#e7f5ff]'
              }`}
            >
              Hepsi
            </button>
            <button
              id="category-tab-web"
              onClick={() => setSelectedCategory('web')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors focus:outline-none cursor-pointer ${
                selectedCategory === 'web'
                  ? 'bg-[#064b8c] text-[#e7f5ff] border border-[#64d9ff]/30 shadow-sm'
                  : 'text-[#a8d8ff] hover:text-[#e7f5ff]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-[#6de0ff]" />
              Web
            </button>
            <button
              id="category-tab-ai"
              onClick={() => setSelectedCategory('ai')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors focus:outline-none cursor-pointer ${
                selectedCategory === 'ai'
                  ? 'bg-[#064b8c] text-[#e7f5ff] border border-[#64d9ff]/30 shadow-sm'
                  : 'text-[#a8d8ff] hover:text-[#e7f5ff]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#6de0ff]" />
              Yapay Zekâ
            </button>
            <button
              id="category-tab-other"
              onClick={() => setSelectedCategory('other')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors focus:outline-none cursor-pointer ${
                selectedCategory === 'other'
                  ? 'bg-[#064b8c] text-[#e7f5ff] border border-[#64d9ff]/30 shadow-sm'
                  : 'text-[#a8d8ff] hover:text-[#e7f5ff]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#6de0ff]" />
              Sistem & Araçlar
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ed3ff]" />
            <input
              id="project-search-input"
              type="text"
              placeholder="Proje veya teknoloji ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#071b38] border border-accent/10 rounded-xl text-sm text-[#d6f2ff] focus:outline-none focus:border-[#6de0ff] transition-all placeholder:text-[#8abed3]"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#aacfff] hover:text-[#e7f5ff] rounded-xl hover:bg-[#0a375f]/70"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          id="projects-grid"
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                id={`project-card-${project.id}`}
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#051427]/80 border border-[#0d3c67]/30 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#64d9ff]/40 hover:bg-[#06243c]/80 transition-all group"
              >
                {/* Body */}
                <div className="p-3 sm:p-4 space-y-3">
                  {/* Category badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-accent/10 bg-[#0b3a69]/90 text-[#a8d8ff] rounded-xl font-mono text-[8px] uppercase tracking-wider">
                    {project.category === 'web' ? 'Web Geliştirme' : project.category === 'ai' ? 'Yapay Zekâ (AI)' : 'Sistem & Araçlar'}
                  </span>

                  <h3 className="text-base font-serif font-bold text-[#e7f5ff] group-hover:text-[#c5f3ff] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm md:text-[12px] text-[#b9e1ff] font-sans leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-[#0b3a69]/95 border border-accent/10 text-[#a8d8ff] font-mono text-[9px] rounded-xl"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-3 py-3 bg-[#062d52] border-t border-accent/20 flex items-center justify-between">
                  <button
                    id={`view-details-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#a8d8ff] hover:text-[#e7f5ff] transition-colors cursor-pointer"
                  >
                    Detayları İncele
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      id={`github-link-${project.id}`}
                      href={project.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#a8d8ff] hover:text-[#e7f5ff] rounded-xl hover:bg-[#0b436e] transition-colors"
                      title="Kaynak Kod"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div id="projects-empty-state" className="text-center py-16 bg-[#081f3b]/80 border border-accent/10 rounded-xl max-w-md mx-auto mt-12">
            <p className="text-[#9ed4ff] text-sm font-sans">Aramanıza uygun proje bulunamadı.</p>
            <button
              id="reset-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-[#6de0ff] hover:bg-[#47c8ff] text-[#041522] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            id="project-details-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              id="project-details-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c0c0c] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-[#186391]/15"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#64d9ff]/15 flex items-center justify-between bg-[#062046]">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-[#64d9ff]/15 bg-[#031a33] text-[#a8d8ff] rounded-xl text-[10px] font-mono uppercase tracking-wider">
                  {selectedProject.category === 'web' ? 'Web Geliştirme' : selectedProject.category === 'ai' ? 'Yapay Zekâ (AI)' : 'Sistem & Araçlar'}
                </span>
                <button
                  id="close-modal-btn"
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 text-[#aacfff] hover:text-[#e7f5ff] hover:bg-[#0a375f]/70 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-[#64d9ff]/15 bg-[#041924] px-6">
                <button
                  id="tab-overview"
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-4 text-xs font-mono uppercase tracking-wider border-b-2 font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-[#d6f5ff] text-[#e7f5ff]'
                      : 'border-transparent text-[#aacfff] hover:text-[#e7f5ff]'
                  }`}
                >
                  Genel Bakış
                </button>
                <button
                  id="tab-readme"
                  onClick={() => setActiveTab('readme')}
                  className={`py-3 px-4 text-xs font-mono uppercase tracking-wider border-b-2 font-semibold transition-all cursor-pointer ${
                    activeTab === 'readme'
                      ? 'border-[#d6f5ff] text-[#e7f5ff]'
                      : 'border-transparent text-[#aacfff] hover:text-[#e7f5ff]'
                  }`}
                >
                  README.md
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-[#b7dfff]">
                {activeTab === 'overview' ? (
                  <>
                    {readmeImageUrl && (
                      <div className="rounded-xl overflow-hidden border border-[#64d9ff]/15 mb-6">
                        <img
                          src={readmeImageUrl}
                          alt={`${selectedProject.title} önizleme`}
                          className="w-full h-auto object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#e7f5ff]">
                        {selectedProject.title}
                      </h3>
                      <p className="mt-3 text-sm text-[#b7dcff] font-sans leading-relaxed">
                        {selectedProject.longDescription || selectedProject.description}
                      </p>
                    </div>

                    {/* Key Features List */}
                    {selectedProject.features && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold text-[#c7e9ff] tracking-wider uppercase">
                          Temel Özellikler
                        </h4>
                        <ul className="space-y-2.5 text-sm text-[#b7dcff] leading-relaxed list-disc list-inside marker:text-[#64d9ff]">
                          {selectedProject.features.map((feature, fIdx) => (
                            <li key={fIdx} className="pl-0.5">
                              <span className="font-sans">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies used */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-bold text-zinc-300 tracking-wider uppercase">
                        Kullanılan Teknolojiler
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 bg-[#061c33] border border-[#64d9ff]/15 text-[#b7dcff] text-xs font-mono rounded-xl"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {readmeStatus === 'loading' && (
                      <div className="flex flex-col items-center justify-center py-12 text-[#aacfff] space-y-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#64d9ff]" />
                        <span className="text-xs font-mono text-[#c7e9ff]">README dosyası yükleniyor...</span>
                      </div>
                    )}

                    {readmeStatus === 'error' && (
                      <div className="p-5 bg-[#04192b] border border-[#186391]/15 rounded-xl space-y-4 text-center">
                        <div className="inline-flex p-2 bg-[#06223e] border border-[#1a8ad0]/15 rounded-xl text-red-500 mx-auto">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-serif font-semibold text-[#e7f5ff]">README Yüklenemedi</h4>
                          <p className="text-xs text-[#8dc9ed] font-sans leading-relaxed max-w-sm mx-auto">
                            {readmeError || "README dosyası otomatik olarak alınamadı."}
                          </p>
                        </div>
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06223e] hover:bg-[#0b3d65] text-[#c7e9ff] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
                        >
                          <Github className="w-4 h-4" />
                          Doğrudan GitHub'da Gör
                        </a>
                      </div>
                    )}

                    {readmeStatus === 'success' && (
                      <div className="prose prose-invert max-w-none text-[#c7e9ff]">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
                          {readmeContent}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#041827] border-t border-[#186391]/15 flex items-center justify-end gap-3">
                <a
                  id="modal-github-btn"
                  href={selectedProject.githubUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#c7e9ff] bg-[#06223e] border border-[#4bc8ff]/15 hover:bg-[#0b3d65] rounded-xl transition-all"
                >
                  <Github className="w-4 h-4" />
                  Kodları İncele
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
