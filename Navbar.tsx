import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Sun, Moon, Menu, X, Play } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, setIsLoadingScreen } = usePortfolio();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll progress bar across page
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contacts', href: '#contacts' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['home', 'about', 'experience', 'tech-stack', 'projects', 'contacts'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-neutral-900 dark:bg-white z-50 origin-left"
        style={{ scaleX }}
      />

      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-4xl flex items-center justify-between px-5 sm:px-7 py-3 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-lg shadow-neutral-500/5 dark:shadow-black/20 border border-neutral-200/80 dark:border-neutral-800'
              : 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200/60 dark:border-neutral-800/80'
          }`}
        >
          {/* Brand & Replay Intro */}
          <div className="flex items-center gap-2">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5"
            >
              PORTFOLIO<span className="text-neutral-400 dark:text-neutral-500">.</span>
            </a>

            <button
              onClick={() => {
                setIsLoadingScreen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Putar Ulang Animasi Intro"
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-[10px] hidden sm:flex items-center gap-1 px-2 cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Intro</span>
            </button>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-semibold ${
                    isActive
                      ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-50 p-5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border border-neutral-200 dark:border-neutral-800 shadow-xl pointer-events-auto flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center px-4">
            <span className="text-xs text-neutral-400">Mode Tema</span>
            <button
              onClick={toggleTheme}
              className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
