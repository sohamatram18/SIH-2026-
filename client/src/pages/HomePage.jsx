import React, { useState } from 'react';
import { HeroBannerCarousel } from '../components/home/HeroBannerCarousel.jsx';
import { SchemeFinderWidget } from '../components/home/SchemeFinderWidget.jsx';
import { HowItWorksSection } from '../components/home/HowItWorksSection.jsx';
import { DiscoveryCategories } from '../components/home/DiscoveryCategories.jsx';
import { DataToolsSection } from '../components/home/DataToolsSection.jsx';
import { TrustStatsBar } from '../components/home/TrustStatsBar.jsx';
import { NewsUpdatesFeed } from '../components/home/NewsUpdatesFeed.jsx';
import { ExpertHelpCommunity } from '../components/home/ExpertHelpCommunity.jsx';
import { FaqAccordionSection } from '../components/home/FaqAccordionSection.jsx';
import { FooterSection } from '../components/home/FooterSection.jsx';
import { SchemeCompareModal } from '../components/home/SchemeCompareModal.jsx';

export const HomePage = ({ onOpenJago }) => {
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Redesigned 10-Section Landing Architecture */}
      <div>
        {/* Section 1: Hero Banner Slider Carousel */}
        <HeroBannerCarousel 
          onOpenJago={onOpenJago} 
          onOpenCompare={() => setCompareModalOpen(true)} 
        />

        {/* Section 2: Prominent Search & Scheme Finder Filter Widget */}
        <SchemeFinderWidget />

        {/* Section 3: How It Works 3-Step Visual Process */}
        <HowItWorksSection onOpenJago={onOpenJago} />

        {/* Section 4: Discovery Categories Grid & Trending Predictor Links */}
        <DiscoveryCategories onOpenCompare={() => setCompareModalOpen(true)} />

        {/* Section 5: Data & Tools (Financial Allowance Calculator & Comparator) */}
        <DataToolsSection onOpenCompare={() => setCompareModalOpen(true)} />

        {/* Section 6: Trust / Stats Bar */}
        <TrustStatsBar />

        {/* Section 7: Latest News & Updates Feed with Live Ticker */}
        <NewsUpdatesFeed />

        {/* Section 8: Expert Help & Student Community Q&A */}
        <ExpertHelpCommunity onOpenJago={onOpenJago} />

        {/* Section 9: FAQ Accordion Section */}
        <FaqAccordionSection onOpenJago={onOpenJago} />
      </div>

      {/* Section 10: Institutional Multi-Column Footer */}
      <FooterSection />

      {/* Side-by-Side Scheme Comparator Modal */}
      <SchemeCompareModal 
        isOpen={compareModalOpen} 
        onClose={() => setCompareModalOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
