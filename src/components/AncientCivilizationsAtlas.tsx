import React, { useState } from 'react';
import { AkashicChartAnalysis, AncientAsteroidDefinition, AspectType } from '../types/akashic';
import { ANCIENT_ASTEROIDS_DEFINITIONS, FIXED_STARS } from '../data/akashicKnowledge';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Globe2, 
  Sparkles, 
  Scroll, 
  Compass, 
  Layers, 
  Info, 
  CheckCircle, 
  Send, 
  FileText,
  Printer
} from 'lucide-react';

interface AncientCivilizationsAtlasProps {
  chartAnalysis: AkashicChartAnalysis;
}

export const AncientCivilizationsAtlas: React.FC<AncientCivilizationsAtlasProps> = ({
  chartAnalysis,
}) => {
  const [selectedCiv, setSelectedCiv] = useState<'all' | 'Egipto Antiguo' | 'Atlántida' | 'Sudamérica Ancestral'>('all');
  const [selectedAsteroid, setSelectedAsteroid] = useState<AncientAsteroidDefinition>(
    ANCIENT_ASTEROIDS_DEFINITIONS[0]
  );

  // 4-Phase Interactive Lab State
  const [labCiv, setLabCiv] = useState<string>('Egipto Antiguo');
  const [labAsteroidId, setLabAsteroidId] = useState<string>('isis');
  const [labHouse, setLabHouse] = useState<number>(1);
  const [labAspect, setLabAspect] = useState<AspectType>('Conjunción');
  const [labStarId, setLabStarId] = useState<string>('sirius');
  const [labPersonalNotes, setLabPersonalNotes] = useState<string>('');
  const [labGeneratedReport, setLabGeneratedReport] = useState<string | null>(null);

  const filteredAsteroids =
    selectedCiv === 'all'
      ? ANCIENT_ASTEROIDS_DEFINITIONS
      : ANCIENT_ASTEROIDS_DEFINITIONS.filter((a) => a.civilization === selectedCiv);

  // Find position in user chart
  const asteroidInUserChart = chartAnalysis.allCelestialBodies.find(
    (b) =>
      b.name.toLowerCase().includes(selectedAsteroid.name.toLowerCase()) ||
      (selectedAsteroid.officialNumber && b.asteroidNumber === selectedAsteroid.officialNumber)
  );

  // Generate 4-Phase Lab Report
  const handleGenerateLabReport = () => {
    soundEngine.playSingingBowlChime(528);

    const astDef =
      ANCIENT_ASTEROIDS_DEFINITIONS.find((a) => a.id === labAsteroidId) ||
      ANCIENT_ASTEROIDS_DEFINITIONS[0];
    const starDef = FIXED_STARS.find((s) => s.id === labStarId) || FIXED_STARS[0];

    const report = `
### INFORME ARQUEOASTRONÓMICO & AKÁSHICO
**Tradición investigada:** ${labCiv}
**Asteroide clave:** ${astDef.name} (${astDef.officialNumber}) · Símbolo: ${astDef.symbol}
**Casa investigada:** Casa ${labHouse} · **Aspecto evaluado:** ${labAspect} con ${starDef.name}

---

#### 1. Marco Astronómico & Arqueológico (Designación Oficial MPC/JPL)
${astDef.astronomicalFact}
*Contexto arqueoastronómico:* ${astDef.archaeoastronomyContext}

#### 2. Dinámica de Aspectos & Geometría Sagrada
La presencia de **${astDef.name}** en la Casa ${labHouse} activando un aspecto de **${labAspect}** con **${starDef.name}** (${starDef.lineage}) crea un puente entre la memoria terrestre de ${labCiv} y la frecuencia galáctica de ${starDef.name}. En la Casa ${labHouse}, este principio pide manifestarse a través de la verdad, la templanza y el servicio consciente.

#### 3. Memoria Kármica & Vidas Pasadas
${astDef.karmicMemory}

#### 4. Síntesis Monádica del Alma
*Frecuencia Akáshica:* ${astDef.akashicFrequency}
${labPersonalNotes ? `*Tus observaciones personales:* "${labPersonalNotes}"` : ''}

*Aviso ético:* Las asociaciones entre asteroides, civilizaciones antiguas y vidas pasadas son modelos interpretativos arquetípicos y esotéricos para la introspección personal, no hechos fácticos empíricamente demostrables.
`;

    setLabGeneratedReport(report);
  };

  return (
    <div id="ancient-civilizations-section" className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400">
            <Globe2 className="w-3.5 h-3.5" />
            <span>ATLAS DE CIVILIZACIONES ANCESTRALES · LAS SIETE CAPAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
            Egipto, Atlántida & Sudamérica Ancestral
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Un método propio que combina efemérides astronómicas de asteroides nombrados en honor a culturas y santuarios antiguos (Giza, Sphinx, Isis, Osiris, Atlantis, Inka, Machu-Picchu, Quetzalcoatl) con la cosmología esotérica, las estrellas fijas y la Casa XII.
          </p>
        </div>
      </div>

      {/* Civilization Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Todas las Civilizaciones' },
          { id: 'Egipto Antiguo', label: 'Egipto Antiguo (Giza, Isis, Osiris, Sphinx)' },
          { id: 'Atlántida', label: 'Atlántida (Atlantis 1198)' },
          { id: 'Sudamérica Ancestral', label: 'Sudamérica Ancestral (Inka, Machu-Picchu, Quetzalcoatl)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCiv(tab.id as any)}
            className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCiv === tab.id
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asteroids Grid & Selected Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Asteroids Cards */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredAsteroids.map((ast) => {
            const isSelected = selectedAsteroid.id === ast.id;
            const inChart = chartAnalysis.allCelestialBodies.find(
              (b) =>
                b.name.toLowerCase().includes(ast.name.toLowerCase()) ||
                (ast.officialNumber && b.asteroidNumber === ast.officialNumber)
            );

            return (
              <div
                key={ast.id}
                onClick={() => {
                  setSelectedAsteroid(ast);
                  soundEngine.playSingingBowlChime(432);
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-100 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold font-serif-cosmic text-slate-100">
                    <span className="text-base">{ast.symbol}</span>
                    <span>{ast.name} ({ast.officialNumber})</span>
                  </div>
                  <span className="text-[10px] font-mono-astro text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {ast.civilization}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                  {ast.historicalArchetype}
                </p>

                {inChart && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-astro text-amber-300">
                    <span>En tu carta: {inChart.signDegree}° {inChart.sign}</span>
                    <span>Casa {inChart.house}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Archaeoastronomical & Karmic Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400">
                <span>{selectedAsteroid.civilization}</span>
                <span>·</span>
                <span>Asteroide #{selectedAsteroid.officialNumber}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif-cosmic text-slate-100 mt-1 flex items-center gap-2">
                <span>{selectedAsteroid.symbol}</span>
                <span>{selectedAsteroid.name}</span>
              </h3>
              <p className="text-xs text-slate-400 italic">
                {selectedAsteroid.historicalArchetype}
              </p>
            </div>

            {asteroidInUserChart && (
              <div className="bg-slate-950 border border-amber-500/30 p-3 rounded-xl text-right">
                <span className="text-[10px] font-mono-astro text-slate-400 block">Posición Natal:</span>
                <span className="text-xs font-bold text-amber-300 font-mono-astro">
                  {asteroidInUserChart.signDegree}° {asteroidInUserChart.sign} (Casa {asteroidInUserChart.house})
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono-astro text-sky-400 text-[11px] uppercase tracking-wider block">
                Contexto Arqueoastronómico Real:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedAsteroid.archaeoastronomyContext}
              </p>
              <div className="pt-2 text-[11px] font-mono-astro text-slate-400 border-t border-slate-800/80">
                {selectedAsteroid.astronomicalFact}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-1">
              <span className="font-mono-astro text-rose-400 text-[11px] uppercase tracking-wider block">
                Memoria Kármica & Lección del Alma:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedAsteroid.karmicMemory}
              </p>
            </div>

            <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/30 space-y-1">
              <span className="font-mono-astro text-amber-300 text-[11px] uppercase tracking-wider block">
                Frecuencia Akáshica & Misión Presente:
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {selectedAsteroid.akashicFrequency}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* The 4-Phase Interactive Laboratory */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>EL MÉTODO DE LAS 4 FASES</span>
          </div>
          <h3 className="text-xl font-bold font-serif-cosmic text-slate-100">
            Laboratorio de Investigación: Civilización, Casa, Aspecto y Estrella Guía
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Construye una investigación simbólica personalizada articulando una civilización, un asteroide, una casa natal, un aspecto y una estrella fija.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Phase 1: Select Tradition */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1">
              1. Tradición:
            </label>
            <select
              value={labCiv}
              onChange={(e) => setLabCiv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 cursor-pointer"
            >
              <option value="Egipto Antiguo">Egipto Antiguo</option>
              <option value="Atlántida">Atlántida</option>
              <option value="Sudamérica Ancestral">Sudamérica Ancestral</option>
            </select>
          </div>

          {/* Phase 2: Select Asteroid */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1">
              2. Asteroide:
            </label>
            <select
              value={labAsteroidId}
              onChange={(e) => setLabAsteroidId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-amber-200 cursor-pointer"
            >
              {ANCIENT_ASTEROIDS_DEFINITIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.officialNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Phase 3: Select House */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1">
              3. Casa Natal:
            </label>
            <select
              value={labHouse}
              onChange={(e) => setLabHouse(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  Casa {h} {h === 12 ? '(Karma & Inconsciente)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 4: Aspect */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1">
              4. Aspecto Evaluado:
            </label>
            <select
              value={labAspect}
              onChange={(e) => setLabAspect(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 cursor-pointer"
            >
              <option value="Conjunción">Conjunción (0°)</option>
              <option value="Trígono">Trígono (120°)</option>
              <option value="Sextil">Sextil (60°)</option>
              <option value="Cuadratura">Cuadratura (90°)</option>
              <option value="Oposición">Oposición (180°)</option>
              <option value="Quincuncio">Quincuncio (150°)</option>
            </select>
          </div>

          {/* Fixed Star Anchor */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1">
              5. Estrella Fija Guía:
            </label>
            <select
              value={labStarId}
              onChange={(e) => setLabStarId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-amber-200 cursor-pointer"
            >
              {FIXED_STARS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.lineage})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-xs font-mono-astro text-slate-400 mb-1">
            Notas Introspectivas o Pregunta al Registro:
          </label>
          <input
            type="text"
            value={labPersonalNotes}
            onChange={(e) => setLabPersonalNotes(e.target.value)}
            placeholder="Ej: Siento una fascinación inexplicable por las pirámides y la arquitectura de templos..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerateLabReport}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md font-serif-cosmic"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Generar Síntesis Arqueoastronómica</span>
          </button>
        </div>

        {/* Generated Report Card */}
        {labGeneratedReport && (
          <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono-astro text-amber-400 uppercase tracking-wider">
                Dictamen del Laboratorio de Civilizaciones
              </span>
              <button
                onClick={() => window.print()}
                className="text-slate-400 hover:text-amber-300 text-xs font-mono-astro flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Informe</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3 font-light">
              {labGeneratedReport}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
