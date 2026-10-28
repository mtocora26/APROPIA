import { aiErrorResponse, readJson } from '../server/aiErrors.js'
import { evaluateExplanation } from '../server/evaluarExplicacion.js'

// POST /api/evaluar-explicacion  { question, modelAnswer, answer }  →  { verdict, feedback }
export async function POST(request) {
  const input = await readJson(request)
  if (!input) return Response.json({ error: 'La solicitud no es JSON válido.' }, { status: 400 })

  try {
    return Response.json(await evaluateExplanation(input))
  } catch (error) {
    return aiErrorResponse(error, 'evaluar-explicacion')
  }
}
