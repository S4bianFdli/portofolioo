import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from './PortfolioContext';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const { about, profile } = data;

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header Tag & Heading with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
            DISCOVER
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            About Me
          </h2>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: Silhouette Avatar Card with Glow matching video 00:06 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-md h-[460px] rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-950 relative shadow-2xl group">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={about.personalDetails.name}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
              ) : null}

              {/* Glowing aesthetic aura overlay matching video 00:06 */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              {/* Glowing badge tag at card bottom */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 text-white">
                <span className="text-xs tracking-wider text-neutral-300 uppercase block font-semibold mb-0.5">
                  Frontend Web Developer
                </span>
                <span className="text-lg font-bold">{about.personalDetails.name}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Who Am I, My Approach & Personal Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col justify-between gap-6"
          >
            {/* Top Row: Who Am I & My Approach */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Who Am I */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                    Who Am I
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {about.whoAmI}
                  </p>
                </div>
              </div>

              {/* My Approach */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                    My Approach
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {about.myApproach}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Details Card matching video 00:08 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-6 tracking-wide border-b border-neutral-200 dark:border-neutral-800 pb-3">
                Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    NAME
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {about.personalDetails.name}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    PLACE OF BIRTH
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {about.personalDetails.placeOfBirth}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    PHONE
                  </span>
                  <a
                    href={`tel:${about.personalDetails.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:underline"
                  >
                    {about.personalDetails.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    GPA
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {about.personalDetails.gpa}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    EMAIL
                  </span>
                  <a
                    href={`mailto:${about.personalDetails.email}`}
                    className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:underline break-all"
                  >
                    {about.personalDetails.email}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">
                    EDUCATION
                  </span>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {about.personalDetails.education}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
