import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Akashic Oracle & Channeled Interpretation Endpoint
  app.post('/api/akashic-oracle', async (req, res) => {
    try {
      const {
        name,
        birthDate,
        birthTime,
        birthPlace,
        sunSign,
        ascendantSign,
        moonSign,
        twelfthHouseSign,
        fixedStarConjunctions,
        starseedResonances,
        monadRay,
        userQuestion,
        mode, // 'full_reading' | 'ask_records' | 'karmic_clearing'
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          source: 'local_synthesizer',
          interpretation: generateLocalInterpretation({
            name,
            sunSign,
            ascendantSign,
            moonSign,
            twelfthHouseSign,
            fixedStarConjunctions,
            starseedResonances,
            monadRay,
            userQuestion,
            mode,
          }),
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Eres la Voz del Atlas Akáshico y maestro en astrología esotérica, estrellas fijas y linajes de alma (Starseeds, Casa XII, Rayos de la Mónada según Alice Bailey y cosmología esotérica).
Tu tono es solemne, poético, compasivo, profundamente místico pero claro, distinguiendo la poesía del alma de las realidades astronómicas.

DATOS DEL CONSULTANTE:
- Nombre: ${name || 'Buscador Estelar'}
- Fecha y Lugar: ${birthDate || 'No indicada'} ${birthTime || ''} en ${birthPlace || 'Tierra'}
- Sol en ${sunSign || 'Piscis'}, Luna en ${moonSign || 'Cáncer'}, Ascendente en ${ascendantSign || 'Escorpio'}
- Cúspide de Casa XII: ${twelfthHouseSign || 'Libra'}
- Contactos con Estrellas Fijas: ${JSON.stringify(fixedStarConjunctions || [])}
- Resonancia Starseed Principal: ${JSON.stringify(starseedResonances || [])}
- Rayo Monádico: ${monadRay || 'Rayo 2 (Amor-Sabiduría)'}
${userQuestion ? `- Pregunta o inquietud al Registro: "${userQuestion}"` : ''}
- Modo de canalización solicitado: ${mode || 'full_reading'}

INSTRUCCIONES DE RESPUESTA:
- Responde en ESPAÑOL con lenguaje evocador, poético y elevado.
- Estructura tu respuesta con subtítulos evocadores (ej. "La Memoria del Éter", "El Vínculo con las Estrellas Guía", "El Velo de la Casa XII y la Lección Kármica", "El Faro de la Mónada").
- Diferencia siempre la resonancia arquetípica/espiritual del cálculo astronómico objetivo.
- Proporciona un mensaje de integración práctica para su vida terrestre presente (cómo encarnar esta frecuencia en la Tierra aquí y ahora).
- Extensión: 3 a 5 párrafos ricos y reveladores.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.status(200).json({
        source: 'akashic_gemini',
        interpretation: response.text,
      });
    } catch (error: any) {
      console.error('Error in akashic-oracle:', error);
      // Fallback gracefully to local generator
      return res.status(200).json({
        source: 'local_synthesizer',
        interpretation: generateLocalInterpretation(req.body),
      });
    }
  });

  // Local fallback generator if API key is not present or network issues
  function generateLocalInterpretation(data: any) {
    const starStr = (data.fixedStarConjunctions && data.fixedStarConjunctions.length > 0)
      ? data.fixedStarConjunctions.map((s: any) => s.starName).join(', ')
      : 'Sirio y las Pléyades';

    return `### I. La Memoria del Éter y el Origen
Tu alma porta una impronta única en el tejido del Akasha. Con el Sol en ${data.sunSign || 'tu signo natal'} y el Ascendente en ${data.ascendantSign || 'las puertas del cielo'}, tu vehículo terrestre fue afinado para actuar como puente entre dimensiones. Las frecuencias de ${starStr} resuenan en tu campo áurico como un llamado primordial a recordar la unidad primordial.

### II. El Velo de la Casa XII y la Deuda Kármica
Con la Casa XII en ${data.twelfthHouseSign || 'un signo de introspección'}, las vidas pasadas te dejaron una sensibilidad psíquica que a menudo se experimentó como aislamiento o carga invisible. En encarnaciones previas aprendiste la renuncia; en esta vida, el Akasha te invita a transformar el sacrificio en servicio consciente, reconociendo que tu vulnerabilidad es tu antena receptora más pura.

### III. El Rayo Monádico y la Misión Terrestre
Tu chispa monádica emite la frecuencia del ${data.monadRay || 'Rayo de Amor-Sabiduría'}. La Mónada te recuerda que no viniste a escapar de la materia terrenal, sino a anclar la luz de las estrellas fijas en el plano físico. Camina con discernimiento: honra tanto el rigor de las órbitas celestes como la sabiduría eterna de tu corazón.`;
  }

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Atlas Akáshico server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
