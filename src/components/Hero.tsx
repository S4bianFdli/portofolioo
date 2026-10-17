import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Clock, Code, Terminal, Sparkles, Instagram, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThreeHeroScene } from './ThreeHeroScene';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { profile } = data;

  // Typewriter effect matching video 00:02 - 00:04
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const titles = profile.titles.length > 0 ? profile.titles : ['Frontend Developer', 'Fullstack Developer', 'Bot Developer'];
    const currentFullTitle = titles[currentTitleIndex % titles.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFullTitle) {
      // Pause when full word is typed
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      timer = setTimeout(() => {}, 400);
    } else {
      const speed = isDeleting ? 45 : 85;
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentFullTitle.substring(0, displayText.length - 1)
            : currentFullTitle.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentTitleIndex, profile.titles]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      case 'code':
        return <Code className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      default:
        return <Sparkles className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
    }
  };

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen pt-28 sm:pt-36 pb-16 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Interactive 3D Three.js Tech Canvas */}
      <ThreeHeroScene />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Intro & Bio */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          <div className="inline-block mb-3">
            <span className="text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
              {profile.greeting}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-2">
            {profile.greeting.includes("Hi") ? '' : profile.greeting}{' '}
            <span className="text-neutral-900 dark:text-white">
              {profile.greeting ? '' : "Hi, I'm "}
              {profile.name}
            </span>
          </h1>

          {/* Typing Subtitle with animated blinking cursor */}
          <div className="h-9 sm:h-11 flex items-center mb-5">
            <span className="text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {displayText}
            </span>
            <span className="inline-block w-[2.5px] h-6 sm:h-7 ml-1 bg-neutral-900 dark:bg-white animate-pulse" />
          </div>

          {/* Bio text */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl mb-8 font-normal">
            {profile.bio}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              onClick={handleScrollToProjects}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-sm transition-all shadow-md hover:shadow-lg"
            >
              Explore Work
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={profile.cvUrl || '#'}
              download="CV_Ahmad_Rizki_Hartawan.pdf"
              onClick={(e) => {
                if (profile.cvUrl === '#' || !profile.cvUrl) {
                  e.preventDefault();
                  alert(`Fitur Download CV dapat dikonfigurasi melalui Admin Dashboard.`);
                }
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              Download CV
              <Download className="w-4 h-4 text-neutral-500" />
            </motion.a>
          </div>

          {/* CONNECT with Social Links */}
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              CONNECT
            </span>
            <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
              {profile.socialLinks.instagram && (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              )}
              {profile.socialLinks.github && (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {profile.socialLinks.linkedin && (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
              {profile.socialLinks.twitter && (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                  aria-label="Twitter"
                  title="Twitter / X"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              )}
              {profile.socialLinks.email && (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  href={`mailto:${profile.socialLinks.email}`}
                  className="p-2 rounded-lg hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Silhouette Avatar & Floating Badge Pills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex justify-center items-center relative"
        >
          <div className="relative w-72 sm:w-96 aspect-square max-w-full">
            {/* Glowing background aura with gentle breathing animation */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.6, 0.85, 0.6]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-neutral-300 via-neutral-100 to-transparent dark:from-white/10 dark:via-neutral-700/20 dark:to-transparent blur-3xl -z-10"
            />

            {/* Avatar container matching video 00:02 - 00:05 */}
            <div className="w-full h-full rounded-full border-4 border-white/80 dark:border-neutral-800 overflow-hidden bg-neutral-950 flex items-center justify-center shadow-2xl relative group">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 opacity-90 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}

              {/* Luminous silhouette contour gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-center pb-6">
                <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                  {profile.name}
                </span>
              </div>
            </div>

            {/* Floating Badges with Staggered Floating / Bobbing Animations (Matching video 00:03 - 00:05) */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:-bottom-4 sm:-right-6 flex flex-col gap-2.5 w-64 sm:w-72 z-20">
              {profile.badges.map((badge, idx) => {
                // Different floating durations and delays so badges float organically
                const floatingDelays = [0, 0.4, 0.8];
                const floatingDurations = [3.8, 4.4, 4.0];

                return (
                  <motion.div
                    key={badge.id}
                    animate={{
                      y: [0, -6, 0]
                    }}
                    transition={{
                      duration: floatingDurations[idx % 3],
                      delay: floatingDelays[idx % 3],
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    whileHover={{ scale: 1.04, y: -8 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 shadow-lg shadow-black/5 cursor-default transition-shadow hover:shadow-xl"
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {badge.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
