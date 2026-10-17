/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider } from './PortfolioContext';
import { Loader } from './Loader';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { MarqueeBanner } from './MarqueeBanner';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { TechStackSection } from './TechStackSection';
import { ProjectsSection } from './ProjectsSection';
import { ProjectModal } from './ProjectModal';
import { ContactSection } from './ContactSection';
import { AIAssistant } from './AIAssistant';
import { Footer } from './Footer';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-300">
        {/* Animated Initial Loading Screen (Matching Video 00:00 - 00:01) */}
        <Loader />

        {/* Floating Pill Header / Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <AboutSection />

        {/* Infinite Marquee Ticker (Matching Video 00:10) */}
        <MarqueeBanner />

        {/* Work Experience Timeline */}
        <ExperienceSection />

        {/* Skills & Tech Stack */}
        <TechStackSection />

        {/* Selected Works / Projects */}
        <ProjectsSection />

        {/* Project View Details Modal */}
        <ProjectModal />

        {/* Contact Me Form */}
        <ContactSection />

        {/* Interactive AI Assistant Floating Widget (Matching Video 00:27 - 00:37) */}
        <AIAssistant />

        {/* Footer */}
        <Footer />
      </div>
    </PortfolioProvider>
  );
}
