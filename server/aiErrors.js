import Anthropic from '@anthropic-ai/sdk'
import { AiRequestError, GeminiError, ProviderNotConfiguredError } from './aiJson.js'

const NOT_CONFIGURED = 'El servicio de IA no está configurado.'
const BUSY = 'El servicio de IA está ocupado. Intenta en un minuto.'

/** Maps an AI failure to the HTTP answer the page shows. */
export function aiErrorResponse(error, tag) {
  if (error instanceof AiRequestError) {
    return Response.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof ProviderNotConfiguredError) {
    console.error(`${tag}: falta GEMINI_API_KEY o ANTHROPIC_API_KEY`)
    return Response.json({ error: NOT_CONFIGURED }, { status: 503 })
  }
  if (error instanceof GeminiError && (error.status === 401 || error.status === 403)) {
    console.error(`${tag}:`, error.message)
    return Response.json({ error: NOT_CONFIGURED }, { status: 503 })
  }
  if (error instanceof GeminiError && [429, 503, 504].includes(error.status)) {
    console.error(`${tag}: Gemini saturado o sin cuota:`, error.message)
    return Response.json({ error: BUSY }, { status: 503 })
  }
  if (error instanceof Anthropic.AuthenticationError) {
    console.error(`${tag}: ANTHROPIC_API_KEY inválida`)
    return Response.json({ error: NOT_CONFIGURED }, { status: 503 })
  }
  if (error instanceof Anthropic.RateLimitError) {
    return Response.json({ error: BUSY }, { status: 503 })
  }
  console.error(`${tag}:`, error)
  return Response.json({ error: 'La IA no pudo responder. Intenta de nuevo.' }, { status: 502 })
}

export async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}
