import { useState } from 'react'
import PseintSandbox from './PseintSandbox.jsx'
import { EXAMPLES } from './examples.js'

/** Laboratorio libre: ejecuta cualquier programa de PSeInt, o carga un ejemplo del curso. */
function LabPage() {
  const [code, setCode] = useState(EXAMPLES[0].code)
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id)

  function load(id) {
    setExampleId(id)
    setCode(EXAMPLES.find((item) => item.id === id).code)
  }

  return (
    <section className="lab">
      <h1 className="page-title">Laboratorio</h1>
      <p>Escribe PSeInt y ejecútalo. Usa «Paso a paso» para ver qué hace cada línea con las variables.</p>
      <label className="lab__examples">
        Cargar un ejemplo
        <select value={exampleId} onChange={(event) => load(event.target.value)}>
          {EXAMPLES.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
      </label>
      {/* key: al cambiar de ejemplo el sandbox vuelve a empezar */}
      <PseintSandbox key={exampleId} code={code} onCodeChange={setCode} rows={16} />
    </section>
  )
}

export default LabPage
