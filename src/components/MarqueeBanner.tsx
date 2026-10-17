import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const MarqueeBanner: React.FC = () => {
  const { data } = usePortfolio();
  const name = data.profile.name === 'Rizki' ? 'RyHar' : data.profile.name;

  const items = [
    `I'm ${name}`,
    'Fullstack Web Developer',
    'Creative Technologist',
    'Bot Developer',
    'Clean Architecture',
    'Available for Hire'
  ];

  const renderTickerContent = () => (
    <div className="flex items-center space-x-8 pr-8 shrink-0">
      {items.map((text, i) => (
        <span key={i} className="inline-flex items-center space-x-8">
          <span className="text-lg sm:text-2xl font-black tracking-tight text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase whitespace-nowrap">
            {text}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full py-5 sm:py-6 border-y border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40 overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {renderTickerContent()}
        {renderTickerContent()}
      </div>
    </div>
  );
};
