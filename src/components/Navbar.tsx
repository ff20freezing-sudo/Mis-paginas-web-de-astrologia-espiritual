import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Moon, Sun, BookOpen, Stars, Grid, Dna, Globe2 } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesis';

interface NavbarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSelectSection }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<number>(432);

  const frequencies = [
    { freq: 432, label: '432 Hz', desc: 'Afinación Cósmica & Calma' },
    { freq: 528, label: '528 Hz', desc: 'Frecuencia de Sanación & ADN' },
    { freq: 639, label: '639 Hz', desc: 'Conexión de Corazón & Unidad' },
    { freq: 963, label: '963 Hz', desc: 'Retorno a la Fuente Akáshica' },
  ];

  const toggleSound = (freqToPlay?: number) => {
    const f = freqToPlay || selectedFreq;
    if (isPlayingAudio && (!freqToPlay || freqToPlay === selectedFreq)) {
      soundEngine.stop();
      setIsPlayingAudio(false);
    } else {
      setSelectedFreq(f);
      soundEngine.playFrequency(f);
      setIsPlayingAudio(true);
    }
  };

  const navItems = [
    { id: 'calculator', label: 'Rueda Natal & Formulario', icon: Compass },
    { id: 'aspects', label: 'Aspectos & Asteroides', icon: Grid },
    { id: 'dna', label: 'ADN & Estrellas', icon: Dna },
    { id: 'civilizations', label: 'Civilizaciones Ancestrales', icon: Globe2 },
    { id: 'method', label: '1. Método Akáshico', icon: BookOpen },
    { id: 'starseeds', label: '2. Estrellas Fijas & Starseed', icon: Stars },
    { id: 'karma', label: '3. Casa XII & Karma', icon: Moon },
    { id: 'monad', label: '4. Mónada & Origen', icon: Sun },
    { id: 'sky', label: 'Bóveda Celeste', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#05060b]/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onSelectSection('calculator')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-full border border-amber-500/40 bg-gradient-to-tr from-indigo-950 via-slate-900 to-amber-950/40 flex items-center justify-center cosmic-glow-gold transition-transform group-hover:scale-105">
              <span className="text-amber-300 font-serif-cosmic text-xl font-bold">✨</span>
              <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-spin-very-slow pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-cosmic text-lg sm:text-xl font-bold text-amber-100 tracking-wider group-hover:text-amber-300 transition-colors">
                  ATLAS AKÁSHICO
                </span>
                <span className="text-[10px] uppercase font-mono-astro tracking-widest text-amber-400/80 hidden sm:inline-block">
                  · Origen Estelar
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light hidden md:block">
                Astrología Esotérica · Estrellas Fijas · Casa XII & Mónada
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Solfeggio Audio Player Widget */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 px-2.5">
            <button
              onClick={() => toggleSound()}
              title={isPlayingAudio ? 'Silenciar Frecuencia' : 'Activar Frecuencia Solfeggio'}
              className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-amber-300'
              }`}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-1">
              <select
                value={selectedFreq}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSelectedFreq(val);
                  if (isPlayingAudio) soundEngine.playFrequency(val);
                }}
                className="bg-transparent text-xs text-amber-200 font-mono-astro focus:outline-none cursor-pointer pr-1"
              >
                {frequencies.map((f) => (
                  <option key={f.freq} value={f.freq} className="bg-slate-900 text-slate-200">
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {isPlayingAudio && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
            )}
          </div>

        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
