import {
  BirthChartData,
  AkashicChartAnalysis,
  PlanetPosition,
  FixedStarAspect,
  HouseTwelfthProfile,
  ChartAspect,
  AspectOrbsConfig,
  AspectType,
} from '../types/akashic';
import {
  FIXED_STARS,
  ZODIAC_SIGNS,
  STARSEED_LINEAGES,
  HOUSE_TWELFTH_PROFILES,
  MONAD_RAYS,
  ASTEROIDS_DEFINITIONS,
  DEFAULT_ASPECT_ORBS,
  ANCIENT_ASTEROIDS_DEFINITIONS,
  SPIRITUAL_DNA_STRANDS,
} from '../data/akashicKnowledge';

// Degrees to Radians and vice versa
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

// Normalize degree to 0-360
export const normalize360 = (d: number): number => {
  let val = d % 360;
  if (val < 0) val += 360;
  return val;
};

// Calculate Julian Day from Year, Month, Day, decimal Hour UT
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hourUT: number
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5;
  return JD;
}

// Convert absolute ecliptic degrees (0-360) into Zodiac sign and degree (0-30)
export function getZodiacPosition(degree: number): {
  sign: string;
  signDegree: number;
  formatted: string;
} {
  const norm = normalize360(degree);
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_SIGNS[signIndex % 12].name;
  const signDeg = norm - signIndex * 30;
  const degInt = Math.floor(signDeg);
  const minutes = Math.floor((signDeg - degInt) * 60);

  return {
    sign,
    signDegree: Number(signDeg.toFixed(2)),
    formatted: `${degInt}° ${minutes.toString().padStart(2, '0')}' ${sign}`,
  };
}

// Convert sign name and degree/minute back to absolute 0-360 degrees
export function signAndDegreeToEcliptic(signName: string, deg: number, min: number = 0): number {
  const signIndex = ZODIAC_SIGNS.findIndex((z) => z.name.toLowerCase() === signName.toLowerCase());
  const base = signIndex >= 0 ? signIndex * 30 : 0;
  return normalize360(base + deg + min / 60);
}

// Calculate Aspects between all pairs of celestial bodies
export function calculateAspectsBetweenBodies(
  bodies: PlanetPosition[],
  customOrbs: AspectOrbsConfig = DEFAULT_ASPECT_ORBS
): ChartAspect[] {
  const aspectsFound: ChartAspect[] = [];

  const aspectRules: {
    type: AspectType;
    angle: number;
    symbol: string;
    maxOrb: number;
    nature: 'Armónico' | 'Tenso / Kármico' | 'Fusión / Potente' | 'Ajuste';
  }[] = [
    { type: 'Conjunción', angle: 0, symbol: '☌', maxOrb: customOrbs.conjunction, nature: 'Fusión / Potente' },
    { type: 'Sextil', angle: 60, symbol: '⚹', maxOrb: customOrbs.sextile, nature: 'Armónico' },
    { type: 'Cuadratura', angle: 90, symbol: '□', maxOrb: customOrbs.square, nature: 'Tenso / Kármico' },
    { type: 'Trígono', angle: 120, symbol: '△', maxOrb: customOrbs.trine, nature: 'Armónico' },
    { type: 'Oposición', angle: 180, symbol: '☍', maxOrb: customOrbs.opposition, nature: 'Tenso / Kármico' },
    { type: 'Quincuncio', angle: 150, symbol: '⚻', maxOrb: customOrbs.quincunx, nature: 'Ajuste' },
  ];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];

      let diff = Math.abs(b1.eclipticDegree - b2.eclipticDegree);
      if (diff > 180) diff = 360 - diff;

      for (const rule of aspectRules) {
        // Slightly tighter orb if both are minor bodies/asteroids
        const effectiveOrbLimit = (b1.isAsteroid && b2.isAsteroid)
          ? Math.min(rule.maxOrb, 4.0)
          : rule.maxOrb;

        const orb = Math.abs(diff - rule.angle);

        if (orb <= effectiveOrbLimit) {
          const isExact = orb <= 1.0;
          aspectsFound.push({
            id: `${b1.name}-${rule.type}-${b2.name}`,
            body1: b1,
            body2: b2,
            type: rule.type,
            symbol: rule.symbol,
            targetAngle: rule.angle,
            actualDifference: Number(diff.toFixed(2)),
            orb: Number(orb.toFixed(2)),
            isExact,
            harmonicNature: rule.nature,
            interpretation: generateAspectInterpretation(b1, b2, rule.type),
          });
          break; // Stop at the best matching aspect for this pair
        }
      }
    }
  }

  // Sort by tightness of orb
  return aspectsFound.sort((a, b) => a.orb - b.orb);
}

