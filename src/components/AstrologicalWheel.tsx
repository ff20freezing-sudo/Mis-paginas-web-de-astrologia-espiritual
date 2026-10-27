import React, { useState, useRef } from 'react';
import { AkashicChartAnalysis, PlanetPosition, ChartAspect } from '../types/akashic';
import { ZODIAC_SIGNS, FIXED_STARS } from '../data/akashicKnowledge';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Info,
  Maximize2
} from 'lucide-react';

interface AstrologicalWheelProps {
  chartAnalysis: AkashicChartAnalysis;
  onSelectBody?: (body: PlanetPosition) => void;
}

export const AstrologicalWheel: React.FC<AstrologicalWheelProps> = ({
  chartAnalysis,
  onSelectBody,
}) => {
  const [showAsteroids, setShowAsteroids] = useState(true);
  const [showAspectLines, setShowAspectLines] = useState(true);
  const [showFixedStars, setShowFixedStars] = useState(true);
  const [showHouseNumbers, setShowHouseNumbers] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<PlanetPosition | null>(
    chartAnalysis.planets[0] || null
  );

  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Geometry Dimensions
  const size = 760;
  const center = size / 2;
  const rOuter = 350;
  const rZodiacOuter = 345;
  const rZodiacInner = 295;
  const rPlanetRing = 240;
  const rHouseInner = 160;
  const rCenterHub = 60;

  // The Ascendant degree defines the rotation so ASC is placed at 9 o'clock (180° in SVG math)
  const ascDegree = chartAnalysis.ascendant.eclipticDegree;

  // Convert ecliptic degree (0-360) into SVG angle (radians) such that ASC is at 180° (Left)
  // Moving counter-clockwise along the zodiac
  const eclipticToCanvasAngle = (eclipticDeg: number): number => {
    // Relative to Ascendant: angle = 180 - (eclipticDeg - ascDegree)
    const relDeg = (eclipticDeg - ascDegree);
    const canvasDeg = 180 - relDeg;
    return (canvasDeg * Math.PI) / 180;
  };

  const getCanvasCoords = (eclipticDeg: number, radius: number) => {
    const angle = eclipticToCanvasAngle(eclipticDeg);
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Filter bodies to render on the wheel
  const bodiesToRender: PlanetPosition[] = [
    ...chartAnalysis.planets,
    ...(showAsteroids ? chartAnalysis.asteroids : []),
    chartAnalysis.ascendant,
    chartAnalysis.midheaven,
  ];

  // Element colors for zodiac segments
  const getElementBgColor = (element: string) => {
    switch (element) {
      case 'Fuego': return '#3f1515'; // Warm crimson
      case 'Tierra': return '#1a2e1d'; // Deep forest
      case 'Aire': return '#132838'; // Dark slate blue
      case 'Agua': return '#1d1738'; // Midnight indigo
      default: return '#111827';
    }
  };

  const getElementBorderColor = (element: string) => {
    switch (element) {
      case 'Fuego': return '#ef4444';
      case 'Tierra': return '#22c55e';
      case 'Aire': return '#38bdf8';
      case 'Agua': return '#818cf8';
      default: return '#64748b';
    }
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Carta_Natal_${chartAnalysis.userData.name.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#060811] border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6 relative overflow-hidden">
      
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RUEDA NATAL GEOMÉTRICA DIBUJADA</span>
            <span>·</span>
            <span className="uppercase">{chartAnalysis.zodiacType}</span>
            <span>·</span>
            <span className="uppercase">{chartAnalysis.userData.houseSystem}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-cosmic text-slate-100">
            Rueda Astrológica Completa
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ascendente anclado a la izquierda ($180^\circ$). Muestra los 12 signos, cúspides de casas, planetas, asteroides y líneas de aspectos.
          </p>
        </div>

        {/* View Toggles & Zoom Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Toggle Asteroids */}
          <button
            onClick={() => setShowAsteroids(!showAsteroids)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-astro transition-colors flex items-center gap-1.5 cursor-pointer ${
              showAsteroids
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            title="Alternar visualización de Asteroides"
          >
            <span>Asteroides</span>
            <span className="text-[10px] opacity-75">{showAsteroids ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Aspect Lines */}
          <button
            onClick={() => setShowAspectLines(!showAspectLines)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-astro transition-colors flex items-center gap-1.5 cursor-pointer ${
              showAspectLines
                ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            title="Alternar Líneas de Aspectos"
          >
            <span>Aspectos</span>
            <span className="text-[10px] opacity-75">{showAspectLines ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Fixed Stars */}
          <button
            onClick={() => setShowFixedStars(!showFixedStars)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-astro transition-colors flex items-center gap-1.5 cursor-pointer ${
              showFixedStars
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            title="Alternar Estrellas Fijas"
          >
            <span>Estrellas</span>
            <span className="text-[10px] opacity-75">{showFixedStars ? 'ON' : 'OFF'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setZoomScale(Math.max(0.75, zoomScale - 0.1))}
              className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Reducir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono-astro text-slate-300 px-1">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
              className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
            title="Descargar Carta en SVG de alta resolución"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Main Wheel View & Selected Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Astrological Chart Wheel */}
        <div className="lg:col-span-8 flex justify-center overflow-hidden">
          <div
            className="relative w-full max-w-[620px] aspect-square flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 35px rgba(5, 7, 18, 0.95))' }}
            >
              {/* Defs for gradients & markers */}
              <defs>
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#080a18" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#04050d" stopOpacity="1" />
                </radialGradient>
              </defs>

              {/* Outer boundary circle */}
              <circle
                cx={center}
                cy={center}
                r={rOuter}
                fill="#03040a"
                stroke="#1a2035"
                strokeWidth="2"
              />

              {/* 12 Zodiac Segments (Arc bands between rZodiacInner and rZodiacOuter) */}
              {ZODIAC_SIGNS.map((sign, index) => {
                const signStartDeg = sign.startDegree;
                const signEndDeg = signStartDeg + 30;
                const signMidDeg = signStartDeg + 15;

                // Path for 30 deg sector
                const pStartOuter = getCanvasCoords(signStartDeg, rZodiacOuter);
                const pEndOuter = getCanvasCoords(signEndDeg, rZodiacOuter);
                const pEndInner = getCanvasCoords(signEndDeg, rZodiacInner);
                const pStartInner = getCanvasCoords(signStartDeg, rZodiacInner);

                const pLabel = getCanvasCoords(signMidDeg, (rZodiacOuter + rZodiacInner) / 2);

                const dSector = [
                  `M ${pStartOuter.x} ${pStartOuter.y}`,
                  `A ${rZodiacOuter} ${rZodiacOuter} 0 0 0 ${pEndOuter.x} ${pEndOuter.y}`,
                  `L ${pEndInner.x} ${pEndInner.y}`,
                  `A ${rZodiacInner} ${rZodiacInner} 0 0 1 ${pStartInner.x} ${pStartInner.y}`,
                  'Z',
                ].join(' ');

                return (
                  <g key={sign.name} className="group">
                    <path
                      d={dSector}
                      fill={getElementBgColor(sign.element)}
                      stroke={getElementBorderColor(sign.element)}
                      strokeWidth="0.8"
                      strokeOpacity="0.45"
                      className="transition-all hover:opacity-90 cursor-pointer"
                    />

                    {/* Degree ticks inside zodiac segment (5 deg and 10 deg) */}
                    {[5, 10, 15, 20, 25].map((tick) => {
                      const ptOuter = getCanvasCoords(signStartDeg + tick, rZodiacOuter);
                      const ptInner = getCanvasCoords(signStartDeg + tick, rZodiacOuter - 6);
                      return (
                        <line
                          key={tick}
                          x1={ptOuter.x}
                          y1={ptOuter.y}
                          x2={ptInner.x}
                          y2={ptInner.y}
                          stroke="#475569"
                          strokeWidth="0.5"
                        />
                      );
                    })}

                    {/* Zodiac Glyph */}
                    <text
                      x={pLabel.x}
                      y={pLabel.y}
                      fill="#f1f5f9"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none drop-shadow"
                    >
                      {sign.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Zodiac Inner boundary ring */}
              <circle
                cx={center}
                cy={center}
                r={rZodiacInner}
                fill="none"
                stroke="#2a324d"
                strokeWidth="1.5"
              />

              {/* House Sectors & Cusp Lines */}
              {chartAnalysis.houses.map((house, hIdx) => {
                const cuspCoords = getCanvasCoords(house.degree, rZodiacInner);
                const innerCoords = getCanvasCoords(house.degree, rHouseInner);

                // House Axis Highlighting for ASC (H1) and MC (H10)
                const isAsc = house.number === 1;
                const isMc = house.number === 10;
                const isDsc = house.number === 7;
                const isIc = house.number === 4;

                const lineStroke = isAsc || isDsc
                  ? '#38bdf8' // Cyan for Horizon
                  : isMc || isIc
                  ? '#eab308' // Gold for Meridian
                  : '#2d3748'; // Subtle slate for intermediate cusps
                const lineWidth = isAsc || isMc ? '2' : isDsc || isIc ? '1.5' : '0.8';

                // Next cusp degree for center label calculation
                const nextCusp = chartAnalysis.houses[(hIdx + 1) % 12].degree;
                let houseMidDeg = house.degree + (nextCusp >= house.degree ? (nextCusp - house.degree) / 2 : (nextCusp + 360 - house.degree) / 2);
                const houseNumPos = getCanvasCoords(houseMidDeg, (rHouseInner + rPlanetRing) / 2 - 12);

                return (
                  <g key={`house-${house.number}`}>
                    {/* Cusp line from center hub to zodiac inner border */}
                    <line
                      x1={innerCoords.x}
                      y1={innerCoords.y}
                      x2={cuspCoords.x}
                      y2={cuspCoords.y}
                      stroke={lineStroke}
                      strokeWidth={lineWidth}
                    />

                    {/* House Number in center */}
                    {showHouseNumbers && (
                      <text
                        x={houseNumPos.x}
                        y={houseNumPos.y}
                        fill="#64748b"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="select-none pointer-events-none"
                      >
                        {house.number}
                      </text>
                    )}

                    {/* Cardinal Labels: ASC, MC, DSC, IC */}
                    {isAsc && (
                      <text
                        x={cuspCoords.x + 22}
                        y={cuspCoords.y}
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        ASC
                      </text>
                    )}
                    {isMc && (
                      <text
                        x={cuspCoords.x}
                        y={cuspCoords.y - 12}
                        fill="#eab308"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        MC
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Aspect Lines inside center circle */}
              {showAspectLines && (
                <g className="aspect-lines-layer">
                  {chartAnalysis.aspects.map((asp, idx) => {
                    const p1 = getCanvasCoords(asp.body1.eclipticDegree, rHouseInner - 8);
                    const p2 = getCanvasCoords(asp.body2.eclipticDegree, rHouseInner - 8);

                    let strokeColor = '#94a3b8';
                    let dashArray = 'none';

                    switch (asp.type) {
                      case 'Trígono':
                        strokeColor = '#10b981'; // Emerald
                        break;
                      case 'Sextil':
                        strokeColor = '#06b6d4'; // Cyan
                        dashArray = '3 3';
                        break;
                      case 'Cuadratura':
                        strokeColor = '#f43f5e'; // Red
                        break;
                      case 'Oposición':
                        strokeColor = '#e11d48'; // Crimson
                        break;
                      case 'Conjunción':
                        strokeColor = '#f59e0b'; // Gold
                        break;
                      case 'Quincuncio':
                        strokeColor = '#a855f7'; // Purple
                        dashArray = '2 2';
                        break;
                    }

                    return (
                      <line
                        key={`aspect-${idx}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={strokeColor}
                        strokeWidth={asp.isExact ? '1.5' : '0.8'}
                        strokeOpacity={asp.isExact ? 0.85 : 0.5}
                        strokeDasharray={dashArray}
                        className="transition-all hover:stroke-width-2 cursor-pointer"
                      />
                    );
                  })}
                </g>
              )}

              {/* Central disk */}
              <circle
                cx={center}
                cy={center}
                r={rHouseInner}
                fill="none"
                stroke="#1e2438"
                strokeWidth="1"
              />
              <circle
                cx={center}
                cy={center}
                r={rCenterHub}
                fill="url(#centerGradient)"
                stroke="#2a324d"
                strokeWidth="1"
              />

              {/* Center Mandala Glyph */}
              <text
                x={center}
                y={center - 4}
                fill="#f59e0b"
                fontSize="18"
                fontFamily="var(--font-cinzel)"
                textAnchor="middle"
                dominantBaseline="central"
              >
                ✨
              </text>
              <text
                x={center}
                y={center + 14}
                fill="#64748b"
                fontSize="8"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                dominantBaseline="central"
              >
                AKASHA
              </text>

              {/* Fixed Stars on the Wheel */}
              {showFixedStars && FIXED_STARS.slice(0, 8).map((star) => {
                const coords = getCanvasCoords(star.longitudeJ2000, rZodiacInner - 8);
                return (
                  <g key={star.id} className="cursor-pointer group">
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={3}
                      fill="#fef08a"
                      opacity={0.8}
                    />
                    <text
                      x={coords.x}
                      y={coords.y - 7}
                      fill="#fde047"
                      fontSize="7"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow"
                    >
                      {star.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Planetary & Asteroid Points on the Wheel */}
              {bodiesToRender.map((body, bIdx) => {
                // Stagger overlapping planets by adjusting radius slightly
                const rOffset = (bIdx % 2 === 0) ? 0 : (bIdx % 4 === 1) ? 14 : -14;
                const pos = getCanvasCoords(body.eclipticDegree, rPlanetRing + rOffset);
                const isSelected = selectedPoint?.name === body.name;

                return (
                  <g
                    key={body.name}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedPoint(body);
                      if (onSelectBody) onSelectBody(body);
                      soundEngine.playSingingBowlChime(432 + body.house * 15);
                    }}
                  >
                    {/* Planet selection ring */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={13}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Planet node background */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={body.isAsteroid ? 7.5 : 9}
                      fill={body.isAsteroid ? '#1e1b4b' : '#0f172a'}
                      stroke={body.isAsteroid ? '#a855f7' : '#38bdf8'}
                      strokeWidth="1.2"
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Planet glyph */}
                    <text
                      x={pos.x}
                      y={pos.y}
                      fill={body.isAsteroid ? '#e9d5ff' : '#f8fafc'}
                      fontSize={body.isAsteroid ? '9' : '11'}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none"
                    >
                      {body.symbol}
                    </text>

                    {/* Planet degrees label on hover/selected */}
                    <text
                      x={pos.x}
                      y={pos.y - 14}
                      fill={isSelected ? '#fef08a' : '#cbd5e1'}
                      fontSize="8"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      className="drop-shadow pointer-events-none"
                    >
                      {Math.floor(body.signDegree)}° {body.sign.slice(0, 3)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Planet / Point Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPoint ? (
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-amber-300 bg-slate-900 border border-slate-800 p-2.5 rounded-xl font-bold">
                    {selectedPoint.symbol}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono-astro text-slate-400">
                      {selectedPoint.isAsteroid ? 'Asteroide / Centauro' : 'Punto Planetario'}
                    </span>
                    <h4 className="text-base font-bold font-serif-cosmic text-slate-100">
                      {selectedPoint.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono-astro text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                    Casa {selectedPoint.house}
                  </span>
                </div>
              </div>

              {/* Astrological coordinates */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-astro text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div>Signo: <strong className="text-slate-100">{selectedPoint.sign}</strong></div>
                <div>Grado: <strong className="text-slate-100">{selectedPoint.signDegree}°</strong></div>
                <div>Longitud Eclíptica: <strong className="text-slate-100">{selectedPoint.eclipticDegree.toFixed(2)}°</strong></div>
                <div>Casa: <strong className="text-slate-100">Casa {selectedPoint.house}</strong></div>
              </div>

              {/* Aspects of this selected point */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono-astro uppercase text-slate-400 tracking-wider block">
                  Aspectos con otros puntos:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {chartAnalysis.aspects
                    .filter(
                      (a) =>
                        a.body1.name === selectedPoint.name ||
                        a.body2.name === selectedPoint.name
                    )
                    .map((asp) => {
                      const other =
                        asp.body1.name === selectedPoint.name ? asp.body2 : asp.body1;
                      return (
                        <div
                          key={asp.id}
                          className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800/80 text-[11px]"
                        >
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <span className="font-bold text-amber-400">{asp.symbol}</span>
                            <span>{asp.type} a {other.name} ({other.symbol})</span>
                          </span>
                          <span className="font-mono-astro text-slate-400 text-[10px]">
                            {asp.orb}° orbe
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Esoteric note */}
              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed italic">
                {selectedPoint.house === 12
                  ? `Al estar ubicado en la Casa XII, la energía de ${selectedPoint.name} conecta directamente con los contratos de vidas pasadas y la disolución del karma.`
                  : `La energía de ${selectedPoint.name} se proyecta en la Casa ${selectedPoint.house}, actuando como vector de manifestación en el plano material.`}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Haz clic en cualquier punto de la rueda para examinar sus coordenadas y aspectos.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
