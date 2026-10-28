import { aiErrorResponse, readJson } from '../server/aiErrors.js'
import { generateRoute } from '../server/generarRuta.js'

// POST /api/generar-ruta  { text?, pdfBase64?, fileName? }  →  { course }
export async function POST(request) {
  const input = await readJson(request)
  if (!input) return Response.json({ error: 'La solicitud no es JSON válido.' }, { status: 400 })

  try {
    return Response.json({ course: await generateRoute(input) })
  } catch (error) {
    return aiErrorResponse(error, 'generar-ruta')
  }
}
