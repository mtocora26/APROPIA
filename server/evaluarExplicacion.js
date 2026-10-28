import { AiRequestError, GEMINI_FAST_MODELS, requestJson } from './aiJson.js'

/**
 * Judges a "explica con tus palabras" answer in two parts: what the student
 * got right and what is missing, as a hint. The AI never hands over the model
 * answer; the page shows it only after the student has written theirs.
 */

const MAX_ANSWER_CHARS = 1200
// Per model: two attempts must fit inside the page's 15 s before it falls back to self-rating.
const ATTEMPT_MS = 7_000

const SYSTEM_PROMPT = `Eres un tutor de Apropia. Evalúas si la explicación de un estudiante muestra que comprende la idea central de la pregunta.
- "ok": la idea central está, aunque use otras palabras o le falten detalles menores.
- "partial": va por buen camino pero le falta una parte importante.
- "miss": no responde la pregunta o la idea es incorrecta.
Responde en dos partes, cada una de una sola frase corta, de «tú», en español, directo: sin emojis, sin exclamaciones y sin elogios efusivos («¡Muy bien!», «¡Excelente!»).
- "good": qué parte de la idea sí está en su explicación, nombrándola («Explicas que…»). Si el veredicto es "ok" nunca lo dejes vacío. Si es "miss" y no hay nada rescatable, déjalo vacío.
- "missing": qué le falta, como una pista o una pregunta que lo oriente. Si el veredicto es "ok", déjalo vacío.
Empieza cada frase con mayúscula y termínala con punto o signo de interrogación.
Nunca copies ni reveles la respuesta modelo.`

const SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['ok', 'partial', 'miss'] },
    good: { type: 'string' },
    missing: { type: 'string' },
  },
  required: ['verdict', 'good', 'missing'],
  additionalProperties: false,
}

/**
 * @param {{ question: string, modelAnswer: string, answer: string }} input
 * @returns {Promise<{ verdict: 'ok' | 'partial' | 'miss', good: string, missing: string }>}
 */
export async function evaluateExplanation({ question = '', modelAnswer = '', answer = '' }) {
  answer = answer.trim()
  if (!question.trim() || !modelAnswer.trim()) throw new AiRequestError('Falta la pregunta.')
  if (!answer) throw new AiRequestError('Escribe tu explicación.')
  if (answer.length > MAX_ANSWER_CHARS) throw new AiRequestError('La explicación es muy larga. Resúmela en pocas frases.')

  const result = await requestJson({
    system: SYSTEM_PROMPT,
    text: `<pregunta>${question}</pregunta>\n<respuesta_modelo>${modelAnswer}</respuesta_modelo>\n<explicacion_estudiante>${answer}</explicacion_estudiante>`,
    schema: SCHEMA,
    maxTokens: 1500,
    attemptMs: ATTEMPT_MS,
    models: GEMINI_FAST_MODELS,
    tag: 'evaluar-explicacion',
  })

  if (!['ok', 'partial', 'miss'].includes(result.verdict)) {
    throw new Error('La evaluación no trajo el formato esperado.')
  }
  const good = typeof result.good === 'string' ? result.good.trim() : ''
  const missing = result.verdict === 'ok' || typeof result.missing !== 'string' ? '' : result.missing.trim()
  return { verdict: result.verdict, good, missing }
}
