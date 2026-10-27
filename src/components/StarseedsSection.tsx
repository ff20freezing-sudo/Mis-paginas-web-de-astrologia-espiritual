import React, { useState } from 'react';
import { STARSEED_LINEAGES, FIXED_STARS } from '../data/akashicKnowledge';
import { StarseedLineage, FixedStar } from '../types/akashic';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  Stars, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  Activity, 
  HelpCircle, 
  Award, 
  Info, 
  Eye, 
  Flame,
  Globe2
} from 'lucide-react';

export const StarseedsSection: React.FC = () => {
  const [selectedLineage, setSelectedLineage] = useState<StarseedLineage>(STARSEED_LINEAGES[0]);
  const [activeTab, setActiveTab] = useState<'encyclopedia' | 'quiz' | 'stars_catalog'>('encyclopedia');

  // Starseed Quiz State
  const quizQuestions = [
    {
      id: 1,
      question: '¿Qué elemento o entorno te produce mayor serenidad y recarga energética?',
      options: [
        { label: 'El océano, ríos profundos y nadar con criaturas acuáticas.', lineage: 'sirio', points: 3 },
        { label: 'Bosques verdes, cantar, pintar o contemplar las flores silvestres.', lineage: 'pleyades', points: 3 },
        { label: 'Cielos despejados de noche, observar geometrías y pensar en otras dimensiones.', lineage: 'arcturus', points: 3 },
        { label: 'Espacios abiertos indómitos, vientos libres donde nadie imponga reglas.', lineage: 'andromeda', points: 3 },
        { label: 'Montañas solemnes y bibliotecas con misterios herméticos.', lineage: 'orion', points: 3 },
      ],
    },
    {
      id: 2,
      question: '¿Cuál es tu mayor desafío o sensibilidad recurrente en el plano terrestre?',
      options: [
        { label: 'Agotamiento extremo por absorber las emociones de amigos y desconocidos.', lineage: 'pleyades', points: 3 },
        { label: 'Sentirme incomprendido o frustrado por la lentitud e incoherencia de los sistemas.', lineage: 'arcturus', points: 3 },
        { label: 'Tendencia al aislamiento emocional cuando el entorno se torna agresivo.', lineage: 'sirio', points: 3 },
        { label: 'Luchar contra el hiper-análisis mental y la dificultad para confiar.', lineage: 'orion', points: 3 },
        { label: 'Claustrofobia ante rutinas repetitivas o relaciones asfixiantes.', lineage: 'andromeda', points: 3 },
      ],
    },
    {
      id: 3,
      question: '¿Hacia qué tipo de conocimiento o actividad sientes una atracción innata?',
      options: [
        { label: 'Geometría sagrada, arquitectura de templos y códigos del sonido.', lineage: 'sirio', points: 3 },
        { label: 'Terapias energéticas con las manos, aromaterapia y herbolaria compasiva.', lineage: 'pleyades', points: 3 },
        { label: 'Física cuántica, campos electromagnéticos, medicina del futuro y tecnología 5D.', lineage: 'arcturus', points: 3 },
        { label: 'Estrategia profunda, resolución de conflictos complejos y alquimia interior.', lineage: 'orion', points: 3 },
        { label: 'Defensa incorruptible de la verdad, soberanía personal y liderazgo ético.', lineage: 'vega_lira', points: 3 },
      ],
    },
    {
      id: 4,
      question: '¿Qué frase resuena más íntimamente con el anhelo de tu corazón?',
      options: [
        { label: '"Vine a recordar a los seres humanos que el amor es la única ley eterna."', lineage: 'pleyades', points: 3 },
        { label: '"Vine a anclar la coherencia geométrica y custodiar los portales sagrados."', lineage: 'sirio', points: 3 },
        { label: '"Vine a ayudar a la Tierra en su transición de frecuencia hacia la 5D."', lineage: 'arcturus', points: 3 },
        { label: '"Vine a romper cadenas obsoletas y defender la libertad soberana del ser."', lineage: 'andromeda', points: 3 },
        { label: '"Vine a dominar el fuego de la mente y reconciliar la luz con la oscuridad."', lineage: 'orion', points: 3 },
      ],
    },
  ];

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<{ lineage: string; score: number }[] | null>(null);

  const handleSelectAnswer = (qId: number, lineage: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: lineage }));
  };

  const handleCalculateQuiz = () => {
    const scores: Record<string, number> = {
      sirio: 0,
      pleyades: 0,
      arcturus: 0,
      vega_lira: 0,
      orion: 0,
      andromeda: 0,
    };

    Object.values(answers).forEach((lin) => {
      if (scores[lin] !== undefined) {
        scores[lin] += 25;
      }
    });

    const results = Object.entries(scores)
      .map(([lin, score]) => {
        const found = STARSEED_LINEAGES.find((s) => s.id === lin);
        return {
          lineage: found?.name || lin,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    setQuizResults(results);
    soundEngine.playSingingBowlChime(528);
  };

  return (
    <div id="starseeds-section" className="space-y-8">
      
      {/* Area Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-2">
          <Stars className="w-3.5 h-3.5" />
          <span>ÁREA II · LAS FAMILIAS DEL COSMOS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
          Estrellas Fijas & Linajes Starseed
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-light">
          Investiga las asociaciones simbólicas con Sirio, las Pléyades, Vega, Arcturus y Orión. En esta sección examinamos las características arquetípicas transmitidas por la tradición esotérica, manteniendo una clara distinción respecto a los datos astronómicos verificables.
        </p>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'encyclopedia', label: '1. Enciclopedia de Linajes Estelares', icon: Stars },
            { id: 'quiz', label: '2. Test de Resonancia Starseed', icon: HelpCircle },
            { id: 'stars_catalog', label: '3. Catálogo de Estrellas Fijas', icon: Globe2 },
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

      {/* SUBTAB 1: ENCYCLOPEDIA */}
      {activeTab === 'encyclopedia' && (
        <div className="space-y-6">
          
          {/* Horizontal Lineage Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STARSEED_LINEAGES.map((lin) => {
              const isSelected = selectedLineage.id === lin.id;
              return (
                <button
                  key={lin.id}
                  onClick={() => {
                    setSelectedLineage(lin);
                    soundEngine.playSingingBowlChime(432);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block mr-1.5"
                    style={{ backgroundColor: lin.frequencyColor }}
                  />
                  <span className="text-xs font-bold text-slate-200 font-serif-cosmic block mt-1">
                    {lin.originStar}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-astro">
                    {lin.constellation}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Lineage Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedLineage.frequencyColor }}
                  />
                  <span className="text-xs uppercase font-mono-astro text-amber-400">
                    {selectedLineage.name}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif-cosmic text-slate-100 mt-1">
                  {selectedLineage.archetype}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-astro">
                <span className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1 rounded">
                  {selectedLineage.chakraResonance}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {selectedLineage.description}
            </p>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/20">
              <span className="font-mono-astro text-amber-300 text-xs uppercase tracking-wider block mb-1">
                Misión Colectiva en la Tierra:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {selectedLineage.missionOnEarth}
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Spiritual Gifts */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Award className="w-4 h-4" />
                  <span className="font-mono-astro uppercase text-[11px]">Dones Espirituales</span>
                </div>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  {selectedLineage.spiritualGifts.map((gift, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✦</span>
                      <span>{gift}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Earthly Challenges */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="font-mono-astro uppercase text-[11px]">Desafíos Terrenos</span>
                </div>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  {selectedLineage.earthlyChallenges.map((ch, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400">⚠</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Physical & Nervous Sensitivities */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                  <Activity className="w-4 h-4" />
                  <span className="font-mono-astro uppercase text-[11px]">Sensibilidades Físicas</span>
                </div>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  {selectedLineage.physicalSensitivities.map((sens, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-400">≈</span>
                      <span>{sens}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Sacred Symbols */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-mono-astro">Símbolos Clave:</span>
              <div className="flex flex-wrap gap-2 text-amber-200">
                {selectedLineage.keySymbols.map((sym, i) => (
                  <span key={i} className="bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800 text-[11px]">
                    {sym}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-serif-cosmic text-slate-100">
              Cuestionario Introspectivo de Resonancia Starseed
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Responde según tus inclinaciones espontáneas más profundas, más allá de la mente racional.
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q) => (
              <div key={q.id} className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-mono-astro text-amber-400">
                  Pregunta {q.id} de {quizQuestions.length}
                </span>
                <p className="text-sm font-medium text-slate-200">
                  {q.question}
                </p>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt.lineage;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, opt.lineage)}
                        className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50'
                            : 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] mt-0.5 ${
                          isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCalculateQuiz}
              disabled={Object.keys(answers).length < quizQuestions.length}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-2.5 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-40"
            >
              Revelar Mi Resonancia Estelar
            </button>
          </div>

          {quizResults && (
            <div className="mt-6 bg-slate-950 border border-amber-500/30 rounded-xl p-6 space-y-4">
              <span className="text-xs font-mono-astro text-amber-400 uppercase tracking-wider block">
                Resultados de tu Cuestionario
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tu mayor afinidad introspectiva apunta hacia el linaje <strong className="text-amber-200">{quizResults[0].lineage}</strong>, con resonancias complementarias en otros clanes estelares. La mayoría de las almas han transitado por más de un sistema antes de su servicio en la Tierra.
              </p>

              <div className="space-y-2.5">
                {quizResults.map((res, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{res.lineage}</span>
                      <span className="font-mono-astro text-amber-300 font-semibold">{res.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-indigo-500"
                        style={{ width: `${res.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB 3: FIXED STARS CATALOG */}
      {activeTab === 'stars_catalog' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIXED_STARS.map((star) => (
              <div
                key={star.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono-astro text-amber-400">
                      {star.lineage}
                    </span>
                    <h4 className="text-sm font-bold font-serif-cosmic text-slate-100">
                      {star.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono-astro">
                      {star.constellationNameEs}
                    </span>
                  </div>
                  <span className="text-xs font-mono-astro text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {star.zodiacDegree} {star.zodiacSign}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded text-[11px] text-slate-300">
                    <span className="text-sky-400 font-mono-astro block text-[10px]">Astronomía:</span>
                    {star.astronomicalFacts}
                  </div>
                  <div className="bg-indigo-950/20 p-2 rounded text-[11px] text-slate-200">
                    <span className="text-amber-300 font-mono-astro block text-[10px]">Esoterismo:</span>
                    {star.esotericMeaning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