// Generate esoteric & psychological interpretation for each aspect
function generateAspectInterpretation(b1: PlanetPosition, b2: PlanetPosition, type: AspectType): string {
  const names = `${b1.name} y ${b2.name}`;
  switch (type) {
    case 'Conjunción':
      return `Fusión alquímica entre ${names}. Sus principios se entrelazan de forma inseparable, amplificando mutuamente su potencia y creando un foco de energía concentrada en la Casa ${b1.house}.`;
    case 'Trígono':
      return `Flujo de gracia armónica y dones de vidas pasadas entre ${names}. Facilidad natural para integrar ambas energías sin resistencia del ego.`;
    case 'Sextil':
      return `Oportunidad consciente de colaboración creativa entre ${names}. Despierta talentos que florecen cuando se aplican con intención y estudio.`;
    case 'Cuadratura':
      return `Tensión kármica constructiva y catalizadora entre ${names}. Genera fricción interna que obliga al alma a madurar y superar viejos patrones de resistencia.`;
    case 'Oposición':
      return `Espejo de polaridad entre ${names}. Requiere conciliar dos polos aparentemente contrarios, proyectados con frecuencia en las relaciones con los demás.`;
    case 'Quincuncio':
      return `Ajuste kármico sutil e incómodo entre ${names}. Obliga a reorganizar prioridades psicológicas y refinar la percepción para evitar la dispersión.`;
    default:
      return `Aspecto activo entre ${names} modulando la carta natal.`;
  }
}

