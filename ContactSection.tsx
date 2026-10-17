import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

export const ContactSection: React.FC = () => {
  const { data, addMessage } = usePortfolio();
  const { personalDetails } = data.about;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Mohon lengkapi semua kolom.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save locally to portfolio context (accessible in Admin Dashboard)
      addMessage(formData.name, formData.email, formData.message);

      // Also call server endpoint
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {
        // Safe to ignore server offline
      });

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setErrorMessage('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Contact Me
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 font-medium">
            Send an Email directly.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-12 shadow-sm"
        >
          {success ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Pesan Berhasil Terkirim!
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
                Terima kasih telah menghubungi Rizki. Pesan Anda telah tersimpan dan akan segera direspon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-sm text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400"
                  required
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-sm text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400"
                  required
                />
              </div>

              {/* Message field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                  MESSAGE
                </label>
                <textarea
                  rows={5}
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-sm text-neutral-900 dark:text-white transition-all resize-none placeholder:text-neutral-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Contact Badges */}
          <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-3 rounded-xl">
              <Mail className="w-5 h-5 text-neutral-500 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">EMAIL</span>
              <a href={`mailto:${personalDetails.email}`} className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
                {personalDetails.email}
              </a>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl">
              <Phone className="w-5 h-5 text-neutral-500 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">PHONE / WA</span>
              <a href={`https://wa.me/${personalDetails.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
                {personalDetails.phone}
              </a>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl">
              <MapPin className="w-5 h-5 text-neutral-500 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">LOCATION</span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {personalDetails.placeOfBirth}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
