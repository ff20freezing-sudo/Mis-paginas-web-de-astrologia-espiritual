import React, { useState } from 'react';
import { BirthChartData, AkashicChartAnalysis } from '../types/akashic';
import { calculateAkashicChart } from '../utils/astrologyEngine';
import { soundEngine } from '../utils/audioSynthesis';
import { AstrologicalWheel } from './AstrologicalWheel';
import { 
  Compass, 
  Sparkles, 
  Moon, 
  Sun, 
  Star, 
  Send, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Flame,
  Globe2
} from 'lucide-react';

interface BirthChartCalculatorProps {
  onChartCalculated: (analysis: AkashicChartAnalysis) => void;
  chartAnalysis: AkashicChartAnalysis | null;
}

const CITY_PRESETS = [
  { name: 'Madrid, España', lat: 40.4168, lng: -3.7038, tz: 1 },
  { name: 'Barcelona, España', lat: 41.3879, lng: 2.1699, tz: 1 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, tz: -3 },
  { name: 'Ciudad de México, México', lat: 19.4326, lng: -99.1332, tz: -6 },
  { name: 'Bogotá, Colombia', lat: 4.711, lng: -74.0721, tz: -5 },
  { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693, tz: -4 },
  { name: 'Lima, Perú', lat: -12.0464, lng: -77.0428, tz: -5 },
  { name: 'Caracas, Venezuela', lat: 10.4806, lng: -66.9036, tz: -4 },
  { name: 'Nueva York, EE.UU.', lat: 40.7128, lng: -74.006, tz: -5 },
  { name: 'Los Ángeles, EE.UU.', lat: 34.0522, lng: -118.2437, tz: -8 },
  { name: 'Personalizado', lat: 0, lng: 0, tz: 0 },
];

