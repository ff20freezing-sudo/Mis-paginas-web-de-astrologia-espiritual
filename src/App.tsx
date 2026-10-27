/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CelestialSkyMap } from './components/CelestialSkyMap';
import { BirthChartCalculator } from './components/BirthChartCalculator';
import { AspectsAndAsteroidsModule } from './components/AspectsAndAsteroidsModule';
import { SpiritualDnaLaboratory } from './components/SpiritualDnaLaboratory';
import { AncientCivilizationsAtlas } from './components/AncientCivilizationsAtlas';
import { AkashicMethodSection } from './components/AkashicMethodSection';
import { StarseedsSection } from './components/StarseedsSection';
import { HouseTwelfthKarmaSection } from './components/HouseTwelfthKarmaSection';
import { MonadSection } from './components/MonadSection';
import { Footer } from './components/Footer';
import { AkashicChartAnalysis } from './types/akashic';
import { calculateAkashicChart } from './utils/astrologyEngine';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('calculator');
  const [chartAnalysis, setChartAnalysis] = useState<AkashicChartAnalysis | null>(null);

  // Initialize with a meaningful default chart on first mount
  useEffect(() => {
    const defaultData = {
      name: 'Buscador Estelar',
      birthDate: '1995-07-21',
      birthTime: '14:30',
      birthPlace: 'Madrid, España',
      latitude: 40.4168,
      longitude: -3.7038,
      timezone: 1,
      houseSystem: 'placidus' as const,
      zodiacType: 'tropical' as const,
      timePrecision: 'exact' as const,
      investigationFocus: 'holistic' as const,
    };
    const initialChart = calculateAkashicChart(defaultData);
    setChartAnalysis(initialChart);
  }, []);

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05060b] text-slate-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* Ambient Celestial Nebula Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-indigo-900/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-amber-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px]" />
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-12">
        
        {/* Section Switching */}
        {activeSection === 'calculator' && (
          <div className="space-y-12">
            <BirthChartCalculator
              chartAnalysis={chartAnalysis}
              onChartCalculated={(analysis) => setChartAnalysis(analysis)}
            />
            {/* Embedded Sky Map inside Calculator view for visual feedback */}
            <div className="pt-6 border-t border-slate-800/80">
              <CelestialSkyMap chartAnalysis={chartAnalysis} />
            </div>
          </div>
        )}

        {activeSection === 'aspects' && chartAnalysis && (
          <AspectsAndAsteroidsModule
            chartAnalysis={chartAnalysis}
            onUpdateChart={(updated) => setChartAnalysis(updated)}
          />
        )}

        {activeSection === 'dna' && chartAnalysis && (
          <SpiritualDnaLaboratory
            chartAnalysis={chartAnalysis}
            onUpdateChart={(updated) => setChartAnalysis(updated)}
          />
        )}

        {activeSection === 'civilizations' && chartAnalysis && (
          <AncientCivilizationsAtlas
            chartAnalysis={chartAnalysis}
          />
        )}

        {activeSection === 'method' && (
          <AkashicMethodSection />
        )}

        {activeSection === 'starseeds' && (
          <StarseedsSection />
        )}

        {activeSection === 'karma' && (
          <HouseTwelfthKarmaSection />
        )}

        {activeSection === 'monad' && (
          <MonadSection />
        )}

        {activeSection === 'sky' && (
          <div className="space-y-6">
            <CelestialSkyMap chartAnalysis={chartAnalysis} />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onSelectSection={handleSelectSection} />

    </div>
  );
}
