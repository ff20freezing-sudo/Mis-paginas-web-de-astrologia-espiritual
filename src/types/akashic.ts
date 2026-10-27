export interface FixedStar {
  id: string;
  name: string;
  traditionalName: string;
  constellation: string;
  constellationNameEs: string;
  longitudeJ2000: number; // in degrees along the ecliptic (0-360)
  zodiacSign: string;
  zodiacDegree: string;
  magnitude: number;
  spectralType: string;
  naturePlanetary: string; // e.g. "Júpiter - Marte"
  astronomicalFacts: string; // Astronomical reality
  esotericMeaning: string; // Spiritual / Starseed meaning
  keywords: string[];
  lineage: 'Sirio' | 'Pléyades' | 'Arcturus' | 'Vega/Lira' | 'Orión' | 'Andrómeda' | 'Estrellas Reales' | 'Otras';
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  sign: string;
  signDegree: number; // 0-30
  eclipticDegree: number; // 0-360
  house: number;
  isRetrograde?: boolean;
  isAsteroid?: boolean;
  asteroidNumber?: number;
  civilizationTag?: string;
}

export interface FixedStarAspect {
  star: FixedStar;
  planet: PlanetPosition;
  aspectType: 'Conjunción' | 'Oposición' | 'Trígono' | 'Cuadratura';
  orbDegrees: number; // e.g. 1.25 degrees
  orbMinutes: number;
  isExact: boolean; // orb < 1°
  astronomicalNote: string;
  esotericInterpretation: string;
}

export interface StarseedLineage {
  id: string;
  name: string;
  originStar: string;
  constellation: string;
  archetype: string;
  chakraResonance: string;
  frequencyColor: string;
  description: string;
  missionOnEarth: string;
  spiritualGifts: string[];
  earthlyChallenges: string[];
  physicalSensitivities: string[];
  keySymbols: string[];
}

export interface HouseTwelfthProfile {
  sign: string;
  ruler: string;
  karmicMemory: string;
  unconsciousShadow: string;
  redeemedGift: string;
  pastLifePattern: string;
  spiritualIntegration: string;
}

export interface MonadRay {
  rayNumber: number;
  name: string;
  aspect: string;
  color: string;
  planetaryRulerEsoteric: string;
  primaryQuality: string;
  specialVirtues: string[];
  vicesToTransmute: string[];
  earthlyManifestation: string;
  monadicPurpose: string;
}

export interface DreamSymbol {
  symbol: string;
  element: string;
  akashicMeaning: string;
  karmicSignificance: string;
  integrationAdvice: string;
}

export interface AkashicJournalEntry {
  id: string;
  date: string;
  title: string;
  category: 'meditacion' | 'sueno' | 'sincronia' | 'canalizacion' | 'sanacion';
  content: string;
  frequencyHz?: number;
  tags: string[];
}

export interface AsteroidDefinition {
  id: string;
  name: string;
  officialNumber?: number;
  symbol: string;
  astronomicalCategory: 'Asteroide del Cinturón Principal' | 'Centauro' | 'Luna Negra' | 'Civilización Ancestral';
  diameterKm: string;
  discoveryYear: number;
  orbitalPeriodYears: string;
  archetype: string;
  mythologicalStory: string;
  astronomicalFacts: string;
  karmicSignificance: string;
  psychologicalFunction: string;
  houseMeaningKeywords: string[];
  civilization?: 'Egipto Antiguo' | 'Atlántida' | 'Sudamérica Ancestral' | 'Grecorromana';
}

export interface AncientAsteroidDefinition {
  id: string;
  name: string;
  officialNumber: number; // MPC/NASA JPL Catalog number (e.g. 1198 Atlantis, 42 Isis, 1923 Osiris, 5249 Giza, 896 Sphinx, 8275 Inca, 8277 Machu-Picchu, 1915 Quetzalcoatl)
  symbol: string;
  civilization: 'Egipto Antiguo' | 'Atlántida' | 'Sudamérica Ancestral';
  diameterKm: string;
  discoveryYear: number;
  orbitalPeriodYears: string;
  semiMajorAxisAU: number;
  historicalArchetype: string;
  archaeoastronomyContext: string;
  astronomicalFact: string;
  karmicMemory: string;
  akashicFrequency: string;
}

export interface SpiritualDnaStrand {
  strandNumber: number; // 1 to 12
  name: string;
  dimension: string; // '3D Física' | '4D Emocional/Astral' | '5D Monádica/Cristalina' | '6D Conciencia Galáctica'
  chakraBridge: string;
  activationFrequencyHz: number;
  karmicSeal: string; // The seal to be transmuted (epigenética espiritual)
  spiritualActivation: string;
  associatedBodies: string[];
  fixedStarAnchor: string;
  status: 'dormido' | 'en_transmutacion' | 'activo';
}

export type AspectType =
  | 'Conjunción'
  | 'Sextil'
  | 'Cuadratura'
  | 'Trígono'
  | 'Oposición'
  | 'Quincuncio'
  | 'Semisextil';

export interface ChartAspect {
  id: string;
  body1: PlanetPosition;
  body2: PlanetPosition;
  type: AspectType;
  symbol: string;
  targetAngle: number; // 0, 60, 90, 120, 180, 150, 30
  actualDifference: number;
  orb: number;
  isExact: boolean; // orb < 1.0
  harmonicNature: 'Armónico' | 'Tenso / Kármico' | 'Fusión / Potente' | 'Ajuste';
  interpretation: string;
}

export interface AspectOrbsConfig {
  conjunction: number; // default 8
  sextile: number; // default 4
  square: number; // default 7
  trine: number; // default 7
  opposition: number; // default 8
  quincunx: number; // default 3
}

export interface ManualBodyPosition {
  sign: string;
  degree: number;
  minute: number;
  house: number;
  isCustom: boolean;
}

export interface BirthChartData {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
  houseSystem: 'placidus' | 'koch' | 'equal' | 'wholesign';
  zodiacType: 'tropical' | 'sidereal';
  timePrecision: 'exact' | 'approximate' | 'rectified' | 'unknown';
  investigationFocus: 'karma' | 'starseed' | 'monad' | 'asteroids_healing' | 'holistic';
  manualPositions?: Record<string, ManualBodyPosition>;
}

export interface AkashicChartAnalysis {
  userData: BirthChartData;
  julianDay: number;
  zodiacType: 'tropical' | 'sidereal';
  ayanamshaDeg: number;
  planets: PlanetPosition[];
  asteroids: PlanetPosition[];
  ancientAsteroids: PlanetPosition[];
  allCelestialBodies: PlanetPosition[];
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  northNode: PlanetPosition;
  southNode: PlanetPosition;
  houses: { number: number; sign: string; degree: number }[];
  aspects: ChartAspect[];
  twelfthHouse: HouseTwelfthProfile;
  twelfthHousePlanets: PlanetPosition[];
  twelfthHouseAsteroids: PlanetPosition[];
  fixedStarAspects: FixedStarAspect[];
  starseedAffinities: { lineage: string; score: number; percentage: number; rationale: string }[];
  monadRay: MonadRay;
  spiritualDnaStrands: SpiritualDnaStrand[];
  soulMissionSummary: string;
}
