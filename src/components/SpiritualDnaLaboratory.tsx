import React, { useState } from 'react';
import { AkashicChartAnalysis, SpiritualDnaStrand, PlanetPosition, FixedStar } from '../types/akashic';
import { FIXED_STARS } from '../data/akashicKnowledge';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Dna, 
  Sparkles, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Info, 
  Flame, 
  Compass, 
  Heart, 
  Bookmark, 
  Save 
} from 'lucide-react';

interface SpiritualDnaLaboratoryProps {
  chartAnalysis: AkashicChartAnalysis;
  onUpdateChart?: (updated: AkashicChartAnalysis) => void;
}

export const SpiritualDnaLaboratory: React.FC<SpiritualDnaLaboratoryProps> = ({
  chartAnalysis,
}) => {
  const [selectedStrand, setSelectedStrand] = useState<SpiritualDnaStrand>(
    chartAnalysis.spiritualDnaStrands[0]
  );
  const [customOrb, setCustomOrb] = useState<number>(2.0); // Conjunction orb to fixed stars
  const [ancestralNotes, setAncestralNotes] = useState<string>(() => {
    return localStorage.getItem('akashic_dna_notes') || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected body and fixed star for live angular comparison test
  const [testBodyName, setTestBodyName] = useState<string>('Quirón');
  const [testStarId, setTestStarId] = useState<string>('sirius');

  const testBody =
    chartAnalysis.allCelestialBodies.find((b) => b.name.includes(testBodyName)) ||
    chartAnalysis.allCelestialBodies[0];
  const testStar = FIXED_STARS.find((s) => s.id === testStarId) || FIXED_STARS[0];

  // Calculate live angular distance between testBody and testStar
  const diffDeg = React.useMemo(() => {
    let d = Math.abs(testBody.eclipticDegree - testStar.longitudeJ2000);
    if (d > 180) d = 360 - d;
    return Number(d.toFixed(2));
  }, [testBody, testStar]);

  const isConjunctionWithinOrb = diffDeg <= customOrb;

  const handleSaveNotes = () => {
    localStorage.setItem('akashic_dna_notes', ancestralNotes);
    soundEngine.playSingingBowlChime(528);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const playFrequency = (hz: number) => {
    soundEngine.playFrequency(hz);
  };

  // Asteroids list for study
  const targetAsteroids = chartAnalysis.allCelestialBodies.filter(
    (b) =>
      b.name.includes('Quirón') ||
      b.name.includes('Ceres') ||
      b.name.includes('Palas') ||
      b.name.includes('Juno') ||
      b.name.includes('Vesta') ||
      b.name.includes('Psique') ||
      b.name.includes('Eros') ||
      b.name.includes('Lilith')
  );

  return (
    <div id="dna-laboratory-section" className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400">
            <Dna className="w-3.5 h-3.5" />
            <span>LABORATORIO EPIGENÉTICO & TRANSDIMENSIONAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
            ADN Simbólico & Estrellas Fijas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Explora las 12 hebras del ADN akáshico y la transmutación de sellos kármicos heredados de vidas pasadas y de la memoria familiar ancestral. Contrasta las posiciones astronómicas de asteroides y puntos natales frente a los faros estelares con orbe configurable.
          </p>
        </div>
      </div>

      {/* Epistemological Distinction Card (Crucial requirement from prompt) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-slate-300">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono-astro uppercase text-sky-300 text-[11px] block">
            Distinción Científica & Mitológica (Referencia NASA JPL Horizons):
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            No existe un asteroide oficialmente reconocido como «ADN» que permita determinar un linaje biológico o genético extraterrestre observable. En el Atlas Akáshico, el <strong>ADN espiritual</strong> representa un sistema de símbolos arquetípicos y epigenética de la conciencia, mientras que las longitudes zodiacales y los aspectos angulares se calculan mediante efemérides astronómicas rigurosas.
          </p>
        </div>
      </div>

      {/* Grid: 12 Strands of Spiritual DNA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif-cosmic text-slate-100">
              Las 12 Hebras de la Conciencia Akáshica
            </h3>
            <p className="text-xs text-slate-400">
              Selecciona una hebra para examinar su sello kármico a transmutar, frecuencia sonora y anclaje estelar.
            </p>
          </div>
          <span className="text-xs font-mono-astro text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded">
            {chartAnalysis.spiritualDnaStrands.filter((s) => s.status === 'activo').length} Activas ·{' '}
            {chartAnalysis.spiritualDnaStrands.filter((s) => s.status === 'en_transmutacion').length} En Transmutación
          </span>
        </div>

        {/* 12 Strands Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {chartAnalysis.spiritualDnaStrands.map((strand) => {
            const isSelected = selectedStrand.strandNumber === strand.strandNumber;
            const statusColor =
              strand.status === 'activo'
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
                : strand.status === 'en_transmutacion'
                ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
                : 'text-slate-400 border-slate-800 bg-slate-950/60';

            return (
              <button
                key={strand.strandNumber}
                onClick={() => {
                  setSelectedStrand(strand);
                  soundEngine.playSingingBowlChime(strand.activationFrequencyHz);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-1 ring-amber-400 bg-amber-500/15 shadow-md'
                    : 'hover:border-slate-700'
                } ${statusColor}`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-astro">
                  <span>Hebra {strand.strandNumber}</span>
                  <span className="capitalize">{strand.status.replace('_', ' ')}</span>
                </div>
                <span className="text-xs font-bold font-serif-cosmic text-slate-200 block mt-1 truncate">
                  {strand.name.split(':')[1]?.trim() || strand.name}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono-astro">
                  {strand.activationFrequencyHz} Hz
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Strand Deep Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono-astro text-amber-400">
                  {selectedStrand.dimension} · {selectedStrand.chakraBridge}
                </span>
              </div>
              <h4 className="text-xl font-bold font-serif-cosmic text-slate-100 mt-0.5">
                {selectedStrand.name}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playFrequency(selectedStrand.activationFrequencyHz)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-mono-astro"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Sonar {selectedStrand.activationFrequencyHz} Hz</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* The Karmic Seal */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-mono-astro uppercase text-[11px]">
                  Sello Kármico a Desbloquear (Epigenética del Alma)
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed font-semibold">
                {selectedStrand.karmicSeal}
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px] pt-1 border-t border-slate-800">
                La memoria de vidas pasadas dejó grabada una pauta de autodefensa que en la encarnación actual limita tu plenitud. Al hacer consciente este sello, la hebra espiritual se despolariza.
              </p>
            </div>

            {/* Spiritual Activation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-mono-astro uppercase text-[11px]">
                  Activación de la Conciencia
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedStrand.spiritualActivation}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Faro Estelar: <strong className="text-amber-300">{selectedStrand.fixedStarAnchor}</strong></span>
                <span>Cuerpos: <strong className="text-slate-300">{selectedStrand.associatedBodies.join(', ')}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Angular Distance Calculator: Asteroids vs Fixed Stars */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>CALCULADORA DE SEPARACIÓN ANGULAR & ORBE CONFIGURABLE</span>
          </div>
          <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
            Comparador de Asteroides y Puntos Natales con Estrellas Fijas
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Comprueba si un asteroide (Quirón, Ceres, Palas, Juno, Vesta, Psique, Eros) o planeta de tu carta natal forma conjunción estrecha con Sirio, Vega, Arcturus, Aldebarán, etc.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Body */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              1. Selecciona Cuerpo o Asteroide:
            </label>
            <select
              value={testBodyName}
              onChange={(e) => setTestBodyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {chartAnalysis.allCelestialBodies.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.symbol} {b.name} ({b.signDegree}° {b.sign})
                </option>
              ))}
            </select>
          </div>

          {/* Select Fixed Star */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              2. Selecciona Estrella Fija:
            </label>
            <select
              value={testStarId}
              onChange={(e) => setTestStarId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {FIXED_STARS.map((s) => (
                <option key={s.id} value={s.id}>
                  ★ {s.name} ({s.zodiacDegree} {s.zodiacSign})
                </option>
              ))}
            </select>
          </div>

          {/* Configurable Orb Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono-astro text-slate-300">
                3. Orbe Máximo Permitido:
              </label>
              <span className="text-xs font-mono-astro text-amber-400 font-bold">
                {customOrb}°
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={customOrb}
              onChange={(e) => setCustomOrb(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* Live Separation Result Box */}
        <div className={`p-5 rounded-xl border text-xs space-y-2 transition-all ${
          isConjunctionWithinOrb
            ? 'bg-amber-950/20 border-amber-500/50 text-amber-100'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono-astro font-semibold text-sm">
              Separación angular: <strong className="text-amber-300">{diffDeg}°</strong> (
              {Math.floor(diffDeg)}° {Math.floor((diffDeg % 1) * 60)}')
            </span>
            <span className={`px-2.5 py-1 rounded font-mono-astro text-xs ${
              isConjunctionWithinOrb
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-500'
            }`}>
              {isConjunctionWithinOrb ? '★ Conjunción Activa' : 'Fuera del Orbe'}
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isConjunctionWithinOrb
              ? `¡Conjunción comprobada! ${testBody.name} se alinea con ${testStar.name} dentro del orbe de ${customOrb}°. Esto activa la memoria estelar de ${testStar.lineage}. ${testStar.esotericMeaning}`
              : `La distancia angular es de ${diffDeg}°, superior al orbe de ${customOrb}°. No hay conjunción estricta, pero puedes explorar los aspectos mayores a través de la matriz de aspectos.`}
          </p>
        </div>
      </div>

      {/* Ancestral Epigenetics & Soul Family Journal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold font-serif-cosmic text-slate-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Memoria Familiar & Herencia Ancestral</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Registra reflexiones sobre patrones repetitivos en tu linaje biológico (padres, abuelos) y cómo resuenan con tu origen estelar.
            </p>
          </div>
          <button
            onClick={handleSaveNotes}
            className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? '¡Guardado!' : 'Guardar Notas'}</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={ancestralNotes}
          onChange={(e) => setAncestralNotes(e.target.value)}
          placeholder="Escribe aquí observaciones sobre repeticiones en tu familia (duelos no resueltos, profesiones repetidas, talentos heredados) y cómo tu carta natal propone liberarlos..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed font-light"
        />
      </div>

    </div>
  );
};
