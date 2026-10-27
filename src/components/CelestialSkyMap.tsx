import React, { useState } from 'react';
import { FIXED_STARS, ZODIAC_SIGNS } from '../data/akashicKnowledge';
import { FixedStar, AkashicChartAnalysis } from '../types/akashic';
import { soundEngine } from '../utils/audioSynthesis';
import { Sparkles, Info, Star, Compass } from 'lucide-react';

interface CelestialSkyMapProps {
  chartAnalysis: AkashicChartAnalysis | null;
}

export const CelestialSkyMap: React.FC<CelestialSkyMapProps> = ({ chartAnalysis }) => {
  const [selectedStar, setSelectedStar] = useState<FixedStar | null>(FIXED_STARS[0]);
  const [filterLineage, setFilterLineage] = useState<string>('all');

  const lineages = [
    'all',
    'Sirio',
    'Pléyades',
    'Arcturus',
    'Vega/Lira',
    'Orión',
    'Andrómeda',
    'Estrellas Reales',
  ];

  const filteredStars = filterLineage === 'all' 
    ? FIXED_STARS 
    : FIXED_STARS.filter(s => s.lineage === filterLineage);

  // SVG dimensions
  const size = 680;
  const center = size / 2;
  const outerRadius = 300;
  const zodiacRadius = 265;
  const starRadius = 210;
  const planetRadius = 145;

  const toCoords = (deg: number, radius: number) => {
    // 0 deg Aries at 180 deg (left), anti-clockwise
    const angleRad = ((deg - 180) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    };
  };

  return (
    <div className="w-full bg-[#070913] border border-slate-800/80 rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background starlight effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10 border-b border-slate-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>MAPA SIDERAL INTERACTIVO</span>
            <span>·</span>
            <span>ÉPOCA J2000 & PRECESIÓN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-cosmic text-slate-100">
            Bóveda de Estrellas Fijas & Rueda Zodiacal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explora las coordenadas eclípticas reales de los grandes faros estelares. Haz clic sobre cualquier estrella para contrastar su realidad astronómica y su memoria espiritual.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Familia:</span>
          {lineages.map((lineage) => (
            <button
              key={lineage}
              onClick={() => setFilterLineage(lineage)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                filterLineage === lineage
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lineage === 'all' ? 'Todas' : lineage}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Interactive SVG Celestial Wheel */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center">
            
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 25px rgba(15, 23, 42, 0.9))' }}
            >
              {/* Outer decorative ring */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="#05070e"
                stroke="#1e2438"
                strokeWidth="1.5"
              />
              <circle
                cx={center}
                cy={center}
                r={outerRadius - 6}
                fill="none"
                stroke="#333a56"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />

              {/* 12 Zodiac Houses / Signs Segments */}
              {ZODIAC_SIGNS.map((sign, index) => {
                const startAngle = index * 30;
                const midAngle = startAngle + 15;
                const p1 = toCoords(startAngle, outerRadius);
                const p2 = toCoords(startAngle, zodiacRadius);
                const pLabel = toCoords(midAngle, (outerRadius + zodiacRadius) / 2);

                return (
                  <g key={sign.name}>
                    {/* Radial divider */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#2a324d"
                      strokeWidth="1"
                    />
                    {/* Zodiac Glyph & Name */}
                    <text
                      x={pLabel.x}
                      y={pLabel.y}
                      fill="#94a3b8"
                      fontSize="13"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="cursor-pointer hover:fill-amber-300 transition-colors"
                    >
                      {sign.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Zodiac boundary circle */}
              <circle
                cx={center}
                cy={center}
                r={zodiacRadius}
                fill="#080a15"
                stroke="#2a324d"
                strokeWidth="1"
              />

              {/* Inner concentric rings */}
              <circle
                cx={center}
                cy={center}
                r={starRadius}
                fill="none"
                stroke="#1e2438"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <circle
                cx={center}
                cy={center}
                r={planetRadius}
                fill="#060710"
                stroke="#1e2438"
                strokeWidth="1"
              />
              <circle
                cx={center}
                cy={center}
                r={40}
                fill="#030408"
                stroke="#3b4261"
                strokeWidth="1"
              />

              {/* Center Earth/Akasha point */}
              <circle cx={center} cy={center} r={4} fill="#eab308" />
              <text
                x={center}
                y={center + 16}
                fill="#64748b"
                fontSize="8"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
              >
                GAIA · TIERRA
              </text>

              {/* Lines from planets to connected fixed stars if chart is present */}
              {chartAnalysis && chartAnalysis.fixedStarAspects.map((asp, idx) => {
                const pCoord = toCoords(asp.planet.eclipticDegree, planetRadius);
                const sCoord = toCoords(asp.star.longitudeJ2000, starRadius);
                return (
                  <line
                    key={`aspect-line-${idx}`}
                    x1={pCoord.x}
                    y1={pCoord.y}
                    x2={sCoord.x}
                    y2={sCoord.y}
                    stroke="#f59e0b"
                    strokeWidth={asp.isExact ? '1.8' : '1'}
                    strokeDasharray={asp.isExact ? 'none' : '2 2'}
                    opacity={0.7}
                  />
                );
              })}

              {/* User Natal Planets (if calculated) */}
              {chartAnalysis && chartAnalysis.planets.map((p) => {
                const coords = toCoords(p.eclipticDegree, planetRadius);
                return (
                  <g key={`planet-${p.name}`} className="group cursor-pointer">
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={7}
                      fill="#1e1b4b"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                    />
                    <text
                      x={coords.x}
                      y={coords.y}
                      fill="#c7d2fe"
                      fontSize="9"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {p.symbol}
                    </text>
                  </g>
                );
              })}

              {/* User Ascendant (ASC) and Midheaven (MC) indicators */}
              {chartAnalysis && (
                <>
                  {/* Ascendant line */}
                  {(() => {
                    const asc = toCoords(chartAnalysis.ascendant.eclipticDegree, zodiacRadius);
                    return (
                      <g>
                        <line
                          x1={center}
                          y1={center}
                          x2={asc.x}
                          y2={asc.y}
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                        <text
                          x={asc.x}
                          y={asc.y - 8}
                          fill="#38bdf8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="var(--font-mono)"
                          textAnchor="middle"
                        >
                          ASC
                        </text>
                      </g>
                    );
                  })()}
                </>
              )}

              {/* Fixed Stars nodes */}
              {filteredStars.map((star) => {
                const coords = toCoords(star.longitudeJ2000, starRadius);
                const isSelected = selectedStar?.id === star.id;
                const starColor = star.magnitude < 0 ? '#fef08a' : star.magnitude < 1 ? '#67e8f9' : '#e0e7ff';

                return (
                  <g
                    key={star.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedStar(star);
                      soundEngine.playSingingBowlChime(432 + star.magnitude * 20);
                    }}
                  >
                    {/* Selection halo */}
                    {isSelected && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={14}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin-very-slow"
                      />
                    )}

                    {/* Star glowing aura */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? 8 : 5}
                      fill={starColor}
                      opacity={isSelected ? 0.9 : 0.75}
                      className="transition-all"
                    />

                    {/* Star label */}
                    <text
                      x={coords.x}
                      y={coords.y - 10}
                      fill={isSelected ? '#fef08a' : '#cbd5e1'}
                      fontSize={isSelected ? '10' : '8.5'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {star.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

          </div>
        </div>

        {/* Selected Star Details Card */}
        <div className="lg:col-span-5">
          {selectedStar ? (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 shadow-xl relative backdrop-blur-md">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-mono-astro text-amber-400">
                      {selectedStar.lineage}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{selectedStar.constellationNameEs}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif-cosmic text-amber-100 mt-0.5">
                    {selectedStar.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono-astro">
                    {selectedStar.traditionalName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono-astro text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                    {selectedStar.zodiacDegree} {selectedStar.zodiacSign}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mb-4 text-xs text-slate-300">
                {selectedStar.keywords.map((kw, i) => (
                  <span key={i} className="text-slate-400">
                    #{kw} {i < selectedStar.keywords.length - 1 && '·'}
                  </span>
                ))}
              </div>

              {/* Two columns: Astronomical Reality vs Esoteric Meaning */}
              <div className="space-y-3.5 text-xs">
                {/* Rigor Astronómico */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-sky-400 font-medium mb-1">
                    <Info className="w-3.5 h-3.5" />
                    <span className="font-mono-astro uppercase text-[11px] tracking-wide">
                      Cálculo & Rigor Astronómico
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">
                    {selectedStar.astronomicalFacts}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-astro text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <div>Mag. Visual: <span className="text-slate-200">{selectedStar.magnitude}</span></div>
                    <div>Tipo Espectral: <span className="text-slate-200">{selectedStar.spectralType}</span></div>
                    <div>Naturaleza Ptolomeica: <span className="text-slate-200">{selectedStar.naturePlanetary}</span></div>
                    <div>Long. J2000: <span className="text-slate-200">{selectedStar.longitudeJ2000}°</span></div>
                  </div>
                </div>

                {/* Interpretación Esotérica y Starseed */}
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono-astro uppercase text-[11px] tracking-wide">
                      Significado Esotérico & Memoria Akáshica
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedStar.esotericMeaning}
                  </p>
                </div>
              </div>

              {/* If connected in user's natal chart */}
              {chartAnalysis && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  {chartAnalysis.fixedStarAspects.some(a => a.star.id === selectedStar.id) ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                      <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>
                        ¡Alineación activa en tu carta! Conectada con tus posiciones natales.
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      Sin conjunción natal directa (orbe &gt; 2.5°), pero su frecuencia sigue disponible en el mapa cósmico.
                    </p>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm italic border border-dashed border-slate-800 rounded-xl">
              Selecciona una estrella fija en la bóveda para ver su análisis
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
