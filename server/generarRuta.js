import { courseFromDraft, ROUTE_ID_PREFIX } from '../src/core/routes/routeFromAi.js'
import { AiRequestError, requestJson } from './aiJson.js'

export { activeProvider, GeminiError, ProviderNotConfiguredError } from './aiJson.js'
export { AiRequestError as RouteRequestError }

/**
 * Builds a study route from the student's own material (see `aiJson.js` for
 * the providers). `courseFromDraft` then drops anything that breaks the
 * content rules and assigns ids.
 */

// Vercel rejects request bodies over 4.5 MB; base64 adds about a third.
export const MAX_PDF_BYTES = 3 * 1024 * 1024
export const MAX_TEXT_CHARS = 60_000

const SYSTEM_PROMPT = `Eres el motor de Apropia, una plataforma que ayuda a estudiantes a aprender y no solo a obtener respuestas.
Recibes los materiales de un estudiante (apuntes, guías o diapositivas) y armas una ruta de estudio para practicar antes de ver respuestas.

Reglas:
- Usa solo lo que está en el material. Si algo no aparece, no lo inventes.
- Escribe en español correcto (con signos de apertura ¿ y ¡ y tildes), de «tú», directo y sin adornos ni emojis. Si el material está en otro idioma (por ejemplo, inglés), los ejemplos y respuestas pueden ir en ese idioma.
- Organiza de 2 a 4 módulos, de 1 a 3 lecciones cada uno, con 5 a 8 lecciones en total (menos solo si el material es muy corto). Ordena de lo básico a lo que depende de ello.
- Cada lección trae poca teoría (1 a 3 bloques cortos): lo justo para recordar. "tip" es para errores frecuentes.
- Cada lección trae de 4 a 6 ejercicios que mezclan los cuatro tipos:
  - choice: selección múltiple, 3 o 4 opciones plausibles; "answer" debe ser exactamente una de las opciones.
  - match: relacionar, de 3 a 5 parejas sin repetir lados.
  - typed: completar; "sentence" contiene ___ donde va la respuesta, y "answer" es corta (una palabra o una expresión breve). La respuesta debe ser un dato concreto del material, nunca un marcador genérico como «condicion» o «valor». Usa "alternatives" para otras formas válidas.
  - open: explicar con tus propias palabras; "modelAnswer" es una respuesta modelo breve y "hints" son pistas que orientan sin dar la respuesta.
- Incluye al menos un ejercicio open por lección.
- Cada ejercicio trae todos los campos; deja vacíos ("" o []) los que no corresponden a su tipo.
- "explanation" dice por qué la respuesta es correcta, en una o dos frases.
- "title" es el nombre de la ruta (corto) y "summary" dice en una frase qué cubre. No numeres los títulos de módulos ni lecciones.`

const text = { type: 'string' }
const texts = { type: 'array', items: text }

// One flat shape for every exercise type (no anyOf): Gemini's schema support
// is narrower than Claude's. Fields that do not apply to a type come back empty.
const EXERCISE_SCHEMA = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['choice', 'match', 'typed', 'open'] },
    prompt: text,
    sentence: text,
    options: texts,
    answer: text,
    alternatives: texts,
    pairs: {
      type: 'array',
      items: {
        type: 'object',
        properties: { left: text, right: text },
        required: ['left', 'right'],
        additionalProperties: false,
      },
    },
    modelAnswer: text,
    hints: texts,
    explanation: text,
  },
  required: ['type', 'prompt', 'sentence', 'options', 'answer', 'alternatives', 'pairs', 'modelAnswer', 'hints', 'explanation'],
  additionalProperties: false,
}

const ROUTE_SCHEMA = {
  type: 'object',
  properties: {
    title: text,
    summary: text,
    modules: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: text,
          lessons: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: text,
                theory: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: { kind: { type: 'string', enum: ['text', 'tip'] }, text },
                    required: ['kind', 'text'],
                    additionalProperties: false,
                  },
                },
                exercises: { type: 'array', items: EXERCISE_SCHEMA },
              },
              required: ['title', 'theory', 'exercises'],
              additionalProperties: false,
            },
          },
        },
        required: ['title', 'lessons'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'summary', 'modules'],
  additionalProperties: false,
}

/**
 * @param {object} input
 * @param {string} [input.text]       pasted notes
 * @param {string} [input.pdfBase64]  a PDF, base64 without the data: prefix
 * @param {string} [input.fileName]
 * @returns {Promise<object>} a Course with `summary` and `generated: true`
 */
export async function generateRoute(input) {
  const draft = await requestRouteDraft(input)
  return courseFromDraft(draft, { id: `${ROUTE_ID_PREFIX}${Date.now().toString(36)}` })
}

/** The model's raw draft, before ids and cleanup. Used by the backup script. */
export async function requestRouteDraft({ text: notes = '', pdfBase64 = '', fileName = '', size = 'full' }) {
  notes = notes.trim()
  if (!notes && !pdfBase64) throw new AiRequestError('Sube un PDF o pega tus apuntes.')
  if (notes.length > MAX_TEXT_CHARS) throw new AiRequestError('Los apuntes son muy largos. Pega solo el tema del parcial.')
  if (pdfBase64 && (pdfBase64.length * 3) / 4 > MAX_PDF_BYTES) {
    throw new AiRequestError('El PDF pesa más de 3 MB. Sube solo las páginas del tema.')
  }

  // The fair challenge only needs five questions: a short route comes back faster.
  const ask = size === 'mini'
    ? 'Arma una ruta corta: 1 módulo con 2 lecciones, para un reto de 5 preguntas.'
    : 'Arma mi ruta de estudio.'
  const request = notes
    ? `Estos son mis apuntes:\n\n<apuntes>\n${notes}\n</apuntes>\n\n${ask}`
    : `${ask} Usa este material.`

  return requestJson({ system: SYSTEM_PROMPT, text: request, schema: ROUTE_SCHEMA, pdfBase64, fileName, tag: 'generar-ruta' })
}
