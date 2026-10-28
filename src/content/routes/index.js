import { courseFromDraft } from '../../core/routes/routeFromAi.js'
import EJEMPLO_CICLOS from './ejemplo-ciclos.json' with { type: 'json' }

// Respaldo para la feria: una ruta ya generada a partir de
// public/demo/apuntes-ciclos.txt. Se usa si la IA no responde.
// Para regenerarla con la IA: node --env-file=.env.local tools/generar-respaldo.mjs
export const SAMPLE_NOTES_URL = '/demo/apuntes-ciclos.txt'
export const SAMPLE_NOTES_NAME = 'apuntes-ciclos.txt'

export function sampleRouteCourse() {
  return courseFromDraft(EJEMPLO_CICLOS, { id: 'ruta-ejemplo-ciclos' })
}
