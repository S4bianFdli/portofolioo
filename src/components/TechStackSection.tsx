import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThreeTechSphere } from './ThreeTechSphere';

export const TechStackSection: React.FC = () => {
  const { data } = usePortfolio();
  const { techStack } = data;

  // Simple clean SVG icons or fallbacks for technologies
  const renderTechIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('react')) {
      return (
        <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-200" viewBox="0 0 115.3 100" fill="currentColor">
          <path d="M57.6,0C25.8,0,0,22.4,0,50s25.8,50,57.6,50s57.6-22.4,57.6-50S89.5,0,57.6,0z M57.6,90.5C31,90.5,9.5,72.3,9.5,50S31,9.5,57.6,9.5S105.8,27.7,105.8,50S84.3,90.5,57.6,90.5z" opacity="0.2"/>
          <ellipse cx="57.6" cy="50" rx="15" ry="15" />
          <path d="M57.6 15 C30 15 20 40 20 50 C20 60 30 85 57.6 85 C85 85 95 60 95 50 C95 40 85 15 57.6 15" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      );
    }
    if (n.includes('next')) {
      return (
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-black text-sm tracking-tighter">
          N
        </div>
      );
    }
    if (n.includes('tailwind')) {
      return (
        <svg className="w-8 h-8 text-neutral-800 dark:text-neutral-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
      );
    }
    if (n.includes('typescript')) {
      return (
        <div className="w-8 h-8 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs">
          TS
        </div>
      );
    }
    if (n.includes('node')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-extrabold text-xs text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
          JS
        </div>
      );
    }
    if (n.includes('express')) {
      return (
        <div className="w-8 h-8 rounded-full border-2 border-neutral-800 dark:border-neutral-200 flex items-center justify-center font-mono font-bold text-xs text-neutral-800 dark:text-neutral-200">
          ex
        </div>
      );
    }
    if (n.includes('sql')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-mono font-black text-xs">
          SQL
        </div>
      );
    }
    if (n.includes('mongo')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-semibold text-xs text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
          MDB
        </div>
      );
    }
    // Generic fallback icon
    return (
      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-300">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <section id="tech-stack" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
            SKILLS &amp; TOOLS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            My Tech Stack
          </h2>
        </motion.div>

        {/* Interactive 3D Tech Orbit Sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <ThreeTechSphere />
        </motion.div>

        {/* Categories Stack */}
        <div className="space-y-12">
          {techStack.map((category, catIdx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: catIdx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10 rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
            >
              <div className="max-w-xl mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {category.category}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {category.description}
                </p>
              </div>

              {/* Grid of tech cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {category.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 * idx }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.03,
                      transition: { duration: 0.2 } 
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
                  >
                    <div className="mb-3 transition-transform duration-300 group-hover:scale-115">
                      {renderTechIcon(item.name)}
                    </div>
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
