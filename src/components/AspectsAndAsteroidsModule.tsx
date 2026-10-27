import React, { useState } from 'react';
import { 
  AkashicChartAnalysis, 
  PlanetPosition, 
  ChartAspect, 
  AspectOrbsConfig, 
  ManualBodyPosition 
} from '../types/akashic';
import { 
  ASTEROIDS_DEFINITIONS, 
  ZODIAC_SIGNS, 
  DEFAULT_ASPECT_ORBS 
} from '../data/akashicKnowledge';
import { calculateAspectsBetweenBodies } from '../utils/astrologyEngine';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Sliders, 
  Sparkles, 
  Settings2, 
  Compass, 
  Info, 
  Edit3, 
  RotateCcw, 
  Grid, 
  Layers, 
  ShieldCheck, 
  Heart, 
  Flame, 
  Eye,
  CheckCircle2
} from 'lucide-react';

interface AspectsAndAsteroidsModuleProps {
  chartAnalysis: AkashicChartAnalysis;
  onUpdateChart: (updated: AkashicChartAnalysis) => void;
}

export const AspectsAndAsteroidsModule: React.FC<AspectsAndAsteroidsModuleProps> = ({
  chartAnalysis,
  onUpdateChart,
}) => {
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'asteroids_study' | 'manual_calibration' | 'cross_synthesis'
  >('matrix');

  // Orbs configuration
  const [orbsConfig, setOrbsConfig] = useState<AspectOrbsConfig>(DEFAULT_ASPECT_ORBS);
  const [showOrbsConfig, setShowOrbsConfig] = useState(false);

  // Selected aspect for detailed view modal/drawer
  const [selectedAspect, setSelectedAspect] = useState<ChartAspect | null>(
    chartAnalysis.aspects[0] || null
  );

  // Selected asteroid for deep study
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string>('chiron');

  // Manual Positions form state
  const [manualBodies, setManualBodies] = useState<Record<string, ManualBodyPosition>>(() => {
    const initial: Record<string, ManualBodyPosition> = {};
    chartAnalysis.allCelestialBodies.forEach((b) => {
      initial[b.name] = {
        sign: b.sign,
        degree: Math.floor(b.signDegree),
        minute: Math.floor((b.signDegree % 1) * 60),
        house: b.house,
        isCustom: false,
      };
    });
    return initial;
  });

  // Re-calculate aspects whenever orbsConfig changes
  const computedAspects = React.useMemo(() => {
    return calculateAspectsBetweenBodies(chartAnalysis.allCelestialBodies, orbsConfig);
  }, [chartAnalysis.allCelestialBodies, orbsConfig]);

  // Handle Zodiac Type change (Tropical vs Sidereal)
  const toggleZodiacType = (type: 'tropical' | 'sidereal') => {
    if (chartAnalysis.userData.zodiacType === type) return;
    const updatedData = { ...chartAnalysis.userData, zodiacType: type };
    soundEngine.playSingingBowlChime(432);
    // Trigger recalculation with existing calculateAkashicChart
    import('../utils/astrologyEngine').then(({ calculateAkashicChart }) => {
      const newAnalysis = calculateAkashicChart(updatedData);
      onUpdateChart(newAnalysis);
    });
  };

  // Handle House System change
  const changeHouseSystem = (system: 'placidus' | 'equal' | 'wholesign') => {
    if (chartAnalysis.userData.houseSystem === system) return;
    const updatedData = { ...chartAnalysis.userData, houseSystem: system };
    soundEngine.playSingingBowlChime(528);
    import('../utils/astrologyEngine').then(({ calculateAkashicChart }) => {
      const newAnalysis = calculateAkashicChart(updatedData);
      onUpdateChart(newAnalysis);
    });
  };

  // Handle Manual Position Change
  const handleManualChange = (
    bodyName: string,
    field: keyof ManualBodyPosition,
    value: any
  ) => {
    setManualBodies((prev) => ({
      ...prev,
      [bodyName]: {
        ...prev[bodyName],
        [field]: value,
        isCustom: true,
      },
    }));
  };

  // Apply Manual Positions to the Chart
  const handleApplyManualPositions = () => {
    soundEngine.playSingingBowlChime(528);
    const updatedUserData = {
      ...chartAnalysis.userData,
      manualPositions: manualBodies,
    };
    import('../utils/astrologyEngine').then(({ calculateAkashicChart }) => {
      const newAnalysis = calculateAkashicChart(updatedUserData);
      onUpdateChart(newAnalysis);
    });
  };

  // Reset to Automated Calculations
  const handleResetManualPositions = () => {
    soundEngine.playSingingBowlChime(432);
    const resetBodies: Record<string, ManualBodyPosition> = {};
    chartAnalysis.allCelestialBodies.forEach((b) => {
      resetBodies[b.name] = {
        sign: b.sign,
        degree: Math.floor(b.signDegree),
        minute: Math.floor((b.signDegree % 1) * 60),
        house: b.house,
        isCustom: false,
      };
    });
    setManualBodies(resetBodies);
    const updatedUserData = {
      ...chartAnalysis.userData,
      manualPositions: undefined,
    };
    import('../utils/astrologyEngine').then(({ calculateAkashicChart }) => {
      const newAnalysis = calculateAkashicChart(updatedUserData);
      onUpdateChart(newAnalysis);
    });
  };

  // Get active Asteroid Definition
  const currentAsteroidDef =
    ASTEROIDS_DEFINITIONS.find((a) => a.id === selectedAsteroidId) || ASTEROIDS_DEFINITIONS[0];
  const currentAsteroidInChart = chartAnalysis.asteroids.find(
    (a) => a.name.toLowerCase().includes(currentAsteroidDef.name.toLowerCase().split(' ')[0])
  );

  // Key primary bodies for matrix display
  const matrixBodies = chartAnalysis.allCelestialBodies.slice(0, 16);

  return (
    <div id="aspects-asteroids-section" className="space-y-8">
      
      {/* Module Banner & System Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-[#070914] to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>GEOMETRÍA ANGULAR SAGRADA & ASTEROIDES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
              Cálculo de Aspectos & Estudio de Asteroides
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed font-light">
              Calcula la separación angular entre planetas, asteroides mayores (Ceres, Palas, Juno, Vesta, Quirón, Psique, Eros, Lilith) y ángulos de la carta, ajustando orbes y calibrando posiciones manuales.
            </p>
          </div>

          {/* Engine Parameters: Tropical/Sideral and House System Selectors */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            {/* Zodiac System */}
            <div>
              <span className="block text-[10px] uppercase font-mono-astro text-slate-400 mb-1">
                Zodiaco
              </span>
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
                <button
                  onClick={() => toggleZodiacType('tropical')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    chartAnalysis.zodiacType === 'tropical'
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tropical
                </button>
                <button
                  onClick={() => toggleZodiacType('sidereal')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    chartAnalysis.zodiacType === 'sidereal'
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Ayanamsha Lahiri actual: ${chartAnalysis.ayanamshaDeg}°`}
                >
                  Sideral
                </button>
              </div>
            </div>

            {/* House System */}
            <div>
              <span className="block text-[10px] uppercase font-mono-astro text-slate-400 mb-1">
                Sistema de Casas
              </span>
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs">
                {(['placidus', 'equal', 'wholesign'] as const).map((sys) => (
                  <button
                    key={sys}
                    onClick={() => changeHouseSystem(sys)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                      chartAnalysis.userData.houseSystem === sys
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sys === 'wholesign' ? 'Signo Entero' : sys === 'equal' ? 'Iguales' : 'Placidus'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'matrix', label: '1. Matriz de Aspectos & Orbes', icon: Grid },
            { id: 'asteroids_study', label: '2. Estudio de Asteroides & Centauros', icon: Sparkles },
            { id: 'manual_calibration', label: '3. Calibrador Manual de Posiciones', icon: Edit3 },
            { id: 'cross_synthesis', label: '4. Síntesis Cruzada (Casas, Asteroides & Mónada)', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
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

      {/* SUBTAB 1: ASPECT MATRIX & ORBS CONFIGURATOR */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          
          {/* Top Bar with Aspect Stats & Orbs Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-serif-cosmic text-slate-100">
                  Matriz Angular de Aspectos Mayores y Menores
                </span>
                <span className="text-xs font-mono-astro text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                  {computedAspects.length} aspectos activos
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detecta conjunciones (0°), sextiles (60°), cuadraturas (90°), trígonos (120°), oposiciones (180°) y quincuncios (150°).
              </p>
            </div>

            <button
              onClick={() => setShowOrbsConfig(!showOrbsConfig)}
              className="flex items-center gap-2 text-xs font-mono-astro text-slate-200 hover:text-amber-300 bg-slate-950 border border-slate-800 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showOrbsConfig ? 'Ocultar Orbes' : 'Configurar Orbes'}</span>
            </button>
          </div>

          {/* Collapsible Orbs Configurator */}
          {showOrbsConfig && (
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono-astro text-amber-300 uppercase tracking-wider">
                  Configuración de Orbes Máximos Permitidos (en Grados °)
                </span>
                <button
                  onClick={() => setOrbsConfig(DEFAULT_ASPECT_ORBS)}
                  className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 font-mono-astro cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer Orbes Estándar</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono-astro">
                {[
                  { key: 'conjunction', label: 'Conjunción (0°)', symbol: '☌' },
                  { key: 'sextile', label: 'Sextil (60°)', symbol: '⚹' },
                  { key: 'square', label: 'Cuadratura (90°)', symbol: '□' },
                  { key: 'trine', label: 'Trígono (120°)', symbol: '△' },
                  { key: 'opposition', label: 'Oposición (180°)', symbol: '☍' },
                  { key: 'quincunx', label: 'Quincuncio (150°)', symbol: '⚻' },
                ].map((item) => (
                  <div key={item.key} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[11px]">
                      {item.symbol} {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="0.5"
                        value={(orbsConfig as any)[item.key]}
                        onChange={(e) =>
                          setOrbsConfig({
                            ...orbsConfig,
                            [item.key]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <span className="text-amber-300 font-bold w-7 text-right">
                        {(orbsConfig as any)[item.key]}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Astrological Matrix Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400 font-mono-astro text-[11px]">
                    Planeta / Asteroide
                  </th>
                  {matrixBodies.map((b) => (
                    <th
                      key={b.name}
                      title={`${b.name} en ${b.sign} ${b.signDegree}°`}
                      className="p-2 border border-slate-800 bg-slate-900 text-slate-300 font-mono-astro min-w-[36px]"
                    >
                      <span className="block text-sm">{b.symbol}</span>
                      <span className="text-[9px] text-slate-400 block truncate max-w-[36px]">
                        {b.name.split(' ')[0]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixBodies.map((rowBody, rIdx) => (
                  <tr key={rowBody.name}>
                    <td className="p-2 border border-slate-800 bg-slate-900 text-left font-medium text-slate-200 font-mono-astro whitespace-nowrap">
                      <span className="text-amber-300 mr-1.5">{rowBody.symbol}</span>
                      <span>{rowBody.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-light">
                        {rowBody.signDegree}° {rowBody.sign.slice(0, 3)}
                      </span>
                    </td>
                    {matrixBodies.map((colBody, cIdx) => {
                      if (rIdx === cIdx) {
                        return (
                          <td
                            key={colBody.name}
                            className="border border-slate-800/80 bg-slate-900/30 text-slate-600"
                          >
                            —
                          </td>
                        );
                      }
                      if (cIdx > rIdx) {
                        // Upper triangle: leave empty or subtle dot for clarity
                        return (
                          <td
                            key={colBody.name}
                            className="border border-slate-800/40 bg-slate-950/20 text-slate-800"
                          >
                            ·
                          </td>
                        );
                      }

                      // Find if aspect exists between rowBody and colBody
                      const aspect = computedAspects.find(
                        (a) =>
                          (a.body1.name === rowBody.name && a.body2.name === colBody.name) ||
                          (a.body1.name === colBody.name && a.body2.name === rowBody.name)
                      );

                      if (!aspect) {
                        return (
                          <td
                            key={colBody.name}
                            className="border border-slate-800/60 bg-slate-950/60 text-slate-700"
                          >
                            ·
                          </td>
                        );
                      }

                      // Color coding for aspect symbol
                      const colorClass =
                        aspect.type === 'Trígono' || aspect.type === 'Sextil'
                          ? 'text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40'
                          : aspect.type === 'Cuadratura' || aspect.type === 'Oposición'
                          ? 'text-rose-400 bg-rose-950/20 hover:bg-rose-900/40'
                          : aspect.type === 'Conjunción'
                          ? 'text-amber-300 bg-amber-950/20 hover:bg-amber-900/40'
                          : 'text-purple-300 bg-purple-950/20 hover:bg-purple-900/40';

                      return (
                        <td
                          key={colBody.name}
                          onClick={() => {
                            setSelectedAspect(aspect);
                            soundEngine.playSingingBowlChime(432 + aspect.orb * 15);
                          }}
                          title={`${aspect.body1.name} ${aspect.type} ${aspect.body2.name} (Orbe: ${aspect.orb}°)`}
                          className={`border border-slate-800 cursor-pointer font-bold transition-all text-xs ${colorClass}`}
                        >
                          <span className="block text-sm">{aspect.symbol}</span>
                          <span className="text-[8px] font-mono-astro block font-normal opacity-80">
                            {aspect.orb}°
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Aspect Interpretation Inspector Card */}
          {selectedAspect && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-5 sm:p-6 space-y-4 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-amber-300 bg-slate-950 border border-slate-800 p-2 rounded-lg">
                    {selectedAspect.symbol}
                  </span>
                  <div>
                    <h4 className="text-base font-bold font-serif-cosmic text-slate-100">
                      {selectedAspect.body1.name} en {selectedAspect.type} con {selectedAspect.body2.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono-astro">
                      Naturaleza: {selectedAspect.harmonicNature} · Ángulo: {selectedAspect.actualDifference}°
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono-astro px-2.5 py-1 rounded ${
                    selectedAspect.isExact
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    Orbe: {selectedAspect.orb}° {selectedAspect.isExact && '★ Aspecto Partil/Exacto'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-mono-astro text-sky-400 text-[11px] block">
                    Posición en la Carta:
                  </span>
                  <p className="text-slate-300">
                    • <strong>{selectedAspect.body1.name}</strong> en {selectedAspect.body1.signDegree}° {selectedAspect.body1.sign} (Casa {selectedAspect.body1.house})
                  </p>
                  <p className="text-slate-300">
                    • <strong>{selectedAspect.body2.name}</strong> en {selectedAspect.body2.signDegree}° {selectedAspect.body2.sign} (Casa {selectedAspect.body2.house})
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-indigo-500/30 space-y-1">
                  <span className="font-mono-astro text-amber-300 text-[11px] block">
                    Interpretación Kármica & Psicológica:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-light">
                    {selectedAspect.interpretation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* List of Aspects Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-mono-astro uppercase text-slate-400 tracking-wider block">
              Lista Completa de Aspectos Ordenados por Precisión de Orbe:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {computedAspects.map((asp) => (
                <div
                  key={asp.id}
                  onClick={() => {
                    setSelectedAspect(asp);
                    soundEngine.playSingingBowlChime(432);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedAspect?.id === asp.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-100 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">
                      {asp.body1.symbol} {asp.body1.name} {asp.symbol} {asp.body2.symbol} {asp.body2.name}
                    </span>
                    <span className="text-[10px] font-mono-astro text-amber-400">
                      {asp.orb}°
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {asp.type} · {asp.harmonicNature}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: DEEP ASTEROIDS & CENTAURS STUDY */}
      {activeTab === 'asteroids_study' && (
        <div className="space-y-6">
          
          {/* Asteroid Quick Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ASTEROIDS_DEFINITIONS.map((ast) => {
              const isSelected = selectedAsteroidId === ast.id;
              const inChart = chartAnalysis.asteroids.find((a) =>
                a.name.toLowerCase().includes(ast.name.toLowerCase().split(' ')[0])
              );
              return (
                <button
                  key={ast.id}
                  onClick={() => {
                    setSelectedAsteroidId(ast.id);
                    soundEngine.playSingingBowlChime(432);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{ast.symbol}</span>
                  <span className="text-xs font-bold text-slate-200 font-serif-cosmic block truncate">
                    {ast.name.split(' ')[0]}
                  </span>
                  {inChart && (
                    <span className="text-[10px] text-amber-400 font-mono-astro block">
                      {inChart.sign.slice(0, 3)} · C{inChart.house}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Asteroid Deep Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-amber-300 font-bold">{currentAsteroidDef.symbol}</span>
                  <span className="text-xs uppercase font-mono-astro text-amber-400">
                    {currentAsteroidDef.astronomicalCategory}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif-cosmic text-slate-100 mt-1">
                  {currentAsteroidDef.name}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  {currentAsteroidDef.archetype}
                </p>
              </div>

              {currentAsteroidInChart && (
                <div className="text-right bg-slate-950 border border-amber-500/30 p-3 rounded-xl">
                  <span className="text-[11px] font-mono-astro text-slate-400 block">
                    Posición en tu Carta:
                  </span>
                  <span className="text-sm font-bold text-amber-300 font-mono-astro">
                    {currentAsteroidInChart.signDegree}° {currentAsteroidInChart.sign} · Casa {currentAsteroidInChart.house}
                  </span>
                </div>
              )}
            </div>

            {/* Mythological Narrative */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono-astro text-amber-300 text-xs block mb-1">
                Mito Sagrado & Origen Arquetípico:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {currentAsteroidDef.mythologicalStory}
              </p>
            </div>

            {/* Split Grid: Astronomical Facts vs Karmic Function */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div className="bg-slate-950 p-5 rounded-xl border border-sky-500/30 space-y-2">
                <span className="font-mono-astro text-sky-400 uppercase text-[11px] block">
                  Rigor Astronómico:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {currentAsteroidDef.astronomicalFacts}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-astro text-slate-400 pt-2 border-t border-slate-800">
                  <div>Diámetro: <span className="text-slate-200">{currentAsteroidDef.diameterKm}</span></div>
                  <div>Descubrimiento: <span className="text-slate-200">{currentAsteroidDef.discoveryYear}</span></div>
                  <div>Periodo Orbital: <span className="text-slate-200">{currentAsteroidDef.orbitalPeriodYears}</span></div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/30 space-y-2">
                <span className="font-mono-astro text-amber-300 uppercase text-[11px] block">
                  Significado Kármico & Psicológico:
                </span>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {currentAsteroidDef.karmicSignificance}
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong>Función psicológica:</strong> {currentAsteroidDef.psychologicalFunction}
                </div>
              </div>

            </div>

            {/* Asteroid in current house meaning */}
            {currentAsteroidInChart && (
              <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/30">
                <span className="font-mono-astro text-amber-300 text-xs block mb-1">
                  Interpretación de {currentAsteroidDef.name} en la Casa {currentAsteroidInChart.house}:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  En la Casa {currentAsteroidInChart.house}, {currentAsteroidDef.name} actúa como un catalizador en el ámbito de {currentAsteroidDef.houseMeaningKeywords[currentAsteroidInChart.house - 1] || 'tu evolución espiritual'}. Te desafía a sanar el pasado y elevar la vibración de este sector de vida hacia la sabiduría pura.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* SUBTAB 3: MANUAL CALIBRATION (SIGNS, DEGREES & HOUSES) */}
      {activeTab === 'manual_calibration' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
                Calibrador Manual de Posiciones Natales
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                ¿Posees tu carta natal calculada previamente en Swiss Ephemeris o Astro.com? Puedes introducir o ajustar manualmente el signo, grado y casa de cualquier planeta o asteroide. La matriz de aspectos y estrellas fijas se recalculará automáticamente.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetManualPositions}
                className="flex items-center gap-1.5 text-xs font-mono-astro text-slate-400 hover:text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Todo</span>
              </button>
              <button
                onClick={handleApplyManualPositions}
                className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aplicar a la Carta</span>
              </button>
            </div>
          </div>

          {/* Table of Bodies with Editable Fields */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono-astro">
                  <th className="py-2.5 px-3">Cuerpo Celeste</th>
                  <th className="py-2.5 px-3">Signo Zodiacal</th>
                  <th className="py-2.5 px-3">Grado (0-29°)</th>
                  <th className="py-2.5 px-3">Minutos (0-59')</th>
                  <th className="py-2.5 px-3">Casa (1-12)</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {chartAnalysis.allCelestialBodies.map((body) => {
                  const current = manualBodies[body.name] || {
                    sign: body.sign,
                    degree: Math.floor(body.signDegree),
                    minute: Math.floor((body.signDegree % 1) * 60),
                    house: body.house,
                    isCustom: false,
                  };

                  return (
                    <tr key={body.name} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-100 flex items-center gap-2">
                        <span className="text-amber-300 font-mono-astro">{body.symbol}</span>
                        <span>{body.name}</span>
                        {body.isAsteroid && (
                          <span className="text-[10px] text-slate-500 font-mono-astro bg-slate-900 px-1.5 py-0.2 rounded">
                            Asteroide
                          </span>
                        )}
                      </td>

                      {/* Sign Selector */}
                      <td className="py-2.5 px-3">
                        <select
                          value={current.sign}
                          onChange={(e) => handleManualChange(body.name, 'sign', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {ZODIAC_SIGNS.map((z) => (
                            <option key={z.name} value={z.name}>
                              {z.symbol} {z.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Degree Input */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          max="29"
                          value={current.degree}
                          onChange={(e) =>
                            handleManualChange(
                              body.name,
                              'degree',
                              Math.max(0, Math.min(29, parseInt(e.target.value, 10) || 0))
                            )
                          }
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono-astro"
                        />
                      </td>

                      {/* Minute Input */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={current.minute}
                          onChange={(e) =>
                            handleManualChange(
                              body.name,
                              'minute',
                              Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0))
                            )
                          }
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono-astro"
                        />
                      </td>

                      {/* House Selector */}
                      <td className="py-2.5 px-3">
                        <select
                          value={current.house}
                          onChange={(e) =>
                            handleManualChange(body.name, 'house', parseInt(e.target.value, 10) || 1)
                          }
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                            <option key={h} value={h}>
                              Casa {h}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-[11px] font-mono-astro">
                        {current.isCustom ? (
                          <span className="text-amber-400">Manual</span>
                        ) : (
                          <span className="text-slate-500">Automático</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUBTAB 4: CROSS SYNTHESIS (HOUSES, ASTEROIDS, STARS & MONAD) */}
      {activeTab === 'cross_synthesis' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
              Integración Cruzada: Asteroides, Casa XII, Estrellas Fijas y Mónada
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Al relacionar los asteroides con el misterio de la Casa XII y los rayos de la Mónada, descubrimos cómo las heridas del pasado se convierten en llaves de maestría.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs pt-2">
              
              {/* Asteroids in House XII */}
              <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 space-y-3">
                <span className="font-mono-astro text-purple-400 uppercase text-[11px] block">
                  Asteroides en Casa XII ({chartAnalysis.twelfthHouseAsteroids.length})
                </span>
                {chartAnalysis.twelfthHouseAsteroids.length > 0 ? (
                  <div className="space-y-3">
                    {chartAnalysis.twelfthHouseAsteroids.map((ast) => (
                      <div key={ast.name} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <span className="text-amber-300 font-bold block mb-1">
                          {ast.symbol} {ast.name} en Casa XII ({ast.sign})
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          La presencia de {ast.name} en la Casa XII indica un pacto sagrado o voto de vidas pasadas que operaba en tu sombra inconsciente, ahora listo para ser redimido y entregado como servicio compasivo.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px] leading-relaxed italic">
                    Tus asteroides principales no ocupan la Casa XII directamente, permitiendo que su energía se manifieste en las casas visibles de tu carta natal.
                  </p>
                )}
              </div>

              {/* Asteroids Conjunction with Fixed Stars */}
              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-3">
                <span className="font-mono-astro text-amber-300 uppercase text-[11px] block">
                  Contactos de Asteroides con Estrellas Fijas
                </span>
                {(() => {
                  const asteroidStarAspects = chartAnalysis.fixedStarAspects.filter(
                    (asp) => asp.planet.isAsteroid
                  );
                  if (asteroidStarAspects.length === 0) {
                    return (
                      <p className="text-slate-400 text-[11px] leading-relaxed italic">
                        No hay conjunciones menores a 2.5° entre asteroides y las 12 grandes estrellas fijas; los asteroides operan principalmente a través de sus aspectos con planetas natales.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      {asteroidStarAspects.map((asp, i) => (
                        <div key={i} className="p-3 bg-slate-900 rounded-lg border border-amber-500/20 text-xs">
                          <span className="text-amber-200 font-semibold block mb-0.5">
                            {asp.planet.name} ☌ {asp.star.name}
                          </span>
                          <p className="text-slate-300 text-[11px]">
                            Orbe de {asp.orbDegrees}°: activa la frecuencia del linaje {asp.star.lineage}.
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Resonance with the Monad Ray */}
              <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 space-y-3">
                <span className="font-mono-astro text-emerald-400 uppercase text-[11px] block">
                  Alineación con tu {chartAnalysis.monadRay.name.split(':')[0]}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Los asteroides complementan a los 7 planetas sagrados actuando como "agujas finas" de acupuntura cósmica. Conectan tu personalidad con el Rayo {chartAnalysis.monadRay.rayNumber} ({chartAnalysis.monadRay.name.split(':')[1]?.trim()}), facilitando que el propósito espiritual se concrete en acciones cotidianas impecables.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[10px] text-amber-300/90 font-mono-astro">
                  Chispa Monádica activa en la materia.
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
