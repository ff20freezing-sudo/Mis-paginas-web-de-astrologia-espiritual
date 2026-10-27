import React from 'react';
import { Sparkles, BookMarked, Globe2, Heart } from 'lucide-react';

interface FooterProps {
  onSelectSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  return (
    <footer className="bg-[#030408] border-t border-slate-800/80 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-serif-cosmic text-lg font-bold">✨</span>
              <span className="font-serif-cosmic text-base font-bold text-amber-100 tracking-wider">
                ATLAS AKÁSHICO
              </span>
              <span className="text-[10px] uppercase font-mono-astro text-slate-500">
                · Origen Estelar
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md font-light">
              Plataforma interactiva de astrología esotérica, estrellas fijas, linajes starseed, Casa XII y cosmología de la Mónada. Diseñada para tender un puente de discernimiento entre el cálculo astronómico sideral y el simbolismo sagrado de la conciencia.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono-astro">
              Desarrollado con rigor matemático y respeto a las tradiciones del alma.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-mono-astro uppercase text-slate-300 text-[11px] tracking-wider">
              Dimensiones del Atlas
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectSection('calculator')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Calculadora & Carta Natal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('aspects')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Aspectos & Asteroides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('dna')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  ADN & Estrellas Fijas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('civilizations')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Civilizaciones Ancestrales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('method')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  1. Método Akáshico & Sueños
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('starseeds')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  2. Estrellas Fijas & Starseed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('karma')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  3. Casa XII & Karma
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('monad')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  4. Mónada & 7 Rayos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('sky')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Bóveda Celeste Interactiva
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Bibliographic Canon */}
          <div className="space-y-2.5">
            <h4 className="font-mono-astro uppercase text-slate-300 text-[11px] tracking-wider flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span>Fuentes & Referencias</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li>• Alice A. Bailey — <span className="italic text-slate-400">Astrología Esotérica</span></li>
              <li>• Bernadette Brady — <span className="italic text-slate-400">Brady's Book of Fixed Stars</span></li>
              <li>• Vivian Robson — <span className="italic text-slate-400">The Fixed Stars in Astrology</span></li>
              <li>• Rudolf Steiner — <span className="italic text-slate-400">La Ciencia Oculta</span></li>
              <li>• Hermes Trismegisto — <span className="italic text-slate-400">Kibalión & Tabla de Esmeralda</span></li>
            </ul>
          </div>

        </div>

        {/* Legal & Epistemological Disclaimer */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-3xl leading-relaxed">
            <strong>Aviso de honestidad intelectual:</strong> Las interpretaciones generadas por este prototipo constituyen una guía simbólica, psicológica y arquetípica. No constituyen predicciones deterministas ni afirmaciones fácticas de carácter médico, legal o astrofísico observable.
          </p>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span>Atlas Akáshico</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