// Main calculation engine
export function calculateAkashicChart(data: BirthChartData): AkashicChartAnalysis {
  const [yearStr, monthStr, dayStr] = data.birthDate.split('-');
  const [hourStr, minStr] = data.birthTime.split(':');

  const year = parseInt(yearStr, 10) || 1990;
  const month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;
  const localHour = (parseInt(hourStr, 10) || 12) + (parseInt(minStr, 10) || 0) / 60;
  const hourUT = localHour - data.timezone;

  const jd = calculateJulianDay(year, month, day, hourUT);
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
  const d = jd - 2451543.5; // Days since epoch

  // Calculate Ayanamsha for Sidereal Zodiac (Chitra-Paksha / Lahiri)
  // ~23.85° at J2000.0 + ~50.29"/year
  const ayanamshaDeg = 23.85 + (year - 2000 + (month - 1) / 12) * (50.29 / 3600);
  const isSidereal = data.zodiacType === 'sidereal';

  const adjustZodiac = (deg: number): number => {
    let result = deg;
    if (isSidereal) {
      result -= ayanamshaDeg;
    }
    return normalize360(result);
  };

  // 1. Sun Position (Astronomical approximation)
  const L0 = normalize360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M_sun = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C_sun =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRad(M_sun)) +
    (0.019993 - 0.000101 * T) * Math.sin(toRad(2 * M_sun)) +
    0.000289 * Math.sin(toRad(3 * M_sun));
  const sunLon = adjustZodiac(normalize360(L0 + C_sun));

  // 2. Moon Position (Approximation)
  const L_moon = normalize360(218.316 + 13.176396 * d);
  const M_moon = normalize360(134.963 + 13.064993 * d);
  const F_moon = normalize360(93.272 + 13.22935 * d);
  const moonLon = adjustZodiac(
    normalize360(
      L_moon +
        6.289 * Math.sin(toRad(M_moon)) -
        1.274 * Math.sin(toRad(M_moon - 2 * (sunLon - L_moon))) +
        0.658 * Math.sin(toRad(2 * (sunLon - L_moon))) -
        0.214 * Math.sin(toRad(2 * M_moon)) -
        0.11 * Math.sin(toRad(F_moon))
    )
  );

  // 3. Lunar Nodes (Rahu / Ketu)
  const nodeLon = adjustZodiac(normalize360(125.04452 - 1934.136261 * T + 0.0020708 * T * T));
  const southNodeLon = normalize360(nodeLon + 180);

  // 4. Planets approximations based on mean Keplerian orbital periods
  const rawPlanets = [
    { name: 'Sol', symbol: '☉', deg: sunLon },
    { name: 'Luna', symbol: '☽', deg: moonLon },
    { name: 'Mercurio', symbol: '☿', deg: adjustZodiac(normalize360(sunLon + 18 * Math.sin(toRad(d * 4.092)))) },
    { name: 'Venus', symbol: '♀', deg: adjustZodiac(normalize360(sunLon + 43 * Math.sin(toRad(d * 1.602 + 45)))) },
    { name: 'Marte', symbol: '♂', deg: adjustZodiac(normalize360(355.43 + 0.524033 * d + 10.6 * Math.sin(toRad(0.524 * d)))) },
    { name: 'Júpiter', symbol: '♃', deg: adjustZodiac(normalize360(34.35 + 0.083091 * d + 5.5 * Math.sin(toRad(0.083 * d)))) },
    { name: 'Saturno', symbol: '♄', deg: adjustZodiac(normalize360(50.08 + 0.033459 * d + 6.3 * Math.sin(toRad(0.033 * d)))) },
    { name: 'Urano', symbol: '♅', deg: adjustZodiac(normalize360(314.05 + 0.011733 * d)) },
    { name: 'Neptuno', symbol: '♆', deg: adjustZodiac(normalize360(304.35 + 0.005981 * d)) },
    { name: 'Plutón', symbol: '♇', deg: adjustZodiac(normalize360(238.9 + 0.00397 * d)) },
    { name: 'Nodo Norte (Rahu)', symbol: '☊', deg: nodeLon },
    { name: 'Nodo Sur (Ketu)', symbol: '☋', deg: southNodeLon },
  ];

  // 5. Asteroids & Centaurs Orbital Approximations
  // Mean Keplerian anomalies and mean motions
  const rawAsteroids = [
    {
      name: 'Quirón',
      symbol: '⚷',
      deg: adjustZodiac(normalize360(14.8 + 0.01944 * d + 8.2 * Math.sin(toRad(0.01944 * d)))),
    },
    {
      name: 'Ceres',
      symbol: '⚳',
      deg: adjustZodiac(normalize360(153.2 + 0.2141 * d + 9.5 * Math.sin(toRad(0.2141 * d)))),
    },
    {
      name: 'Palas Atenea',
      symbol: '⚴',
      deg: adjustZodiac(normalize360(121.7 + 0.2133 * d + 12.0 * Math.sin(toRad(0.2133 * d)))),
    },
    {
      name: 'Juno',
      symbol: '⚵',
      deg: adjustZodiac(normalize360(41.1 + 0.2260 * d + 11.2 * Math.sin(toRad(0.2260 * d)))),
    },
    {
      name: 'Vesta',
      symbol: '⚶',
      deg: adjustZodiac(normalize360(104.5 + 0.2715 * d + 8.9 * Math.sin(toRad(0.2715 * d)))),
    },
    {
      name: 'Psique',
      symbol: '🝈',
      deg: adjustZodiac(normalize360(208.4 + 0.197 * d + 7.4 * Math.sin(toRad(0.197 * d)))),
    },
    {
      name: 'Eros',
      symbol: '🏹',
      deg: adjustZodiac(normalize360(312.0 + 0.559 * d + 14.1 * Math.sin(toRad(0.559 * d)))),
    },
    {
      name: 'Lilith (Luna Negra)',
      symbol: '⚸',
      deg: adjustZodiac(normalize360(280.0 + 0.1114 * d)),
    },
  ];

  // 5b. Ancient Civilizations Asteroids (Atlantis, Isis, Osiris, Giza, Sphinx, Inca, Machu-Picchu, Quetzalcoatl)
  const rawAncientAsteroids = [
    {
      name: 'Atlantis (1198)',
      symbol: '🏛️',
      officialNumber: 1198,
      deg: adjustZodiac(normalize360(78.5 + 0.292 * d + 6.8 * Math.sin(toRad(0.292 * d)))),
      civ: 'Atlántida',
    },
    {
      name: 'Isis (42)',
      symbol: '𓋹',
      officialNumber: 42,
      deg: adjustZodiac(normalize360(164.2 + 0.258 * d + 7.4 * Math.sin(toRad(0.258 * d)))),
      civ: 'Egipto Antiguo',
    },
    {
      name: 'Osiris (1923)',
      symbol: '𓁀',
      officialNumber: 1923,
      deg: adjustZodiac(normalize360(92.1 + 0.259 * d + 8.1 * Math.sin(toRad(0.259 * d)))),
      civ: 'Egipto Antiguo',
    },
    {
      name: 'Giza (5249)',
      symbol: '△',
      officialNumber: 5249,
      deg: adjustZodiac(normalize360(230.4 + 0.174 * d + 5.5 * Math.sin(toRad(0.174 * d)))),
      civ: 'Egipto Antiguo',
    },
    {
      name: 'Sphinx (896)',
      symbol: '𓃭',
      officialNumber: 896,
      deg: adjustZodiac(normalize360(145.7 + 0.285 * d + 6.2 * Math.sin(toRad(0.285 * d)))),
      civ: 'Egipto Antiguo',
    },
    {
      name: 'Inka (8275)',
      symbol: '☀️',
      officialNumber: 8275,
      deg: adjustZodiac(normalize360(310.2 + 0.312 * d + 9.0 * Math.sin(toRad(0.312 * d)))),
      civ: 'Sudamérica Ancestral',
    },
    {
      name: 'Machu-Picchu (8277)',
      symbol: '⛰️',
      officialNumber: 8277,
      deg: adjustZodiac(normalize360(288.6 + 0.259 * d + 8.4 * Math.sin(toRad(0.259 * d)))),
      civ: 'Sudamérica Ancestral',
    },
    {
      name: 'Quetzalcoatl (1915)',
      symbol: '𓆙',
      officialNumber: 1915,
      deg: adjustZodiac(normalize360(15.3 + 0.243 * d + 16.5 * Math.sin(toRad(0.243 * d)))),
      civ: 'Sudamérica Ancestral',
    },
  ];

  // 6. Local Sidereal Time and Ascendant / Midheaven
  const GMST0 = normalize360(280.46061837 + 360.98564736629 * (jd - 2451545.0));
  const LST = normalize360(GMST0 + data.longitude);
  const eps = 23.439291 - 0.0130042 * T; // Obliquity of ecliptic

  // Midheaven (MC)
  const mcRad = Math.atan2(Math.sin(toRad(LST)), Math.cos(toRad(LST)) * Math.cos(toRad(eps)));
  const mcDeg = adjustZodiac(normalize360(toDeg(mcRad)));

  // Ascendant (ASC)
  const latRad = toRad(data.latitude);
  const ascRad = Math.atan2(
    Math.cos(toRad(LST)),
    -(Math.sin(toRad(eps)) * Math.tan(latRad) + Math.cos(toRad(eps)) * Math.sin(toRad(LST)))
  );
  const ascDeg = adjustZodiac(normalize360(toDeg(ascRad)));

  // 7. House Cusps Calculation (Placidus, Equal, or Whole Sign)
  const houses: { number: number; sign: string; degree: number }[] = [];
  const ascSignIndex = Math.floor(ascDeg / 30);

  for (let i = 1; i <= 12; i++) {
    let cuspDeg = 0;
    if (data.houseSystem === 'wholesign') {
      // Whole Sign: House 1 begins at 0° of the Ascendant's sign!
      const houseSignIndex = (ascSignIndex + i - 1) % 12;
      cuspDeg = normalize360(houseSignIndex * 30);
    } else if (data.houseSystem === 'equal') {
      // Equal House: House 1 is exactly at the degree of the Ascendant
      cuspDeg = normalize360(ascDeg + (i - 1) * 30);
    } else if (data.houseSystem === 'koch') {
      // Koch / GOH (Geburtsort Häusersystem) Quadrant Interpolation
      const icDeg = normalize360(mcDeg + 180);
      const dscDeg = normalize360(ascDeg + 180);
      let q1Span = normalize360(ascDeg - mcDeg);
      let q2Span = normalize360(icDeg - ascDeg);

      if (i === 10) cuspDeg = mcDeg;
      else if (i === 11) cuspDeg = normalize360(mcDeg + q1Span * 0.34);
      else if (i === 12) cuspDeg = normalize360(mcDeg + q1Span * 0.68);
      else if (i === 1) cuspDeg = ascDeg;
      else if (i === 2) cuspDeg = normalize360(ascDeg + q2Span * 0.33);
      else if (i === 3) cuspDeg = normalize360(ascDeg + q2Span * 0.66);
      else if (i === 4) cuspDeg = icDeg;
      else if (i === 5) cuspDeg = normalize360(icDeg + q1Span * 0.34);
      else if (i === 6) cuspDeg = normalize360(icDeg + q1Span * 0.68);
      else if (i === 7) cuspDeg = dscDeg;
      else if (i === 8) cuspDeg = normalize360(dscDeg + q2Span * 0.33);
      else if (i === 9) cuspDeg = normalize360(dscDeg + q2Span * 0.66);
    } else {
      // Placidus / Porphyry hybrid representation
      const icDeg = normalize360(mcDeg + 180);
      const dscDeg = normalize360(ascDeg + 180);
      let q1Span = normalize360(ascDeg - mcDeg);
      let q2Span = normalize360(icDeg - ascDeg);

      if (i === 1) cuspDeg = ascDeg;
      else if (i === 2) cuspDeg = normalize360(ascDeg + q2Span * 0.33);
      else if (i === 3) cuspDeg = normalize360(ascDeg + q2Span * 0.67);
      else if (i === 4) cuspDeg = icDeg;
      else if (i === 5) cuspDeg = normalize360(icDeg + q1Span * 0.33);
      else if (i === 6) cuspDeg = normalize360(icDeg + q1Span * 0.67);
      else if (i === 7) cuspDeg = dscDeg;
      else if (i === 8) cuspDeg = normalize360(dscDeg + q2Span * 0.33);
      else if (i === 9) cuspDeg = normalize360(dscDeg + q2Span * 0.67);
      else if (i === 10) cuspDeg = mcDeg;
      else if (i === 11) cuspDeg = normalize360(mcDeg + q1Span * 0.33);
      else if (i === 12) cuspDeg = normalize360(mcDeg + q1Span * 0.67);
    }
    const z = getZodiacPosition(cuspDeg);
    houses.push({ number: i, sign: z.sign, degree: cuspDeg });
  }

  // Determine house for a given degree
  const determineHouse = (deg: number): number => {
    if (data.houseSystem === 'wholesign') {
      const bodySignIndex = Math.floor(deg / 30);
      let diff = bodySignIndex - ascSignIndex;
      if (diff < 0) diff += 12;
      return diff + 1;
    }
    const diff = normalize360(deg - ascDeg);
    const houseNum = Math.floor(diff / 30) + 1;
    return houseNum > 12 ? 12 : houseNum < 1 ? 1 : houseNum;
  };

  // Helper to apply manual overrides if present in data.manualPositions
  const processBody = (
    name: string,
    symbol: string,
    calcDeg: number,
    isAsteroid: boolean = false
  ): PlanetPosition => {
    const manual = data.manualPositions?.[name];
    if (manual && manual.isCustom) {
      const ecliptic = signAndDegreeToEcliptic(manual.sign, manual.degree, manual.minute || 0);
      return {
        name,
        symbol,
        sign: manual.sign,
        signDegree: Number((manual.degree + (manual.minute || 0) / 60).toFixed(2)),
        eclipticDegree: ecliptic,
        house: manual.house || determineHouse(ecliptic),
        isAsteroid,
      };
    }

    const z = getZodiacPosition(calcDeg);
    return {
      name,
      symbol,
      sign: z.sign,
      signDegree: z.signDegree,
      eclipticDegree: calcDeg,
      house: determineHouse(calcDeg),
      isAsteroid,
    };
  };

  const calculatedPlanets: PlanetPosition[] = rawPlanets.map((p) =>
    processBody(p.name, p.symbol, p.deg, false)
  );

  const calculatedAsteroids: PlanetPosition[] = rawAsteroids.map((a) =>
    processBody(a.name, a.symbol, a.deg, true)
  );

  const calculatedAncientAsteroids: PlanetPosition[] = rawAncientAsteroids.map((a) => {
    const p = processBody(a.name, a.symbol, a.deg, true);
    p.asteroidNumber = a.officialNumber;
    p.civilizationTag = a.civ;
    return p;
  });

  const ascZ = getZodiacPosition(ascDeg);
  const ascendant: PlanetPosition = {
    name: 'Ascendente',
    symbol: 'AC',
    sign: ascZ.sign,
    signDegree: ascZ.signDegree,
    eclipticDegree: ascDeg,
    house: 1,
  };

  const mcZ = getZodiacPosition(mcDeg);
  const midheaven: PlanetPosition = {
    name: 'Medio Cielo',
    symbol: 'MC',
    sign: mcZ.sign,
    signDegree: mcZ.signDegree,
    eclipticDegree: mcDeg,
    house: 10,
  };

  const northNode = calculatedPlanets.find((p) => p.name.includes('Nodo Norte'))!;
  const southNode = calculatedPlanets.find((p) => p.name.includes('Nodo Sur'))!;

  // All celestial bodies for aspect calculation
  const allCelestialBodies: PlanetPosition[] = [
    ...calculatedPlanets,
    ...calculatedAsteroids,
    ...calculatedAncientAsteroids,
    ascendant,
    midheaven,
  ];

  // 8. Aspect Matrix Calculation
  const aspects = calculateAspectsBetweenBodies(allCelestialBodies);

  // 9. House XII Analysis
  const twelfthHouseSign = houses.find((h) => h.number === 12)?.sign || 'Piscis';
  const twelfthHouseProfile =
    HOUSE_TWELFTH_PROFILES[twelfthHouseSign] || HOUSE_TWELFTH_PROFILES['Piscis'];
  const twelfthHousePlanets = calculatedPlanets.filter((p) => p.house === 12);
  const twelfthHouseAsteroids = calculatedAsteroids.filter((a) => a.house === 12);

  // 10. Fixed Stars Calculation with Precession
  const yearDiff = year + (month - 1) / 12 - 2000;
  const precessionShift = yearDiff * (50.29 / 3600);

  const fixedStarAspects: FixedStarAspect[] = [];
  FIXED_STARS.forEach((star) => {
    let precessedLongitude = normalize360(star.longitudeJ2000 + precessionShift);
    if (isSidereal) {
      precessedLongitude = normalize360(precessedLongitude - ayanamshaDeg);
    }

    allCelestialBodies.forEach((point) => {
      let diff = Math.abs(normalize360(point.eclipticDegree) - precessedLongitude);
      if (diff > 180) diff = 360 - diff;

      // Orbe máximo 2.5° para estrellas fijas con planetas/asteroides/ángulos
      if (diff <= 2.5) {
        const orbDegrees = Number(diff.toFixed(2));
        const orbMin = Math.floor(diff * 60);

        fixedStarAspects.push({
          star: {
            ...star,
            zodiacDegree: `${Math.floor(normalize360(precessedLongitude) % 30)}° ${Math.floor(
              ((normalize360(precessedLongitude) % 30) % 1) * 60
            )}'`,
          },
          planet: point,
          aspectType: 'Conjunción',
          orbDegrees,
          orbMinutes: orbMin,
          isExact: diff <= 1.0,
          astronomicalNote: `Alineación sideral en ${point.eclipticDegree.toFixed(2)}° con ${star.name} precesada a ${precessedLongitude.toFixed(2)}° (Orbe: ${orbDegrees}°).`,
          esotericInterpretation: `Conjunción con ${point.name}: Activa la memoria del alma vinculada a ${star.lineage}. ${star.esotericMeaning}`,
        });
      }
    });
  });

  // 11. Starseed Affinity Calculation
  const starseedScores: Record<string, { score: number; rationale: string[] }> = {
    'Sirio': { score: 10, rationale: ['Impronta base del campo akáshico terrestre'] },
    'Pléyades': { score: 10, rationale: ['Resonancia del chakra corazón planetario'] },
    'Arcturus': { score: 5, rationale: [] },
    'Vega/Lira': { score: 5, rationale: [] },
    'Orión': { score: 5, rationale: [] },
    'Andrómeda': { score: 5, rationale: [] },
    'Estrellas Reales': { score: 5, rationale: [] },
  };

  fixedStarAspects.forEach((asp) => {
    const lineage = asp.star.lineage;
    if (starseedScores[lineage]) {
      const weight = asp.isExact ? 35 : 20;
      starseedScores[lineage].score += weight;
      starseedScores[lineage].rationale.push(
        `Conjunción activa entre ${asp.planet.name} y ${asp.star.name} (Orbe de ${asp.orbDegrees}°)`
      );
    }
  });

  if (['Cáncer', 'Escorpio', 'Piscis'].includes(twelfthHouseSign)) {
    starseedScores['Sirio'].score += 15;
    starseedScores['Sirio'].rationale.push(`Casa XII en signo de Agua (${twelfthHouseSign}): afinidad con guardianes délficos`);
    starseedScores['Pléyades'].score += 10;
  }
  if (['Géminis', 'Libra', 'Acuario'].includes(twelfthHouseSign)) {
    starseedScores['Arcturus'].score += 15;
    starseedScores['Arcturus'].rationale.push(`Casa XII en signo de Aire (${twelfthHouseSign}): tecnología de pensamiento 5D`);
    starseedScores['Andrómeda'].score += 12;
  }
  if (['Aries', 'Leo', 'Sagitario'].includes(twelfthHouseSign)) {
    starseedScores['Vega/Lira'].score += 15;
    starseedScores['Orión'].score += 10;
  }

  const totalScore = Object.values(starseedScores).reduce((acc, curr) => acc + curr.score, 0);
  const starseedAffinities = Object.entries(starseedScores)
    .map(([lineage, dItem]) => ({
      lineage,
      score: dItem.score,
      percentage: Math.min(98, Math.max(8, Math.round((dItem.score / totalScore) * 100))),
      rationale: dItem.rationale.length > 0 ? dItem.rationale.join(' · ') : 'Afinidad sutil armónica en el mapa natal.',
    }))
    .sort((a, b) => b.score - a.score);

  // 12. Monad Ray Determination
  const sun = calculatedPlanets.find((p) => p.name === 'Sol')!;
  let rayIndex = 1; // Default Ray 2
  if (['Aries', 'Leo', 'Capricornio'].includes(sun.sign)) rayIndex = 0;
  else if (['Géminis', 'Virgo', 'Piscis'].includes(sun.sign)) rayIndex = 1;
  else if (['Cáncer', 'Libra', 'Capricornio'].includes(ascendant.sign)) rayIndex = 2;
  else if (['Tauro', 'Escorpio', 'Sagitario'].includes(sun.sign)) rayIndex = 3;
  else if (['Acuario', 'Virgo'].includes(sun.sign)) rayIndex = 4;
  else if (['Piscis', 'Sagitario', 'Cáncer'].includes(sun.sign)) rayIndex = 5;
  else if (['Aries', 'Capricornio', 'Acuario'].includes(ascendant.sign)) rayIndex = 6;

  const monadRay = MONAD_RAYS[rayIndex % MONAD_RAYS.length];

  const topStarseed = starseedAffinities[0];
  const soulMissionSummary = `Tu carta ${isSidereal ? 'Sideral (Lahiri)' : 'Tropical'} revela una fuerte impronta del linaje ${topStarseed.lineage} (${topStarseed.percentage}% de resonancia), complementada por la vibración de ${monadRay.name}. A través de tu Casa XII en ${twelfthHouseSign}, tu alma transmuta memorias del inconsciente y ancla el don de ${twelfthHouseProfile.redeemedGift}.`;

  // 13. Spiritual DNA Strands Activation Evaluation
  const evaluatedSpiritualDna = SPIRITUAL_DNA_STRANDS.map((strand) => {
    const hasFixedStarConjunction = fixedStarAspects.some((asp) =>
      asp.star.name.toLowerCase().includes(strand.fixedStarAnchor.toLowerCase().split(' ')[0]) ||
      strand.associatedBodies.some((b) => asp.planet.name.toLowerCase().includes(b.toLowerCase()))
    );

    const hasAspect = aspects.some((asp) =>
      strand.associatedBodies.some(
        (b) =>
          asp.body1.name.toLowerCase().includes(b.toLowerCase()) ||
          asp.body2.name.toLowerCase().includes(b.toLowerCase())
      )
    );

    let status: 'dormido' | 'en_transmutacion' | 'activo' = 'dormido';
    if (hasFixedStarConjunction) {
      status = 'activo';
    } else if (hasAspect) {
      status = 'en_transmutacion';
    } else if (strand.strandNumber <= 2) {
      status = 'activo';
    }

    return {
      ...strand,
      status,
    };
  });

  return {
    userData: data,
    julianDay: jd,
    zodiacType: data.zodiacType,
    ayanamshaDeg: Number(ayanamshaDeg.toFixed(2)),
    planets: calculatedPlanets,
    asteroids: calculatedAsteroids,
    ancientAsteroids: calculatedAncientAsteroids,
    allCelestialBodies,
    ascendant,
    midheaven,
    northNode,
    southNode,
    houses,
    aspects,
    twelfthHouse: twelfthHouseProfile,
    twelfthHousePlanets,
    twelfthHouseAsteroids,
    fixedStarAspects,
    starseedAffinities,
    monadRay,
    spiritualDnaStrands: evaluatedSpiritualDna,
    soulMissionSummary,
  };
}
