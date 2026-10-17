import React from 'react';
import { ArrowUp, Linkedin, Github, Twitter, Instagram, Mail } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const year = new Date().getFullYear();
  const { socialLinks } = data.profile;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
          <span className="text-base font-black tracking-tight text-neutral-900 dark:text-white">
            {data.profile.name === 'Rizki' ? 'RyHar' : data.profile.name}
            <span className="text-neutral-400">.</span>
          </span>

          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            © {year} {data.about.personalDetails.name}. All rights reserved.
          </span>
        </div>

        {/* Center: Social Media Links (LinkedIn, GitHub, Twitter, Instagram, Email) */}
        {socialLinks && (
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {/* GitHub */}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                aria-label="GitHub"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {/* Twitter / X */}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter / X"
                aria-label="Twitter / X"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-200 dark:hover:border-sky-900 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}

            {/* Instagram */}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}

            {/* Email */}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                title="Email"
                aria-label="Email"
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Right: Back to Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span>Back to Top</span>
          <div className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </footer>
  );
};
