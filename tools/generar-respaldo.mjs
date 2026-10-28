// Regenera la ruta de respaldo de la feria con la IA real, a partir de los
// apuntes de ejemplo. Necesita GEMINI_API_KEY (o ANTHROPIC_API_KEY) en el entorno.
//
//   node --env-file=.env.local tools/generar-respaldo.mjs [apuntes.txt]
import { readFile, writeFile } from 'node:fs/promises'
import { requestRouteDraft } from '../server/generarRuta.js'

const notesPath = process.argv[2] ?? 'public/demo/apuntes-ciclos.txt'
const outPath = 'src/content/routes/ejemplo-ciclos.json'

const started = Date.now()
const draft = await requestRouteDraft({ text: await readFile(notesPath, 'utf8') })
await writeFile(outPath, `${JSON.stringify(draft, null, 2)}\n`)
console.log(`Ruta guardada en ${outPath} (${((Date.now() - started) / 1000).toFixed(1)} s)`)
