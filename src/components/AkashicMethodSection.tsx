import React, { useState, useEffect } from 'react';
import { DREAM_SYMBOLS, MASTER_NUMBERS_SYNCHRONICITY } from '../data/akashicKnowledge';
import { AkashicJournalEntry, DreamSymbol } from '../types/akashic';
import { soundEngine } from '../utils/audioSynthesis';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Plus, 
  Trash2, 
  Play, 
  Calendar, 
  Feather, 
  Compass, 
  CheckCircle,
  Clock
} from 'lucide-react';

export const AkashicMethodSection: React.FC = () => {
  // Tabs within Area 1
  const [subTab, setSubTab] = useState<'protocol' | 'symbols' | 'synchronicity' | 'journal'>('protocol');

  // Search in symbols
  const [symbolSearch, setSymbolSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('all');

  // Journal entries state (persisted to localStorage)
  const [journalEntries, setJournalEntries] = useState<AkashicJournalEntry[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AkashicJournalEntry['category']>('meditacion');
  const [newContent, setNewContent] = useState('');

  // 7-year life cycles calculator
  const [currentAge, setCurrentAge] = useState<number>(30);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('akashic_journal');
      if (saved) {
        setJournalEntries(JSON.parse(saved));
      } else {
        // Initial sample entry
        const sample: AkashicJournalEntry[] = [
          {
            id: 'sample-1',
            date: new Date().toISOString().split('T')[0],
            title: 'Sincronía con el 11:11 y sueño del templo',
            category: 'sincronia',
            content: 'Vi repetidamente el número 11:11 al encender la pantalla. En sueños recordé un templo de agua con muros de cristal azul y una sensación de profunda paz en el corazón.',
            frequencyHz: 432,
            tags: ['sincronia', 'sirio', 'paz'],
          },
        ];
        setJournalEntries(sample);
      }
    } catch {}
  }, []);

  const saveJournal = (entries: AkashicJournalEntry[]) => {
    setJournalEntries(entries);
    try {
      localStorage.setItem('akashic_journal', JSON.stringify(entries));
    } catch {}
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const entry: AkashicJournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      frequencyHz: 432,
      tags: [newCategory],
    };

    saveJournal([entry, ...journalEntries]);
    setNewTitle('');
    setNewContent('');
    soundEngine.playSingingBowlChime(528);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    saveJournal(updated);
  };

  // Filter dream symbols
  const filteredSymbols = DREAM_SYMBOLS.filter((s) => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      s.akashicMeaning.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      s.karmicSignificance.toLowerCase().includes(symbolSearch.toLowerCase());
    const matchesElement = selectedElement === 'all' || s.element.includes(selectedElement);
    return matchesSearch && matchesElement;
  });

  // Calculate 7-year cycle
  const cycleIndex = Math.floor(currentAge / 7);
  const cycleStart = cycleIndex * 7;
  const cycleEnd = cycleStart + 6;
  const cyclesMeanings: Record<number, string> = {
    0: '0 - 6 años: Enraizamiento biológico, asimilación del cuerpo físico y memoria del útero materno.',
    1: '7 - 13 años: Desarrollo del cuerpo etérico, hábitos, ritmos y primera afirmación de la individualidad.',
    2: '14 - 20 años: Despertar del cuerpo astral, pasiones, crisis de identidad y cuestionamiento del mundo.',
    3: '21 - 27 años: Nacimiento del Yo consciente (Ego terrestre), inserción social y primeros contratos de vida.',
    4: '28 - 34 años: El Retorno de Saturno (~29.5 años). Madurez kármica, desmoronamiento de ilusiones y compromiso real con el destino.',
    5: '35 - 41 años: Crisis de los 40 y oposición de Urano. Anhelo de autenticidad del alma; despertar de dones latentes.',
    6: '42 - 48 años: Cuadratura de Neptuno. Reevaluación de ideales espirituales y apertura al servicio generoso.',
    7: '49 - 55 años: El Segundo Retorno de Quirón (~50 años). Sanación de la herida sagrada del alma y sabiduría de vida.',
    8: '56 - 62 años: El Segundo Retorno de Saturno (~59 años). Cosecha de méritos kármicos y transmisión de sabiduría a nuevas generaciones.',
    9: '63+ años: Trascendencia espiritual, desapego sereno de la materia y preparación para la síntesis de la Mónada.',
  };

  return (
    <div id="method-section" className="space-y-8">
      
      {/* Area Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ÁREA I · LA MEMORIA DEL ÉTER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-cosmic text-slate-100">
          El Método Akáshico
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-light">
          El término <span className="text-amber-200 italic">Akasha</span> proviene del sánscrito y designa el éter o sustancia primordial: la biblioteca viviente que almacena las impresiones energéticas de cada pensamiento, emoción y experiencia del alma a lo largo de todas sus encarnaciones.
        </p>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'protocol', label: '1. Protocolo de Apertura & Meditación', icon: Sparkles },
            { id: 'symbols', label: '2. Decodificador de Sueños & Símbolos', icon: Feather },
            { id: 'synchronicity', label: '3. Sincronías & Ciclos de 7 Años', icon: Clock },
            { id: 'journal', label: '4. Diario Akáshico Personal', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
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

      {/* SUBTAB 1: PROTOCOL & MEDITATION */}
      {subTab === 'protocol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1: Grounding */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-mono-astro text-amber-400 block mb-1">
                Fase 1 · El Anclaje a Gaia
              </span>
              <h3 className="text-base font-bold font-serif-cosmic text-slate-100 mb-2">
                Enraizamiento en la Madre Tierra
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Siéntate con la espalda recta y las plantas de los pies sobre el suelo. Inhala en 4 segundos, retén 4 y exhala en 4. Visualiza gruesas raíces de luz dorada descendiendo desde el coxis y las plantas de los pies hasta el corazón cristalino de la Tierra. Siente la estabilidad firme de la materia.
              </p>
            </div>

            {/* Step 2: The Pranic Pillar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-mono-astro text-sky-400 block mb-1">
                Fase 2 · El Pilar de Luz (Antahkarana)
              </span>
              <h3 className="text-base font-bold font-serif-cosmic text-slate-100 mb-2">
                Conexión con el Gran Sol Central
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Imagina un rayo de luz blanca-diamantina que desciende desde la Mónada y las estrellas fijas (Sirio/Pléyades), entra por tu coronilla y recorre todos tus chakras hasta encontrarse con el anclaje terrestre en tu corazón. Tu cuerpo se convierte en un puente vivo entre el Cielo y la Tierra.
              </p>
            </div>

            {/* Step 3: Sacred Prayer */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono-astro text-amber-300">
                  Fase 3 · Oración Sagrada de Acceso
                </span>
                <button
                  onClick={() => soundEngine.playSingingBowlChime(432)}
                  className="text-xs font-mono-astro text-amber-400 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Sonar Campana Sagrada</span>
                </button>
              </div>
              <blockquote className="border-l-2 border-amber-400/80 pl-4 py-1 text-xs sm:text-sm text-slate-200 italic leading-relaxed space-y-2">
                <p>
                  "Solicito a los Guardianes del Akasha, a los Maestros de Luz y a mi Yo Superior el permiso para acceder al Registro de mi alma.
                </p>
                <p>
                  Que toda información recibida provenga únicamente de la más alta vibración de Amor y Verdad, para mi mayor bien y el de todos los seres involucrados.
                </p>
                <p>
                  Mis Registros están ahora abiertos en la luz. Así es, hecho está."
                </p>
              </blockquote>
            </div>

          </div>

          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-mono-astro uppercase text-slate-400 tracking-wider mb-2">
                Recomendaciones para la Práctica
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Evita juicios precipitados:</strong> La información akáshica suele llegar como sensaciones sutiles, imágenes poéticas o certezas instantáneas, rara vez como discursos ruidosos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pregunta el "Para qué" en vez del "Por qué":</strong> Por ejemplo: "¿Para qué atraigo esta experiencia repetitiva?" en lugar de "¿Por qué me pasa esto a mí?".
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cierre formal:</strong> Al terminar, agradece a los guardianes y decreta: "Agradezco la guía recibida. Mis Registros Akáshicos quedan ahora cerrados".
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center space-y-3">
              <span className="text-xs font-mono-astro text-amber-400 block">
                Frecuencias Sónicas Recomendadas
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utiliza la frecuencia de 432 Hz para aquietar las ondas cerebrales a estado alfa, o 963 Hz para conectar con el chakra corona.
              </p>
              <button
                onClick={() => soundEngine.playFrequency(432)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer font-mono-astro"
              >
                Activar Tono 432 Hz
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: DREAM & SYMBOL DECODER */}
      {subTab === 'symbols' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                placeholder="Buscar símbolo (llave, mar, templo, serpiente...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'Fuego', 'Agua', 'Tierra', 'Aire', 'Éter'].map((el) => (
                <button
                  key={el}
                  onClick={() => setSelectedElement(el)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    selectedElement === el
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {el === 'all' ? 'Todos los elementos' : el}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSymbols.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold font-serif-cosmic text-amber-200">
                    {item.symbol}
                  </h4>
                  <span className="text-[10px] font-mono-astro text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {item.element}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-mono-astro text-sky-400 text-[11px] block">
                      Memoria Akáshica:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {item.akashicMeaning}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono-astro text-purple-400 text-[11px] block">
                      Significado Kármico:
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {item.karmicSignificance}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="font-mono-astro text-amber-400 text-[11px] block">
                      Consejo de Integración:
                    </span>
                    <p className="text-slate-400 italic text-[11px]">
                      {item.integrationAdvice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SYNCHRONICITIES & LIFE CYCLES */}
      {subTab === 'synchronicity' && (
        <div className="space-y-6">
          
          {/* Master Numbers Grid */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-bold font-serif-cosmic text-slate-100 mb-1">
              Decodificador de Números Maestros & Sincronicidades
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cuando ves secuencias numéricas repetitivas en relojes, matrículas o tickets, el campo akáshico te envía una llamada de coherencia vibracional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {MASTER_NUMBERS_SYNCHRONICITY.map((m) => (
                <div key={m.number} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-astro font-bold text-amber-300 text-sm">
                      {m.number}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-astro">
                      {m.archetype}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    {m.meaning}
                  </p>
                  <div className="text-[10px] text-amber-400/90 italic pt-1 border-t border-slate-800/80">
                    Acción: {m.karmicAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Year Cycles Calculator */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono-astro text-amber-400">
                  METODOLOGÍA BIOGRÁFICA ANTROPOSÓFICA & ESOTÉRICA
                </span>
                <h3 className="text-base font-bold font-serif-cosmic text-slate-100 mt-0.5">
                  Los Septenios: Ciclos Kármicos de 7 Años
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-mono-astro text-slate-300">
                  Tu edad actual:
                </label>
                <input
                  type="number"
                  min="0"
                  max="110"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(parseInt(e.target.value, 10) || 0)}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono-astro text-amber-300 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/20 mb-4">
              <span className="text-xs font-mono-astro text-amber-300 block mb-1">
                Septenio Actual ({cycleStart} a {cycleEnd} años):
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {cyclesMeanings[cycleIndex] || 'Septenio de alta síntesis espiritual y trascendencia.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-mono-astro text-slate-400 text-[11px] uppercase tracking-wider block">
                Mapa General de la Evolución de la Conciencia:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                {Object.entries(cyclesMeanings).map(([key, desc]) => (
                  <div
                    key={key}
                    className={`p-2 rounded border ${
                      parseInt(key, 10) === cycleIndex
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-100 font-medium'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    {desc}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 4: AKASHIC JOURNAL */}
      {subTab === 'journal' && (
        <div className="space-y-6">
          
          {/* New Entry Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-mono-astro text-amber-400 mb-3">
              <Plus className="w-3.5 h-3.5" />
              <span>NUEVO REGISTRO EN EL DIARIO AKÁSHICO</span>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título del sueño, visión o sincronicidad..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="meditacion">Meditación Akáshica</option>
                    <option value="sueno">Sueño Revelador</option>
                    <option value="sincronia">Sincronía Numérica/Vital</option>
                    <option value="canalizacion">Mensaje Canalizado</option>
                    <option value="sanacion">Liberación Kármica</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe la experiencia, símbolos percibidos, emociones sentidas o lección aprendida..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar en mi Diario</span>
                </button>
              </div>
            </form>
          </div>

          {/* Entries List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-astro uppercase text-slate-400 tracking-wider">
              Tus Memorias Guardadas ({journalEntries.length})
            </h4>

            {journalEntries.length > 0 ? (
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono-astro text-slate-500">
                          <span>{entry.date}</span>
                          <span>·</span>
                          <span className="uppercase text-amber-400/90">{entry.category}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-100 font-serif-cosmic mt-0.5">
                          {entry.title}
                        </h5>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Eliminar entrada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Aún no has registrado notas en tu diario akáshico.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
