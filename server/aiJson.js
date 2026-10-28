import Anthropic from '@anthropic-ai/sdk'

/**
 * One JSON answer from the configured model. Runs only on the server: the API
 * key never reaches the browser. Both providers fill a fixed JSON schema
 * (structured outputs), so the answer is always parseable.
 *
 *   GEMINI_API_KEY     → Gemini (GEMINI_MODEL: comma-separated, tried in order)
 *   ANTHROPIC_API_KEY  → Claude (APROPIA_MODEL, default claude-opus-5-5)
 *   AI_PROVIDER=gemini|claude picks one when both keys are set.
 */

const CLAUDE_MODEL = process.env.APROPIA_MODEL || 'claude-opus-5-5'
const CLAUDE_EFFORT = process.env.APROPIA_EFFORT || 'low'
// Free-tier models get saturated (503) at peak hours: the next one is tried.
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-3.6-flash,gemini-3.5-flash-lite')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean)
const GEMINI_ATTEMPT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 75_000
const GEMINI_RETRY_STATUSES = new Set([429, 500, 503, 504])
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

/** The request or the material cannot be processed; the message is for the student. */
export class AiRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AiRequestError'
  }
}

export class ProviderNotConfiguredError extends Error {
  constructor() {
    super('No hay GEMINI_API_KEY ni ANTHROPIC_API_KEY')
    this.name = 'ProviderNotConfiguredError'
  }
}

/** Gemini answered with an HTTP error; `status` 429 means the free quota ran out. */
export class GeminiError extends Error {
  constructor(status, message) {
    super(`Gemini ${status}: ${message}`)
    this.name = 'GeminiError'
    this.status = status
  }
}

const BLOCKED = 'No pudimos procesar este material. Prueba con otro.'

export function activeProvider(env = process.env) {
  const wanted = env.AI_PROVIDER?.toLowerCase()
  if (wanted === 'gemini' && env.GEMINI_API_KEY) return 'gemini'
  if (wanted === 'claude' && env.ANTHROPIC_API_KEY) return 'claude'
  if (env.GEMINI_API_KEY) return 'gemini'
  if (env.ANTHROPIC_API_KEY) return 'claude'
  return null
}

/**
 * @param {object} request
 * @param {string} request.system
 * @param {string} request.text
 * @param {object} request.schema       JSON Schema of the answer
 * @param {string} [request.pdfBase64]
 * @param {string} [request.fileName]
 * @param {number} [request.maxTokens]
 * @param {number} [request.attemptMs]  per-model timeout (Gemini)
 * @param {string} [request.tag]        name used in the server logs
 */
export async function requestJson(request) {
  const provider = activeProvider()
  if (provider === 'gemini') return requestFromGemini(request)
  if (provider === 'claude') return requestFromClaude(request)
  throw new ProviderNotConfiguredError()
}

async function requestFromGemini({ system, text, schema, pdfBase64, maxTokens = 32000, attemptMs = GEMINI_ATTEMPT_MS, tag = 'ia' }) {
  const parts = []
  if (pdfBase64) parts.push({ inline_data: { mime_type: 'application/pdf', data: pdfBase64 } })
  parts.push({ text })

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
      maxOutputTokens: maxTokens,
    },
  })

  let lastError
  for (const model of GEMINI_MODELS) {
    try {
      return await callGemini(model, body, attemptMs)
    } catch (error) {
      const retryable = error.name === 'TimeoutError' || (error instanceof GeminiError && GEMINI_RETRY_STATUSES.has(error.status))
      if (!retryable) throw error
      console.warn(`${tag}: ${model} no respondió (${error.message}), probando el siguiente`)
      lastError = error
    }
  }
  throw lastError.name === 'TimeoutError' ? new GeminiError(504, lastError.message) : lastError
}

async function callGemini(model, body, attemptMs) {
  const response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body,
    signal: AbortSignal.timeout(attemptMs),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new GeminiError(response.status, data.error?.message ?? response.statusText)

  const candidate = data.candidates?.[0]
  if (!candidate) throw new AiRequestError(BLOCKED)
  if (candidate.finishReason === 'MAX_TOKENS') throw new Error('La respuesta quedó incompleta (MAX_TOKENS).')
  if (candidate.finishReason && candidate.finishReason !== 'STOP') throw new AiRequestError(BLOCKED)

  // Thinking models may add thought parts; the JSON is in the regular text parts.
  const json = (candidate.content?.parts ?? [])
    .filter((part) => typeof part.text === 'string' && !part.thought)
    .map((part) => part.text)
    .join('')
  if (!json) throw new Error('La respuesta llegó vacía.')
  return JSON.parse(json)
}

async function requestFromClaude({ system, text, schema, pdfBase64, fileName, maxTokens = 32000 }) {
  const content = []
  if (pdfBase64) {
    content.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
      ...(fileName && { title: fileName }),
    })
  }
  content.push({ type: 'text', text })

  const message = await new Anthropic().beta.messages
    .stream({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: CLAUDE_EFFORT, format: { type: 'json_schema', schema } },
      system,
      messages: [{ role: 'user', content }],
    })
    .finalMessage()

  if (message.stop_reason === 'refusal') throw new AiRequestError(BLOCKED)
  if (message.stop_reason === 'max_tokens') throw new Error('La respuesta quedó incompleta (max_tokens).')

  const json = message.content.find((block) => block.type === 'text')?.text
  if (!json) throw new Error('La respuesta llegó vacía.')
  return JSON.parse(json)
}