export const BirthChartCalculator: React.FC<BirthChartCalculatorProps> = ({
  onChartCalculated,
  chartAnalysis,
}) => {
  const [formData, setFormData] = useState<BirthChartData>({
    name: 'Buscador Estelar',
    birthDate: '1995-07-21',
    birthTime: '14:30',
    birthPlace: 'Madrid, España',
    latitude: 40.4168,
    longitude: -3.7038,
    timezone: 1,
    houseSystem: 'placidus',
    zodiacType: 'tropical',
    timePrecision: 'exact',
    investigationFocus: 'holistic',
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'stars' | 'karma' | 'monad' | 'astronomy_vs_spirit' | 'oracle'
  >('overview');

  // Oracle AI state
  const [userQuestion, setUserQuestion] = useState('');
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [isLoadingOracle, setIsLoadingOracle] = useState(false);

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CITY_PRESETS.find((c) => c.name === e.target.value);
    if (selected && selected.name !== 'Personalizado') {
      setFormData((prev) => ({
        ...prev,
        birthPlace: selected.name,
        latitude: selected.lat,
        longitude: selected.lng,
        timezone: selected.tz,
      }));
    } else {
      setFormData((prev) => ({ ...prev, birthPlace: 'Ubicación personalizada' }));
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSingingBowlChime(432);
    const analysis = calculateAkashicChart(formData);
    onChartCalculated(analysis);
  };

  const handleAskOracle = async (mode: 'full_reading' | 'ask_records' = 'ask_records') => {
    if (!chartAnalysis) return;
    setIsLoadingOracle(true);
    setOracleResponse(null);

    try {
      const response = await fetch('/api/akashic-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          sunSign: chartAnalysis.planets.find((p) => p.name === 'Sol')?.sign,
          moonSign: chartAnalysis.planets.find((p) => p.name === 'Luna')?.sign,
          ascendantSign: chartAnalysis.ascendant.sign,
          twelfthHouseSign: chartAnalysis.twelfthHouse.sign,
          fixedStarConjunctions: chartAnalysis.fixedStarAspects.map((a) => ({
            starName: a.star.name,
            planet: a.planet.name,
            orb: a.orbDegrees,
          })),
          starseedResonances: chartAnalysis.starseedAffinities.slice(0, 3),
          monadRay: chartAnalysis.monadRay.name,
          userQuestion: userQuestion || 'Revela el propósito primordial de mi alma en esta encarnación.',
          mode,
        }),
      });

      const data = await response.json();
      setOracleResponse(data.interpretation || 'No se pudo recibir respuesta del oráculo.');
      soundEngine.playSingingBowlChime(528);
    } catch (err) {
      console.error('Error fetching akashic reading:', err);
      setOracleResponse('Error al conectar con el oráculo. Por favor, reintenta en unos instantes.');
    } finally {
      setIsLoadingOracle(false);
    }
  };

  return (
    <div id="calculator-section" className="space-y-8">
      
      {/* Introduction Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-[#070914] to-[#04050a] border border-amber-500/30 p-6 sm:p-8 lg:p-10 cosmic-glow-gold overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTAL DE CÁLCULO AKÁSHICO & ESTELAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-cosmic text-amber-100 tracking-wide">
            Atlas Akáshico — Origen Estelar
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Calcula la resonancia de tu carta natal con las grandes familias estelares (Sirio, Pléyades, Arcturus, Vega, Orión, Andrómeda), decodifica el karma de tu Casa XII y descubre el Rayo de tu Mónada, distinguiendo con honestidad los cálculos astronómicos de las interpretaciones espirituales.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-serif-cosmic text-slate-100">
              Datos de Nacimiento para la Carta Simbólica
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-astro hidden sm:inline">
            Cálculo instantáneo & local
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Name / Alias */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Nombre o Alias del Alma
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Ej: Buscador Estelar"
              required
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
              required
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Hora de Nacimiento (Local)
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
              required
            />
          </div>

          {/* City Presets */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Ciudad de Nacimiento
            </label>
            <div className="relative">
              <select
                value={formData.birthPlace}
                onChange={handleCitySelect}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
              >
                {CITY_PRESETS.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <Globe2 className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Time Precision */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Precisión de la Hora
            </label>
            <select
              value={formData.timePrecision}
              onChange={(e) => setFormData({ ...formData, timePrecision: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            >
              <option value="exact">Exacta (Partida o certificado de nacimiento)</option>
              <option value="approximate">Aproximada (Recuerdo familiar ±15-30 min)</option>
              <option value="rectified">Rectificada (Por eventos biográficos)</option>
              <option value="unknown">Desconocida (Carta Solar / 12:00 m)</option>
            </select>
          </div>

          {/* Investigation Focus */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Tema Principal de Investigación
            </label>
            <select
              value={formData.investigationFocus}
              onChange={(e) => setFormData({ ...formData, investigationFocus: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            >
              <option value="holistic">Síntesis Holística & Misión de Alma</option>
              <option value="karma">Casa XII, Karma & Vidas Pasadas</option>
              <option value="starseed">Linajes Starseed & Estrellas Fijas</option>
              <option value="monad">Mónada Espiritual & 7 Rayos</option>
              <option value="asteroids_healing">Asteroides Arquetípicos & Quirón</option>
            </select>
          </div>

          {/* Zodiac Type */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Zodiaco
            </label>
            <select
              value={formData.zodiacType}
              onChange={(e) => setFormData({ ...formData, zodiacType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-amber-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer font-mono-astro"
            >
              <option value="tropical">Tropical (Occidental - Signos estacionales)</option>
              <option value="sidereal">Sideral (Ayanamsha Lahiri - Constelaciones)</option>
            </select>
          </div>

          {/* House System */}
          <div>
            <label className="block text-xs font-mono-astro text-slate-300 mb-1.5">
              Sistema de Casas
            </label>
            <select
              value={formData.houseSystem}
              onChange={(e) => setFormData({ ...formData, houseSystem: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-amber-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer font-mono-astro"
            >
              <option value="placidus">Placidus (Cúspides temporales por cuadrantes)</option>
              <option value="koch">Koch (GPH de Nacimiento)</option>
              <option value="wholesign">Signo Entero (Whole Sign - Helenístico)</option>
              <option value="equal">Casas Iguales (Sectores de 30° desde ASC)</option>
            </select>
          </div>

          {/* Lat / Long / Timezone fine-tuning */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono-astro text-slate-400 mb-1">
                Latitud (° N/S)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 font-mono-astro"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono-astro text-slate-400 mb-1">
                Longitud (° E/W)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 font-mono-astro"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono-astro text-slate-400 mb-1">
                Huso Horario (UTC)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950/70 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 font-mono-astro"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-end pt-1">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-serif-cosmic tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Dibujar Carta & Calcular Atlas</span>
            </button>
          </div>

        </form>
      </div>

      {/* Analysis Results Display */}
      {chartAnalysis && (
        <div className="space-y-8 animate-fadeIn">

          {/* Graphical Astrological Wheel Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
            <AstrologicalWheel chartAnalysis={chartAnalysis} />
          </div>
          
          {/* Result Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
            {[
              { id: 'overview', label: '1. Síntesis & Origen', icon: Compass },
              { id: 'stars', label: '2. Estrellas Fijas & Aspectos', icon: Star },
              { id: 'karma', label: '3. Casa XII & Vidas Pasadas', icon: Moon },
              { id: 'monad', label: '4. Rayo de la Mónada', icon: Sun },
              { id: 'astronomy_vs_spirit', label: '5. Astronomía vs. Esoterismo', icon: Globe2 },
              { id: 'oracle', label: '6. Canalización & Oráculo', icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Banner Summary */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-mono-astro text-amber-400">
                      CONSULTANTE: {chartAnalysis.userData.name}
                    </span>
                    <h3 className="text-xl font-bold font-serif-cosmic text-slate-100 mt-0.5">
                      Firma Energética del Alma
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400 font-mono-astro">
                    {chartAnalysis.userData.birthDate} · {chartAnalysis.userData.birthTime} · {chartAnalysis.userData.birthPlace}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{chartAnalysis.soulMissionSummary}"
                </p>
              </div>

              {/* Core Astrological & Esoteric Coordinates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Sol (Esencia)', planet: chartAnalysis.planets.find(p => p.name === 'Sol') },
                  { label: 'Luna (Alma)', planet: chartAnalysis.planets.find(p => p.name === 'Luna') },
                  { label: 'Ascendente (Camino)', planet: chartAnalysis.ascendant },
                  { label: 'Medio Cielo (Vocación)', planet: chartAnalysis.midheaven },
                  { label: 'Casa XII (Karma)', planet: { sign: chartAnalysis.twelfthHouse.sign, signDegree: '' } as any },
                  { label: 'Nodo Norte (Misión)', planet: chartAnalysis.northNode },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] font-mono-astro text-slate-400 block mb-1">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-amber-200">
                        {item.planet?.sign}
                      </span>
                    </div>
                    {item.planet?.signDegree !== undefined && item.planet?.signDegree !== '' && (
                      <span className="text-[11px] text-slate-500 font-mono-astro">
                        {item.planet.signDegree}°
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Starseed Resonances Ranking */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold font-serif-cosmic text-slate-200 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Afinidad y Resonancia con Linajes Starseed</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono-astro">
                    Ponderación sobre posiciones natales y Casas
                  </span>
                </div>

                <div className="space-y-3">
                  {chartAnalysis.starseedAffinities.map((item, idx) => (
                    <div key={item.lineage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200 flex items-center gap-1.5">
                          <span className="font-mono-astro text-slate-500">{idx + 1}.</span>
                          <span>{item.lineage}</span>
                        </span>
                        <span className="font-mono-astro text-amber-300 font-semibold">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        {item.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asteroids & Centaurs Summary in Chart */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold font-serif-cosmic text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Asteroides & Centauros en tu Carta ({chartAnalysis.asteroids.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono-astro">
                    {chartAnalysis.zodiacType === 'sidereal' ? 'Posiciones Siderales' : 'Posiciones Tropicales'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {chartAnalysis.asteroids.map((ast) => (
                    <div key={ast.name} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-300 font-bold">{ast.symbol} {ast.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono-astro">C{ast.house}</span>
                      </div>
                      <span className="text-[11px] text-slate-300 font-mono-astro block mt-0.5">
                        {ast.signDegree}° {ast.sign}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FIXED STARS */}
          {activeTab === 'stars' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h3 className="text-base font-bold font-serif-cosmic text-slate-100">
                    Alineaciones con Estrellas Fijas (Precesión Corregida)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Se computa la precesión astronómica (~50.29"/año) desde la época J2000 hasta el año de nacimiento. Orbe máximo de conjunción: 2.5°.
                  </p>
                </div>
                <div className="text-xs font-mono-astro text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-md">
                  {chartAnalysis.fixedStarAspects.length} contactos detectados
                </div>
              </div>

              {chartAnalysis.fixedStarAspects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chartAnalysis.fixedStarAspects.map((asp, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono-astro">
                            <span>{asp.aspectType}</span>
                            <span>·</span>
                            <span>{asp.planet.name} & {asp.star.name}</span>
                          </div>
                          <h4 className="text-sm font-bold font-serif-cosmic text-slate-100 mt-0.5">
                            {asp.star.traditionalName}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className={`text-[11px] font-mono-astro px-2 py-0.5 rounded ${
                            asp.isExact 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            Orbe: {asp.orbDegrees}° {asp.isExact && '★ Exacto'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-3 text-xs">
                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                          <span className="font-mono-astro text-sky-400 text-[11px] block mb-0.5">
                            Rigor Astronómico:
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {asp.astronomicalNote}
                          </p>
                        </div>
                        <div className="bg-indigo-950/30 p-2.5 rounded border border-indigo-500/20">
                          <span className="font-mono-astro text-amber-300 text-[11px] block mb-0.5">
                            Significado Esotérico & Starseed:
                          </span>
                          <p className="text-slate-200 text-[11px] leading-relaxed">
                            {asp.esotericInterpretation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                  <p className="mb-2">
                    No se encontraron conjunciones directas menores a 2.5° de orbe en tus posiciones principales con las 12 estrellas mayores del catálogo.
                  </p>
                  <p className="text-slate-500">
                    Esto no disminuye tu afinidad estelar: tu resonancia se manifiesta a través de los armónicos de tu Casa XII ({chartAnalysis.twelfthHouse.sign}) y el Rayo de tu Mónada.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KARMA & HOUSE XII */}
          {activeTab === 'karma' && (
            <div className="space-y-6">
              
              {/* House XII Header Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 text-xs font-mono-astro text-purple-400 mb-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>EL VELO DEL INCONSCIENTE & MEMORIA DE VIDAS PASADAS</span>
                </div>
                <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
                  Casa XII en {chartAnalysis.twelfthHouse.sign} (Regente: {chartAnalysis.twelfthHouse.ruler})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  La Casa XII representa la clausura del ciclo, los votos de encarnaciones previas y la sabiduría que traes oculta en el tejido del Akasha.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <span className="font-mono-astro text-rose-400 font-medium block mb-1">
                      1. La Herida y Sombra Inconsciente:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {chartAnalysis.twelfthHouse.unconsciousShadow}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-slate-400 italic text-[11px]">
                      Patrón de vidas pasadas: {chartAnalysis.twelfthHouse.pastLifePattern}
                    </div>
                  </div>

                  <div className="bg-indigo-950/30 p-4 rounded-lg border border-indigo-500/30">
                    <span className="font-mono-astro text-amber-300 font-medium block mb-1">
                      2. El Don Redimido del Alma:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {chartAnalysis.twelfthHouse.redeemedGift}
                    </p>
                    <div className="mt-3 pt-2 border-t border-indigo-500/20 text-slate-300 text-[11px]">
                      Clave de Integración: {chartAnalysis.twelfthHouse.spiritualIntegration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Planets in House XII */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h4 className="text-xs font-mono-astro uppercase text-slate-400 tracking-wider mb-3">
                  Planetas en Casa XII ({chartAnalysis.twelfthHousePlanets.length})
                </h4>
                {chartAnalysis.twelfthHousePlanets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chartAnalysis.twelfthHousePlanets.map((p) => (
                      <div key={p.name} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <span className="text-amber-300 font-bold block mb-1">
                          {p.name} {p.symbol} en {p.sign} ({p.signDegree}°)
                        </span>
                        <p className="text-slate-300 text-[11px]">
                          La energía de {p.name} actúa como un puente directo al inconsciente y requiere ser consagrada al servicio desinteresado para manifestar su mayor bendición.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No hay planetas ocupando la Casa XII; la interpretación se fundamenta puramente en el signo de la cúspide ({chartAnalysis.twelfthHouse.sign}) y su regente esotérico ({chartAnalysis.twelfthHouse.ruler}).
                  </p>
                )}
              </div>

              {/* Nodal Axis: South Node to North Node */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>EJE NODAL KÁRMICO: DE LA MEMORIA AL PROPÓSITO</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-mono-astro block mb-1">
                      Nodo Sur (Ketu) en {chartAnalysis.southNode.sign}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Representa tu zona de confort kármica, los talentos que traes innatos pero que si repites en exceso te atrapan en inercias del pasado.
                    </p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-amber-500/30">
                    <span className="text-amber-300 font-mono-astro block mb-1">
                      Nodo Norte (Rahu) en {chartAnalysis.northNode.sign}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Tu norte evolutivo en esta encarnación. Es el terreno desconocido que te reta a crecer y expandir la conciencia hacia nuevos horizontes espirituales.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: MONAD & 7 RAYS */}
          {activeTab === 'monad' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
                    <Sun className="w-3.5 h-3.5" />
                    <span>COSMOLOGÍA DE LA MÓNADA & ASTROLOGÍA ESOTÉRICA</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif-cosmic text-amber-100">
                    {chartAnalysis.monadRay.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    {chartAnalysis.monadRay.aspect}
                  </p>
                </div>
                <span className="text-xs font-mono-astro text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1 rounded">
                  Regente Esotérico: {chartAnalysis.monadRay.planetaryRulerEsoteric}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="font-mono-astro text-amber-300 block mb-2">
                    Cualidad Primordial & Virtudes Superiores:
                  </span>
                  <p className="text-slate-300 leading-relaxed mb-3">
                    {chartAnalysis.monadRay.primaryQuality}
                  </p>
                  <ul className="space-y-1.5 text-slate-400">
                    {chartAnalysis.monadRay.specialVirtues.map((v, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="font-mono-astro text-rose-400 block mb-2">
                    Vicios a Transmutar en la Tierra:
                  </span>
                  <ul className="space-y-1.5 text-slate-400 mb-4">
                    {chartAnalysis.monadRay.vicesToTransmute.map((v, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="font-mono-astro text-indigo-300 block mb-1">
                    Propósito Monádico Supremo:
                  </span>
                  <p className="text-slate-300 italic text-[11px] leading-relaxed">
                    "{chartAnalysis.monadRay.monadicPurpose}"
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: ASTRONOMY VS SPIRITUALITY COMPARISON */}
          {activeTab === 'astronomy_vs_spirit' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
                  Diferenciación: Cálculo Astronómico vs. Simbolismo Espiritual
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  En el Atlas Akáshico respetamos el rigor de la ciencia astronómica. A continuación se desglosa con total transparencia la base empírica observable frente a la dimensión mística y alegórica.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono-astro">
                      <th className="py-2.5 px-3">Elemento</th>
                      <th className="py-2.5 px-3 text-sky-300">Cálculo Astronómico Observable</th>
                      <th className="py-2.5 px-3 text-amber-300">Interpretación Esotérica / Starseed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-200">Precesión de los Equinoccios</td>
                      <td className="py-3 px-3 text-slate-400">
                        Desplazamiento real del eje terrestre (~50.29 arcosegundos por año o 1° cada ~71.6 años). Cambia la posición aparente de las estrellas fijas en la eclíptica.
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        Transición de eras cósmicas (Era de Piscis a Acuario) y evolución cíclica de la conciencia humana.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-200">Estrellas Fijas (Sirio, Pléyades, etc.)</td>
                      <td className="py-3 px-3 text-slate-400">
                        Cuerpos celestes distantes a años luz (Sirio: 8.6 a.l.; Pléyades: ~440 a.l.; Arcturus: 36.7 a.l.) con magnitudes, espectros y masas medibles.
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        Faros arquetípicos de civilizaciones estelares, memorias de almas (Starseed) y puntos de anclaje de sabiduría galáctica.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-200">Casa XII & Nodos Lunares</td>
                      <td className="py-3 px-3 text-slate-400">
                        Puntos matemáticos de intersección orbital (Nodos: órbita de la Luna con la eclíptica solar) y partición de la esfera celeste según la rotación diurna.
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        El inconsciente kármico, deudas y dones de vidas pasadas (Nodo Sur) y el vector evolutivo del alma (Nodo Norte).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-200">Mónada & 7 Rayos</td>
                      <td className="py-3 px-3 text-slate-400">
                        Sin correlación astronómica empírica. Es un marco metafísico y teosófico.
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        Cosmología esotérica de Alice Bailey que describe los 7 aspectos de la manifestación divina y el Yo Superior.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Nota ética de integridad:</span> Esta aplicación no pretende confirmar científicamente la existencia empírica de vidas pasadas ni orígenes extraterrestres biológicos. Ofrece una herramienta de introspección psicológica, arquetípica y simbólica para el autoconocimiento y la expansión espiritual.
              </div>
            </div>
          )}

          {/* TAB 6: ORACLE & CHANNELING */}
          {activeTab === 'oracle' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>CONSULTA AL ORÁCULO AKÁSHICO (IA / SINTETIZADOR)</span>
                </div>
                <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
                  Canalización del Registro del Alma
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Formula una pregunta o solicita una lectura poética guiada para integrar las frecuencias estelares en tu vida cotidiana.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono-astro text-slate-300">
                  Pregunta a los Registros Akáshicos:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ej: ¿Qué lección kármica vengo a completar en mis relaciones presentes?"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleAskOracle('ask_records')}
                    disabled={isLoadingOracle}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingOracle ? (
                      <span className="animate-spin text-sm">✦</span>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Consultar</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAskOracle('full_reading')}
                    disabled={isLoadingOracle}
                    className="text-xs text-amber-300 hover:text-amber-200 underline font-mono-astro flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generar Lectura Akáshica Completa de la Carta</span>
                  </button>
                </div>
              </div>

              {oracleResponse && (
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-3">
                  <span className="text-[11px] font-mono-astro uppercase text-amber-400 tracking-wider block">
                    Respuesta del Registro Akáshico:
                  </span>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line space-y-2">
                    {oracleResponse}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Print / Export Bar */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">
              ¿Deseas conservar tu informe del Atlas Akáshico?
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-xs font-mono-astro text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
