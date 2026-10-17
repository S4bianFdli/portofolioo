/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeBanner } from './components/MarqueeBanner';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { TechStackSection } from './components/TechStackSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { ContactSection } from './components/ContactSection';
import { AIAssistant } from './components/AIAssistant';
import { Footer } from './components/Footer';

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
