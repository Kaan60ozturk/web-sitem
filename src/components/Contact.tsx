import { useState, useEffect, FormEvent } from 'react';
import { Mail, MapPin, Send, MessageSquareCode, CheckCircle2, AlertCircle, Trash2, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage } from '../types';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Status and Local DB states
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<ContactMessage[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('kaan_portfolio_messages');
    if (saved) {
      try {
        setSentMessages(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading sent messages', err);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      setStatus('error');
      setErrorMessage('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newMessage: ContactMessage = {
          id: `msg-${Date.now()}`,
          name,
          email,
          subject,
          message,
          date: new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        const updatedMessages = [newMessage, ...sentMessages];
        setSentMessages(updatedMessages);
        localStorage.setItem('kaan_portfolio_messages', JSON.stringify(updatedMessages));

        // Reset form fields
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setStatus('success');

        // Revert status to idle after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.');
      }
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setStatus('error');
      setErrorMessage('Bir bağlantı hatası oluştu. Lütfen internetinizi kontrol edin veya daha sonra tekrar deneyin.');
    }
  };

  const handleDeleteMessage = (id: string) => {
    const updated = sentMessages.filter((m) => m.id !== id);
    setSentMessages(updated);
    localStorage.setItem('kaan_portfolio_messages', JSON.stringify(updated));
  };

  return (
    <section id="contact" className="py-24 bg-surface border-t border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#98d8ff] font-bold block mb-2.5">
            İletişim
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#e7f5ff] tracking-tight">
            Benimle İletişime Geçin
          </h2>
          <p className="mt-4 text-[#b7dcff] font-sans leading-relaxed">
            Yeni bir proje teklifi, teknik bir soru veya sadece sohbet etmek için bana dilediğiniz an yazabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Direct info & social */}
          <div className="lg:col-span-5 space-y-8 h-full">
            <div className="h-full bg-surface border border-accent/10 rounded-xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-accent">
              <h3 className="text-lg font-serif font-bold text-[#e7f5ff]">
                İletişim Bilgileri
              </h3>
              <p className="text-sm text-[#b7dcff] leading-relaxed">
                Aşağıdaki doğrudan iletişim kanallarını kullanabilir veya formu doldurarak bana anında mesaj gönderebilirsiniz.
              </p>

              <div className="space-y-4">
                {/* Email Info */}
                <div className="flex items-start gap-4">
                  <span className="p-3 bg-[#062a52] border border-[#6de0ff]/15 text-[#a8d8ff] rounded-xl inline-block">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-mono font-bold text-[#8fd4ff] uppercase tracking-widest">E-Posta</span>
                    <a
                      id="contact-email-link"
                      href="mailto:kaan60business@gmail.com"
                      className="text-sm sm:text-base font-medium text-[#d7f7ff] hover:text-[#f5ffff] transition-colors"
                    >
                      kaan60business@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-start gap-4">
                  <span className="p-3 bg-[#062a52] border border-[#6de0ff]/15 text-[#a8d8ff] rounded-xl inline-block">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-mono font-bold text-[#8fd4ff] uppercase tracking-widest">Lokasyon</span>
                    <span className="text-sm sm:text-base font-medium text-[#c7e9ff]">
                      İstanbul, Türkiye (Uzaktan Çalışmaya Uygun)
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Row */}
              <div className="pt-6 border-t border-[#64d9ff]/20">
                <span className="block text-[10px] font-mono font-bold text-[#98d8ff] uppercase tracking-widest mb-4">Sosyal Medya</span>
                <div className="flex gap-3">
                  <a
                    id="contact-social-github"
                    href="https://github.com/Kaan60ozturk"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#c7e9ff] bg-[#062a52] hover:bg-[#0b446f] border border-[#6de0ff]/20 rounded-xl transition-all"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    id="contact-social-linkedin"
                    href="https://www.linkedin.com/in/kaan-%C3%B6zt%C3%BCrk-a7901b294/"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#c7e9ff] bg-[#062a52] hover:bg-[#0b446f] border border-[#6de0ff]/20 rounded-xl transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-accent/10 rounded-xl p-6 sm:p-8 shadow-accent">
              <h3 className="text-lg font-serif font-bold text-[#e7f5ff] mb-6">
                Mesaj Gönderme Formu
              </h3>

              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-name" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a8d8ff]">
                      Adınız Soyadınız *
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn. Ahmet Yılmaz"
                      className="w-full px-4 py-2.5 bg-[#061e38] border border-[#6de0ff]/15 rounded-xl text-sm text-[#e3f8ff] placeholder:text-[#8fbef3] focus:outline-none focus:border-[#6de0ff] transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-email" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a8d8ff]">
                      E-Posta Adresiniz *
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Örn. ahmet@ornek.com"
                      className="w-full px-4 py-2.5 bg-[#061e38] border border-[#6de0ff]/15 rounded-xl text-sm text-[#e3f8ff] placeholder:text-[#8fbef3] focus:outline-none focus:border-[#6de0ff] transition-colors"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label htmlFor="form-subject" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a8d8ff]">
                    Konu Başlığı *
                  </label>
                  <input
                    id="form-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Örn. Yeni Proje Teklifi Hakkında"
                    className="w-full px-4 py-2.5 bg-[#061e38] border border-[#6de0ff]/15 rounded-xl text-sm text-[#e3f8ff] placeholder:text-[#8fbef3] focus:outline-none focus:border-[#6de0ff] transition-colors"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="form-message" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a8d8ff]">
                    Mesajınız *
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                    className="w-full px-4 py-2.5 bg-[#061e38] border border-[#6de0ff]/15 rounded-xl text-sm text-[#e3f8ff] placeholder:text-[#8fbef3] focus:outline-none focus:border-[#6de0ff] transition-colors resize-none"
                  />
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div
                      id="form-status-success"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 bg-[#062a52] border border-[#6de0ff]/15 text-[#9bedc7] text-xs font-medium rounded-xl"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Mesajınız başarıyla iletildi! Teşekkürler, en kısa sürede dönüş yapacağım.
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      id="form-status-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 bg-[#081c33] border border-red-500/15 text-red-300 text-xs font-medium rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      {errorMessage || 'Lütfen tüm alanları geçerli biçimde doldurduğunuzdan emin olun.'}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  id="form-submit-btn"
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#6de0ff] hover:bg-[#47c8ff] disabled:bg-[#194565] disabled:text-[#7db8d9] text-[#041522] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0b3b64]/30 border-t-[#6de0ff] rounded-full animate-spin" />
                      Mesaj Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Mesajı İlet
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Local Sent Messages DB (Developer Showcase Tab) */}
        {sentMessages.length > 0 && (
          <div id="sent-messages-dashboard" className="mt-16 bg-[#071a33] border border-[#6de0ff]/15 rounded-xl p-6 sm:p-8 space-y-6 shadow-accent">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#062a52] border border-[#6de0ff]/15 text-[#a8d8ff] rounded-xl inline-block">
                <MessageSquareCode className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-serif font-bold text-[#e7f5ff] leading-none">
                  Gönderilen Mesajlarınız (Simüle Edilmiş / Tarayıcı Belleği)
                </h4>
                <span className="text-xs text-[#b7dcff] font-sans mt-0.5 block">
                  İletişim formundan gönderidğiniz mesajlar, tarayıcı yerel belleğinde (localStorage) saklanarak aşağıda listelenir.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentMessages.map((msg) => (
                <div
                  id={`saved-msg-${msg.id}`}
                  key={msg.id}
                  className="p-4 bg-[#061c33] border border-[#6de0ff]/10 rounded-xl relative group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="block text-sm font-serif font-bold text-[#e7f5ff] leading-tight">
                          {msg.subject}
                        </span>
                        <span className="text-xs text-[#b7dcff] font-medium">
                          Kimden: {msg.name} ({msg.email})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a8d8ff] shrink-0 bg-[#062a52] border border-[#6de0ff]/15 px-2 py-0.5 rounded-xl">
                        {msg.date}
                      </span>
                    </div>

                    <p className="text-xs text-[#b7dcff] leading-relaxed font-sans bg-[#062a52]/80 border border-[#6de0ff]/10 p-3 rounded-xl">
                      {msg.message}
                    </p>
                  </div>

                  {/* Delete local msg button */}
                  <div className="flex justify-end pt-3">
                    <button
                      id={`delete-saved-msg-${msg.id}`}
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-[10px] font-semibold text-[#9ed4ff] hover:text-[#ffd3d3] flex items-center gap-1 opacity-90 hover:opacity-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Kaydı Temizle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
