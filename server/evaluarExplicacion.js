import { AiRequestError, requestJson } from './aiJson.js'

/**
 * Judges a "explica con tus palabras" answer. The point of Apropia is that the
 * AI makes the student think: it says what is missing without handing over
 * the model answer.
 */

const MAX_ANSWER_CHARS = 1200
// The booth cannot wait: past this the page falls back to self-rating.
const ATTEMPT_MS = 12_000

const SYSTEM_PROMPT = `Eres un tutor de Apropia. Evalúas si la explicación de un estudiante muestra que comprende la idea central de la pregunta.
- "ok": la idea central está, aunque use otras palabras o le falten detalles menores.
- "partial": va por buen camino pero le falta una parte importante.
- "miss": no responde la pregunta o la idea es incorrecta.
En "feedback" escribe máximo dos frases, de «tú», en español, sin emojis. Si acertó, di qué estuvo bien. Si falta algo, da una pista o una pregunta que lo oriente.
Nunca copies ni reveles la respuesta modelo.`

const SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['ok', 'partial', 'miss'] },
    feedback: { type: 'string' },
  },
  required: ['verdict', 'feedback'],
  additionalProperties: false,
}

/**
 * @param {{ question: string, modelAnswer: string, answer: string }} input
 * @returns {Promise<{ verdict: 'ok' | 'partial' | 'miss', feedback: string }>}
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
    maxTokens: 1000,
    attemptMs: ATTEMPT_MS,
    tag: 'evaluar-explicacion',
  })

  if (!['ok', 'partial', 'miss'].includes(result.verdict) || typeof result.feedback !== 'string') {
    throw new Error('La evaluación no trajo el formato esperado.')
  }
  return { verdict: result.verdict, feedback: result.feedback.trim() }
}
