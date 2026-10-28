import { aiErrorResponse, readJson } from '../server/aiErrors.js'
import { generateChallenge } from '../server/generarReto.js'

// POST /api/generar-reto  { topic?, notes? }  →  { title, questions }
export async function POST(request) {
  const input = await readJson(request)
  if (!input) return Response.json({ error: 'La solicitud no es JSON válido.' }, { status: 400 })

  try {
    return Response.json(await generateChallenge(input))
  } catch (error) {
    return aiErrorResponse(error, 'generar-reto')
  }
}
