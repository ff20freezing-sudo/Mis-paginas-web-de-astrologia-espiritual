import React, { useState } from 'react';
import { HOUSE_TWELFTH_PROFILES, ZODIAC_SIGNS } from '../data/akashicKnowledge';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Moon, 
  Sparkles, 
  Check, 
  Flame, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  HeartHandshake, 
  EyeOff,
  Feather
} from 'lucide-react';

export const HouseTwelfthKarmaSection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string>('Piscis');
  const [clearingStep, setClearingStep] = useState<number>(1);
  const [isClearingActive, setIsClearingActive] = useState(false);
  const [clearingVowType, setClearingVowType] = useState<string>('todos');

  const currentProfile = HOUSE_TWELFTH_PROFILES[selectedSign] || HOUSE_TWELFTH_PROFILES['Piscis'];

  const startClearingRitual = () => {
    setIsClearingActive(true);
    setClearingStep(1);
    soundEngine.playSingingBowlChime(432);
  };

  const nextClearingStep = () => {
    if (clearingStep < 3) {
      setClearingStep(clearingStep + 1);
      soundEngine.playSingingBowlChime(528);
    } else {
      setIsClearingActive(false);
      setClearingStep(1);
      soundEngine.playSingingBowlChime(963);
    }
  };

  return (
    <div id="karma-section" className="space-y-8">
      
      {/* Area Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-astro text-purple-400 mb-2">
          <Moon className="w-3.5 h-3.5" />
          <span>ÁREA III · EL OCÉANO DE LA MEMORIA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
          Casa XII & Karma del Alma
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-light">
          La Casa XII es el sector más enigmático de la carta astral: la antesala del nacimiento terrenal. Aquí residen los pactos no resueltos, las memorias que quedaron grabadas en el inconsciente y los dones espirituales que debieron ocultarse para sobrevivir en vidas pasadas.
        </p>
      </div>

      {/* Interactive Zodiac Selector for House XII */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-astro text-slate-400 uppercase tracking-wider">
            Selecciona el Signo en la Cúspide de Casa XII:
          </span>
          <span className="text-xs text-amber-400 font-mono-astro">
            Signo Activo: {selectedSign}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {ZODIAC_SIGNS.map((z) => {
            const isSelected = selectedSign === z.name;
            return (
              <button
                key={z.name}
                onClick={() => {
                  setSelectedSign(z.name);
                  soundEngine.playSingingBowlChime(432);
                }}
                className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400/80 text-amber-200 shadow-lg shadow-purple-950/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-base block mb-0.5">{z.symbol}</span>
                <span className="text-[11px] font-mono-astro block font-medium truncate">
                  {z.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* House XII Detailed Interpretation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono-astro text-purple-400">
              REGENTE ESOTÉRICO: {currentProfile.ruler}
            </span>
            <h3 className="text-xl font-bold font-serif-cosmic text-slate-100 mt-0.5">
              Casa XII en {currentProfile.sign}
            </h3>
          </div>
          <div className="text-xs font-mono-astro text-slate-400">
            Arquetipo Kármico
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          
          {/* Unconscious Shadow & Past Life */}
          <div className="bg-slate-950 p-5 rounded-xl border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-medium">
              <EyeOff className="w-4 h-4" />
              <span className="font-mono-astro uppercase text-[11px]">
                La Sombra Inconsciente & Patrón de Vidas Pasadas
              </span>
            </div>
            
            <p className="text-slate-300 leading-relaxed">
              {currentProfile.unconsciousShadow}
            </p>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
              <span className="text-rose-300 font-medium block mb-0.5">
                Memoria kármica recurrente:
              </span>
              {currentProfile.karmicMemory}
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Patrón histórico: {currentProfile.pastLifePattern}
            </div>
          </div>

          {/* Redeemed Gift & Integration */}
          <div className="bg-indigo-950/20 p-5 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-mono-astro uppercase text-[11px]">
                El Don Redimido & Maestría Espiritual
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed font-medium">
              {currentProfile.redeemedGift}
            </p>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-indigo-500/20 text-[11px] text-slate-300">
              <span className="text-amber-300 font-medium block mb-0.5">
                Clave de Integración Consciente:
              </span>
              {currentProfile.spiritualIntegration}
            </div>
          </div>

        </div>

      </div>

      {/* Karmic Clearing Ritual Component */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>PROTOCOLO DE DISOLUCIÓN DE CONTRATOS KÁRMICOS</span>
            </div>
            <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
              Ritual de Liberación & Corte de Votos Antiguos
            </h3>
          </div>

          {!isClearingActive && (
            <button
              onClick={startClearingRitual}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer font-serif-cosmic"
            >
              Iniciar Decreto de Liberación
            </button>
          )}
        </div>

        {!isClearingActive ? (
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-light">
            En muchas encarnaciones anteriores, formulamos votos de pobreza, castidad obligada, obediencia ciega o sufrimiento vicario para pertenecer a órdenes sagradas o sobrevivir persecuciones. Hoy, desde la soberanía de tu Yo Superior, puedes rescindir conscientemente cualquier voto que limite tu plenitud terrenal.
          </p>
        ) : (
          <div className="bg-slate-950 p-6 rounded-xl border border-amber-500/40 space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between text-xs font-mono-astro text-slate-400">
              <span>Paso {clearingStep} de 3</span>
              <span className="text-amber-300">
                {clearingStep === 1 && 'Reconocimiento Consciente'}
                {clearingStep === 2 && 'Decreto de Rescisión Solemne'}
                {clearingStep === 3 && 'Sellado en la Luz Akáshica'}
              </span>
            </div>

            {clearingStep === 1 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Cierra los ojos un instante. Respira profundo hacia el centro de tu pecho. Reconoce que cualquier sufrimiento repetitivo o culpa sin causa aparente fue una lección que tu alma aceptó en el pasado, pero que ahora está <strong>completa</strong>.
                </p>
                <div className="p-3 bg-slate-900 rounded-lg text-slate-400 italic">
                  "Honro a todos los seres con quienes compartí contratos kármicos. Agradezco las lecciones aprendidas a través del contraste y el dolor."
                </div>
              </div>
            )}

            {clearingStep === 2 && (
              <div className="space-y-3 text-xs">
                <span className="font-mono-astro text-amber-300 uppercase block">
                  Pronuncia en voz alta o en tu mente con firmeza serena:
                </span>
                <blockquote className="border-l-2 border-amber-400 pl-4 py-2 text-slate-100 italic leading-relaxed space-y-2 bg-slate-900/60 rounded-r-lg">
                  <p>
                    "En el nombre de mi Presencia Yo Soy y por la autoridad de mi chispa divina:
                  </p>
                  <p>
                    Revoco, anulo y disuelvo aquí y ahora todo voto de pobreza, castidad, autosacrificio, sumisión o lealtad ciega formulado en cualquier tiempo, espacio o dimensión.
                  </p>
                  <p>
                    Reclamo mi derecho sagrado a la abundancia, al amor correspondido, a la alegría y a la libertad de mi espíritu en esta encarnación terrenal."
                  </p>
                </blockquote>
              </div>
            )}

            {clearingStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>El Velo ha sido disuelto</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Visualiza una llama violeta envolviendo tu campo áurico, transmutando las ataduras del pasado en polvo dorado de estrellas. Siente el alivio en tus hombros y la liviandad en tu respiración.
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono-astro">
                  Hecho está. En paz y soberanía.
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={nextClearingStep}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer font-serif-cosmic"
              >
                {clearingStep < 3 ? 'Continuar Decreto' : 'Finalizar & Sellar'}
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
