import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from './PortfolioContext';

export const ExperienceSection: React.FC = () => {
  const { data } = usePortfolio();
  const { experiences } = data;

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
            CAREER PATH
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Work Experience
          </h2>
        </motion.div>

        {/* Timeline Container matching video 00:11 - 00:16 */}
        <div className="relative">
          {/* Center Dividing Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1.5px] bg-neutral-200 dark:bg-neutral-800" />
          {/* Mobile Left Dividing Line */}
          <div className="md:hidden absolute left-4 top-4 bottom-4 w-[1.5px] bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-12 sm:space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp.id || index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node Dot */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-100 z-10 items-center justify-center shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                  </motion.div>

                  {/* Mobile Node Dot */}
                  <div className="md:hidden absolute left-4 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-100 z-10 top-6" />

                  {/* Content Card with Smooth Slide-in from Sides */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full md:w-[45%] pl-10 md:pl-0 ${
                      isEven ? 'md:pl-10 text-left' : 'md:pr-10 text-left'
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all"
                    >
                      {/* Year */}
                      <span className="text-xs font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                        {exp.year}
                      </span>

                      {/* Role & Company */}
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase block mt-1 mb-4">
                        {exp.company}
                      </span>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Skills Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Spacer for opposite side in desktop */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
