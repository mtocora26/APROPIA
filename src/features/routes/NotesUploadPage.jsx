import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { routeStore } from '../../app/courseCatalog.js'
import { SAMPLE_NOTES_NAME, SAMPLE_NOTES_URL, sampleRouteCourse } from '../../content/routes/index.js'
import { addDays, todayIso } from '../../core/routes/studyPlan.js'
import Icon from '../../ui/Icon.jsx'
import Panel from '../../ui/Panel.jsx'
import { routePlanPath } from './paths.js'
import './routes.css'

const MAX_PDF_BYTES = 3 * 1024 * 1024
// Past this point the demo offers the precomputed route instead of waiting.
const SLOW_AFTER_MS = 25_000
const GIVE_UP_AFTER_MS = 150_000

const STEPS = ['Leyendo tu material', 'Ordenando los temas', 'Escribiendo la práctica', 'Revisando los ejercicios']

function NotesUploadPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [examDate, setExamDate] = useState(() => addDays(todayIso(), 7))
  const [status, setStatus] = useState('idle') // idle | working | error
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const abortRef = useRef(null)

  useEffect(() => {
    if (status !== 'working') return undefined
    const started = Date.now()
    const timer = setInterval(() => setElapsed(Date.now() - started), 500)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => () => abortRef.current?.abort(), [])

  const today = todayIso()
  const hasMaterial = Boolean(file || text.trim())

  function saveAndOpen(course, source) {
    routeStore.save({ course, examDate, startDate: todayIso(), createdAt: new Date().toISOString(), source })
    navigate(routePlanPath(course.id))
  }

  function chooseSample() {
    const pending = abortRef.current
    abortRef.current = null
    pending?.abort()
    saveAndOpen(sampleRouteCourse(), 'ejemplo')
  }

  async function loadSampleNotes() {
    const response = await fetch(SAMPLE_NOTES_URL)
    setFile(null)
    setText(await response.text())
  }

  function handleFile(event) {
    const picked = event.target.files?.[0] ?? null
    setError('')
    if (picked && picked.type === 'application/pdf' && picked.size > MAX_PDF_BYTES) {
      setError('El PDF pesa más de 3 MB. Sube solo las páginas del tema.')
      event.target.value = ''
      return
    }
    setFile(picked)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!hasMaterial) return

    const controller = new AbortController()
    abortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), GIVE_UP_AFTER_MS)
    setStatus('working')
    setElapsed(0)
    setError('')

    try {
      const body = { text }
      if (file?.type === 'application/pdf') {
        body.pdfBase64 = await toBase64(file)
        body.fileName = file.name
      } else if (file) {
        body.text = `${await file.text()}\n\n${text}`.trim()
      }

      const response = await fetch('/api/generar-ruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.course) throw new Error(data.error ?? 'No pudimos armar la ruta.')

      saveAndOpen(data.course, 'ia')
    } catch (caught) {
      if (controller.signal.aborted && abortRef.current !== controller) return
      setStatus('error')
      setError(controller.signal.aborted ? 'La IA tardó demasiado en responder.' : caught.message)
    } finally {
      clearTimeout(timeout)
    }
  }

  if (status === 'working') {
    const step = Math.min(STEPS.length - 1, Math.floor(elapsed / 9000))
    return (
      <section className="notes" aria-live="polite">
        <Panel featured className="notes__working">
          <p className="label">Armando tu ruta</p>
          <ol className="notes__steps">
            {STEPS.map((label, i) => (
              <li key={label} className={`state state--${i < step ? 'dominio' : i === step ? 'proceso' : 'pendiente'}`}>
                {label}
              </li>
            ))}
          </ol>
          <p className="notes__elapsed">{Math.round(elapsed / 1000)} s</p>
          {elapsed > SLOW_AFTER_MS && (
            <p>
              Está tardando más de lo normal.{' '}
              <button type="button" className="notes__link" onClick={chooseSample}>
                Usar la ruta de ejemplo
              </button>
            </p>
          )}
        </Panel>
      </section>
    )
  }

  return (
    <section className="notes">
      <Link to="/inicio" className="app-back">
        <Icon name="back" size={16} /> Volver a rutas
      </Link>
      <h1>Sube tus apuntes</h1>
      <p className="notes__lead">
        Apropia arma una ruta de estudio con fecha a partir de tu material. Primero practicas; la respuesta viene después.
      </p>

      <form className="notes__form" onSubmit={handleSubmit}>
        <label className="notes__field">
          <span className="label">Material (PDF o texto)</span>
          <input type="file" accept="application/pdf,.pdf,text/plain,.txt,.md" onChange={handleFile} />
          {file && <small>{file.name}</small>}
        </label>

        <label className="notes__field">
          <span className="label">O pega tus apuntes</span>
          <textarea rows={10} value={text} onChange={(event) => setText(event.target.value)} placeholder="Pega aquí la guía, las diapositivas o tus notas del tema." />
        </label>
        <p className="notes__hint">
          ¿Sin material a mano?{' '}
          <button type="button" className="notes__link" onClick={loadSampleNotes}>
            Cargar {SAMPLE_NOTES_NAME}
          </button>
        </p>

        <label className="notes__field notes__field--date">
          <span className="label">Fecha del parcial</span>
          <input type="date" value={examDate} min={today} onChange={(event) => setExamDate(event.target.value)} required />
        </label>

        {error && (
          <p role="alert" className="notes__error">
            {error}{' '}
            <button type="button" className="notes__link" onClick={chooseSample}>
              Usar la ruta de ejemplo
            </button>
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={!hasMaterial || !examDate}>
          Armar mi ruta
        </button>
      </form>
    </section>
  )
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('No pudimos leer el archivo.'))
    reader.readAsDataURL(file)
  })
}

export default NotesUploadPage
