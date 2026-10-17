import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';

export const Loader: React.FC = () => {
  const { data, isLoadingScreen, setIsLoadingScreen } = usePortfolio();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoadingScreen) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoadingScreen(false), 300);
          return 100;
        }
        // Smooth exponential-style increments
        const increment = prev < 50 ? 12 : prev < 85 ? 8 : 4;
        return Math.min(prev + increment, 100);
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isLoadingScreen, setIsLoadingScreen]);

  return (
    <AnimatePresence mode="wait">
      {isLoadingScreen && (
        <motion.div
          key="loader-overlay"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%', 
            transition: { 
              duration: 0.85, 
              ease: [0.76, 0, 0.24, 1] 
            } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white select-none overflow-hidden"
        >
          {/* Subtle background ambient radial glow matching video 00:00 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)] pointer-events-none" />

          {/* Grid lines decoration for cyber-aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center max-w-xs w-full px-6 text-center relative z-10"
          >
            {/* Brand Logo "RyHar" matching video 00:00 - 00:01 */}
            <motion.h1
              initial={{ letterSpacing: '0.08em', opacity: 0 }}
              animate={{ letterSpacing: '0.02em', opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2 relative"
            >
              {data.profile.name === 'Rizki' ? 'RyHar' : data.profile.name}
              <span className="text-neutral-500">.</span>
            </motion.h1>

            {/* Subtitle PORTFOLIO LOADING */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-mono font-bold tracking-[0.35em] text-neutral-400 uppercase">
                PORTFOLIO LOADING
              </p>
            </motion.div>

            {/* Sleek Progress Bar with Glowing Head */}
            <div className="w-56 sm:w-64 h-[3px] bg-neutral-900 rounded-full overflow-hidden relative border border-neutral-800">
              <motion.div
                className="h-full bg-gradient-to-r from-neutral-400 via-white to-white rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
              </motion.div>
            </div>

            {/* Progress Percentage */}
            <div className="mt-3 flex justify-between items-center w-56 sm:w-64 text-[10px] font-mono text-neutral-500">
              <span>INITIALIZING</span>
              <span className="text-neutral-300 font-bold">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
