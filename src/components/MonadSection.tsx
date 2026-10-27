import React, { useState } from 'react';
import { MONAD_RAYS } from '../data/akashicKnowledge';
import { MonadRay } from '../types/akashic';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Sun, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Flame,
  Globe2,
  Workflow
} from 'lucide-react';

export const MonadSection: React.FC = () => {
  const [selectedRay, setSelectedRay] = useState<MonadRay>(MONAD_RAYS[1]); // Default Ray 2 (Love-Wisdom)
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'rays' | 'purpose'>('hierarchy');

  return (
    <div id="monad-section" className="space-y-8">
      
      {/* Area Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-2">
          <Sun className="w-3.5 h-3.5" />
          <span>ÁREA IV · LA UNIDAD PRIMORDIAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
          Mónada & Origen Akáshico
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-light">
          La palabra <span className="text-amber-200 italic">Mónada</span> (del griego <span className="italic">monas</span>, unidad) designa la chispa divina increada que emana directamente de la Fuente Universal. Es tu identidad eterna e inmortal, más allá del tiempo, del karma y de cualquier encarnación física.
        </p>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'hierarchy', label: '1. La Jerarquía de la Conciencia', icon: Layers },
            { id: 'rays', label: '2. Los 7 Rayos Cósmicos de la Creación', icon: Sun },
            { id: 'purpose', label: '3. El Propósito Monádico Terrestre', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: HIERARCHY OF CONSCIOUSNESS */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold font-serif-cosmic text-slate-100 mb-1">
              La Descentralización de la Luz: De la Fuente a la Materia
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl mb-6">
              Según las tradiciones esotéricas orientales y occidentales, el espíritu experimenta la multiplicidad descendiendo a través de cuatro niveles concéntricos de densidad:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Level 1: The Source */}
              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/40 space-y-2 relative overflow-hidden">
                <div className="text-amber-400 text-xs font-mono-astro">Nivel I · El Origen</div>
                <h4 className="text-base font-bold font-serif-cosmic text-amber-200">
                  La Fuente Universal
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  El Absoluto inmanifestado. La totalidad de la conciencia pura antes de cualquier diferenciación de forma o polaridad.
                </p>
                <div className="text-[10px] text-slate-500 font-mono-astro pt-1">
                  Ain Soph · Dios Cósmico · Tao
                </div>
              </div>

              {/* Level 2: The Monad */}
              <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/40 space-y-2 relative overflow-hidden">
                <div className="text-indigo-400 text-xs font-mono-astro">Nivel II · La Chispa</div>
                <h4 className="text-base font-bold font-serif-cosmic text-indigo-200">
                  La Mónada (Yo Soy)
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  El fragmento divino indivisible. Nunca desciende a la materia; permanece en contemplación eterna emitiendo su Rayo de luz.
                </p>
                <div className="text-[10px] text-slate-500 font-mono-astro pt-1">
                  Espíritu Puro · El Átomo Divino
                </div>
              </div>

              {/* Level 3: The Soul */}
              <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/40 space-y-2 relative overflow-hidden">
                <div className="text-purple-400 text-xs font-mono-astro">Nivel III · El Intermediario</div>
                <h4 className="text-base font-bold font-serif-cosmic text-purple-200">
                  El Alma (Cuerpo Causal)
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  La embajadora de la Mónada en los mundos dimensionales. Almacena la cosecha de experiencias de todas las vidas encarnadas.
                </p>
                <div className="text-[10px] text-slate-500 font-mono-astro pt-1">
                  Jiva · El Yo Superior Consciente
                </div>
              </div>

              {/* Level 4: The Personality */}
              <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/40 space-y-2 relative overflow-hidden">
                <div className="text-emerald-400 text-xs font-mono-astro">Nivel IV · El Vehículo</div>
                <h4 className="text-base font-bold font-serif-cosmic text-emerald-200">
                  La Personalidad Terrestre
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  La tríada temporal: cuerpo físico, cuerpo emocional y cuerpo mental. El traje biológico que permite interactuar con la Tierra.
                </p>
                <div className="text-[10px] text-slate-500 font-mono-astro pt-1">
                  Encarnación presente · El Yo Terrenal
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 leading-relaxed space-y-2">
            <span className="font-mono-astro text-amber-300 block font-medium">
              El Despertar del Puente Antahkarana:
            </span>
            <p>
              La evolución espiritual consiste en construir conscientemente el hilo de luz (<span className="italic">Antahkarana</span>) que conecta la Personalidad terrenal con el Alma, y el Alma con la Mónada. Cuando este puente se activa, el individuo deja de actuar desde el miedo o la separación y se convierte en un instrumento lúcido de la voluntad cósmica.
            </p>
          </div>

        </div>
      )}

      {/* SUBTAB 2: THE 7 COSMIC RAYS */}
      {activeTab === 'rays' && (
        <div className="space-y-6">
          
          {/* Ray selector buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {MONAD_RAYS.map((r) => {
              const isSelected = selectedRay.rayNumber === r.rayNumber;
              return (
                <button
                  key={r.rayNumber}
                  onClick={() => {
                    setSelectedRay(r);
                    soundEngine.playSingingBowlChime(432 + r.rayNumber * 20);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block mr-1.5"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="text-xs font-bold text-slate-200 font-serif-cosmic block mt-1">
                    Rayo {r.rayNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-astro truncate block">
                    {r.name.split(':')[1]?.trim() || r.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Ray Profile Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedRay.color }}
                  />
                  <span className="text-xs font-mono-astro text-amber-400">
                    ASTROLOGÍA ESOTÉRICA DE ALICE BAILEY
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif-cosmic text-slate-100 mt-1">
                  {selectedRay.name}
                </h3>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  {selectedRay.aspect}
                </p>
              </div>

              <div className="text-xs font-mono-astro bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-slate-300">
                Regente Esotérico: {selectedRay.planetaryRulerEsoteric}
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <span className="font-mono-astro text-amber-300 text-xs block mb-1">
                Cualidad Primaria de Manifestación:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                {selectedRay.primaryQuality}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Special Virtues */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                <span className="font-mono-astro text-emerald-400 uppercase text-[11px] block">
                  Virtudes Nobles a Cultivar:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {selectedRay.specialVirtues.map((v, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vices to Transmute */}
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
                <span className="font-mono-astro text-rose-400 uppercase text-[11px] block">
                  Vicios de la Personalidad a Transmutar:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {selectedRay.vicesToTransmute.map((v, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono-astro block mb-0.5">
                  Manifestación Terrestre:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedRay.earthlyManifestation}
                </p>
              </div>

              <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/30">
                <span className="text-amber-300 font-mono-astro block mb-0.5">
                  Propósito Monádico Supremo:
                </span>
                <p className="text-slate-200 text-[11px] italic leading-relaxed">
                  "{selectedRay.monadicPurpose}"
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 3: MONADIC PURPOSE ON EARTH */}
      {activeTab === 'purpose' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
              Anclar el Cielo en la Tierra: El Antídoto contra la Evasión Espiritual
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Muchas almas con afinidad estelar caen en la trampa del <span className="italic">spiritual bypassing</span> o la nostalgia crónica por otros mundos. La sabiduría akáshica enseña que la Tierra no es una prisión, sino un templo supremo de maestría consciente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono-astro text-amber-300 uppercase text-[11px] block">
                1. La Sacralidad del Cuerpo
              </span>
              <p className="text-slate-300 leading-relaxed">
                Tu cuerpo físico no es un obstáculo para la iluminación: es el cáliz necesario para traducir las altas frecuencias de la Mónada a vibraciones biológicas asimilables por el planeta.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono-astro text-sky-300 uppercase text-[11px] block">
                2. El Servicio Desinteresado
              </span>
              <p className="text-slate-300 leading-relaxed">
                El propósito del alma nunca es un título glorioso ni la fama espiritual: se expresa en la amabilidad cotidiana, en la compasión ante el sufrimiento ajeno y en la presencia pacífica en momentos de caos.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono-astro text-emerald-300 uppercase text-[11px] block">
                3. La Integración de la Sombra
              </span>
              <p className="text-slate-300 leading-relaxed">
                No hay luz monádica real que huya de la densidad. Iluminar no significa ignorar la oscuridad, sino abrazarla con suficiente amor y comprensión hasta que regrese voluntariamente a la armonía original.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
