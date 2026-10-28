import { isExplanation, isQuickExercise, QUESTION_COUNT } from '../src/core/challenge/challenge.js'
import { toExercise } from '../src/core/routes/routeFromAi.js'
import { AiRequestError, GEMINI_FAST_MODELS, requestJson } from './aiJson.js'
import { EXERCISE_SCHEMA } from './generarRuta.js'

/**
 * «Trae tu tema» in the Reto: five questions from a topic the visitor types
 * (or a short paragraph of their notes). Much smaller than a study route, so
 * it comes back in seconds.
 */

export const MAX_TOPIC_CHARS = 80
export const MAX_NOTES_CHARS = 4000
const MIN_QUICK = 3
const ATTEMPT_MS = 25_000

const SYSTEM_PROMPT = `Eres el motor del Reto APROPIA: un juego de 5 preguntas contra el reloj en una feria universitaria.
Recibes un tema o un fragmento de apuntes y escribes exactamente 5 preguntas:
- Las 4 primeras son rápidas, para responder en menos de 20 segundos:
  - choice: 3 opciones cortas (máximo 8 palabras) y plausibles; "answer" debe ser exactamente una de ellas.
  - typed: completar con una palabra o un número; "sentence" contiene ___ donde va la respuesta. En "alternatives" pon todas las formas que un estudiante escribiría bien: el símbolo y la palabra (a y aceleración), el número y el ordinal (tercer, tercero y 3), con y sin artículo.
  - match: exactamente 3 parejas cortas, sin repetir lados.
  Mezcla al menos dos tipos.
- La quinta es open: pide explicar con las propias palabras una idea central. "modelAnswer" es la respuesta modelo en una o dos frases y "hints" tiene una pista que orienta sin dar la respuesta.
Reglas:
- Cada pregunta se entiende sola: nunca digas «según el texto», «en el ejemplo», «en los apuntes» ni hagas referencia a algo que el jugador no ve.
- Si recibes apuntes, básate solo en ellos. Si solo recibes un tema, usa conocimientos básicos y bien establecidos del tema, de nivel introductorio; nada dudoso ni muy reciente.
- Escribe en español correcto (con ¿ y tildes), de «tú», directo, sin emojis. Si el tema es un idioma, las frases de práctica pueden ir en ese idioma.
- "explanation" dice en una frase por qué la respuesta es correcta.
- "title" es el nombre corto del tema, sin la palabra «reto».

Ejemplo de entrada y de respuesta esperada (imita el estilo, no el tema):
Apuntes:
<apuntes>
La fotosíntesis es el proceso con el que las plantas fabrican su alimento. Ocurre en los cloroplastos, que tienen clorofila, el pigmento verde que capta la luz del sol. La planta toma agua y dióxido de carbono y, con la energía de la luz, produce glucosa y libera oxígeno.
</apuntes>
Respuesta:
{"title": "Fotosíntesis", "questions": [{"type": "choice", "prompt": "¿Dónde ocurre la fotosíntesis dentro de la célula vegetal?", "sentence": "", "options": ["En los cloroplastos", "En el núcleo", "En las raíces"], "answer": "En los cloroplastos", "alternatives": [], "pairs": [], "modelAnswer": "", "hints": [], "explanation": "Los cloroplastos tienen la clorofila que capta la luz."}, {"type": "typed", "prompt": "Completa la frase.", "sentence": "La fotosíntesis libera ___ al aire.", "options": [], "answer": "oxígeno", "alternatives": ["oxigeno", "O2"], "pairs": [], "modelAnswer": "", "hints": [], "explanation": "El oxígeno sale de romper moléculas de agua."}, {"type": "match", "prompt": "Relaciona cada sustancia con su papel en la fotosíntesis.", "sentence": "", "options": [], "answer": "", "alternatives": [], "pairs": [{"left": "Dióxido de carbono", "right": "Lo toma la planta"}, {"left": "Oxígeno", "right": "Lo libera la planta"}, {"left": "Glucosa", "right": "El alimento que fabrica"}], "modelAnswer": "", "hints": [], "explanation": "La planta toma CO₂ y agua y produce glucosa y oxígeno."}, {"type": "choice", "prompt": "¿Qué capta la clorofila?", "sentence": "", "options": ["La luz del sol", "El agua del suelo", "El oxígeno del aire"], "answer": "La luz del sol", "alternatives": [], "pairs": [], "modelAnswer": "", "hints": [], "explanation": "La clorofila absorbe la luz, que es la energía del proceso."}, {"type": "open", "prompt": "Explica con tus palabras por qué una planta sin luz no puede fabricar su alimento.", "sentence": "", "options": [], "answer": "", "alternatives": [], "pairs": [], "modelAnswer": "Porque la fotosíntesis usa la energía de la luz para convertir el agua y el dióxido de carbono en glucosa; sin luz no hay energía para hacerlo.", "hints": ["¿De dónde sale la energía del proceso?"], "explanation": ""}]}`

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    questions: { type: 'array', items: EXERCISE_SCHEMA },
  },
  required: ['title', 'questions'],
  additionalProperties: false,
}

/**
 * @param {{ topic?: string, notes?: string }} input
 * @returns {Promise<{ title: string, questions: object[] }>}
 */
export async function generateChallenge({ topic = '', notes = '' }) {
  topic = topic.trim()
  notes = notes.trim()
  if (topic.length < 3 && notes.length < 80) throw new AiRequestError('Escribe un tema o pega un párrafo de tus apuntes.')
  if (topic.length > MAX_TOPIC_CHARS) throw new AiRequestError('El tema es muy largo. Escríbelo en pocas palabras.')
  if (notes.length > MAX_NOTES_CHARS) throw new AiRequestError('Los apuntes son muy largos. Pega solo un párrafo.')

  const parts = []
  if (topic) parts.push(`Tema: ${topic}`)
  if (notes) parts.push(`Apuntes:\n<apuntes>\n${notes}\n</apuntes>`)
  parts.push('Escribe las 5 preguntas del reto.')

  const draft = await requestJson({
    system: SYSTEM_PROMPT,
    text: parts.join('\n\n'),
    schema: SCHEMA,
    maxTokens: 6000,
    attemptMs: ATTEMPT_MS,
    models: GEMINI_FAST_MODELS,
    tag: 'generar-reto',
  })

  const stamp = Date.now().toString(36)
  const questions = (draft.questions ?? [])
    .map((question, i) => toExercise(question, `propio-${stamp}-q${i + 1}`))
    .filter(Boolean)
  const quick = questions.filter(isQuickExercise)
  const explanation = questions.find(isExplanation)
  if (quick.length < MIN_QUICK) throw new Error('La IA no devolvió suficientes preguntas válidas.')

  return {
    title: (draft.title ?? '').trim() || topic || 'Tu tema',
    questions: [...quick.slice(0, explanation ? QUESTION_COUNT - 1 : QUESTION_COUNT), ...(explanation ? [explanation] : [])],
  }
}
