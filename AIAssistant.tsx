import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, X } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIAssistant: React.FC = () => {
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Halo! Saya adalah asisten AI YansXiters. Ada yang bisa saya bantu terkait portfolio, pengalaman, atau project RyHar?',
      time: '13:41',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatCurrentTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: formatCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const portfolioContext = `
Nama: ${data.about.personalDetails.name} (${data.profile.name})
Role: Frontend Web Developer & Bot Specialist
Bio: ${data.profile.bio}
Who Am I: ${data.about.whoAmI}
My Approach: ${data.about.myApproach}
Pendidikan: ${data.about.personalDetails.education} (IPK / GPA: ${data.about.personalDetails.gpa})
Asal / Lokasi: ${data.about.personalDetails.placeOfBirth}
Kontak: Email ${data.about.personalDetails.email}, Telp/WA ${data.about.personalDetails.phone}
Pengalaman:
${data.experiences.map((e) => `- ${e.year}: ${e.role} di ${e.company}. ${e.description} (Skills: ${e.skills.join(', ')})`).join('\n')}
Projects:
${data.projects.map((p) => `- ${p.title} (${p.category}): ${p.shortDescription} [Tags: ${p.tags.join(', ')}]`).join('\n')}
      `.trim();

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          portfolioContext,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const reply = json.reply || json.fallback;
        // Small organic delay before displaying reply
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai-' + Date.now(),
              sender: 'ai',
              text: reply,
              time: formatCurrentTime(),
            },
          ]);
          setIsTyping(false);
        }, 600);
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      setTimeout(() => {
        let fallbackText = '';
        const q = textToSend.toLowerCase();

        if (q.includes('kamu siapa') || q.includes('siapa kamu') || q.includes('siapa')) {
          fallbackText = `Saya Yans Assistant, asisten AI pribadi untuk ${data.about.personalDetails.name}, seorang Frontend Web Developer. Saya siap membantu Anda dengan informasi tentang portofolio, layanan, atau proyek yang ia kerjakan.`;
        } else if (q.includes('project') || q.includes('proyek') || q.includes('karya')) {
          fallbackText = `Sabian telah membuat sejumlah proyek inovatif seperti ${data.projects.map((p) => p.title).join(', ')}. Anda dapat meninjau detail dan demo langsungnya di bagian Selected Works!`;
        } else if (q.includes('tech') || q.includes('stack') || q.includes('skill')) {
          fallbackText = `Sabian berfokus pada ekosistem modern: React, Next.js, TypeScript, Tailwind CSS di Frontend.`;
        } else if (q.includes('kontak') || q.includes('hubungi') || q.includes('email') || q.includes('wa')) {
          fallbackText = `Anda bisa menghubungi Sabian langsung lewat email ${data.about.personalDetails.email} atau WhatsApp ${data.about.personalDetails.phone}.`;
        } else {
          fallbackText = `Halo! ${data.profile.name} adalah Frontend Web Developer yang berpengalaman dalam membangun platform SaaS, REST API, dan bot otomatisasi. Silakan ajukan pertanyaan lain seputar proyek atau skill!`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: fallbackText,
            time: formatCurrentTime(),
          },
        ]);
        setIsTyping(false);
      }, 700);
    }
  };

  const promptSuggestions = [
    'kamu siapa?',
    'project apa saja?',
    'apa tech stacknya?',
    'kontak Rizki',
  ];

  return (
    <>
      {/* Floating Trigger Button matching video 00:27 */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Assistant"
          className="relative w-14 h-14 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xl flex items-center justify-center border border-neutral-700/20 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="font-extrabold text-xs tracking-wider">AI</span>
              {/* Online indicator */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Window Dialog matching video 00:27 - 00:37 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-assistant-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[380px] max-h-[560px] h-[520px] rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-900/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                    Yans Assistant
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick suggestions pills */}
            <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-100 rounded-tl-sm'
                          : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/90 w-fit"
                >
                  <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60"
              >
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent py-2 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
