import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { routeStore } from '../../app/courseCatalog.js'
import { CHALLENGE_TOPICS } from '../../content/challenges/index.js'
import { addDays, todayIso } from '../../core/routes/studyPlan.js'
import Panel from '../../ui/Panel.jsx'
import Leaderboard from './Leaderboard.jsx'
import { leaderboard } from './leaderboardStore.js'
import { CHALLENGE_BOARD_PATH, challengePlayPath, OWN_TOPIC_ID } from './paths.js'
import '../routes/routes.css'
import './challenge.css'

const OWN_TOPIC_TIMEOUT_MS = 90_000
const MIN_NOTES_CHARS = 80

function ChallengeHomePage() {
  const navigate = useNavigate()
  const [top] = useState(() => leaderboard.top(todayIso(), 5))
  const [notes, setNotes] = useState('')
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

  async function handleOwnTopic(event) {
    event.preventDefault()
    if (notes.trim().length < MIN_NOTES_CHARS) return
    const controller = new AbortController()
    abortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), OWN_TOPIC_TIMEOUT_MS)
    setStatus('working')
    setElapsed(0)
    setError('')

    try {
      const response = await fetch('/api/generar-ruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: notes, size: 'mini' }),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.course) throw new Error(data.error ?? 'No pudimos armar tu reto.')

      // The route stays: after the round the visitor can open the full plan.
      const today = todayIso()
      routeStore.save({ course: data.course, examDate: addDays(today, 7), startDate: today, createdAt: new Date().toISOString(), source: 'ia' })
      navigate(challengePlayPath(OWN_TOPIC_ID, data.course.id))
    } catch (caught) {
      if (abortRef.current !== controller) return
      setStatus('error')
      setError(controller.signal.aborted ? 'La IA tardó demasiado. Prueba con un tema de la lista.' : caught.message)
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <section className="reto-home">
      <header className="reto-home__hero">
        <p className="label">Reto APROPIA</p>
        <h1>
          5 preguntas. <span className="mark">Contra el reloj.</span>
        </h1>
        <p>Elige un tema, responde rápido y entra al ranking del día. La última pregunta te pide explicar con tus palabras, y la IA te dice qué te faltó.</p>
      </header>

      <div className="reto-home__layout">
        <div className="reto-home__main">
          <h2 className="label">Elige tu reto</h2>
          <ul className="reto-topics">
            {CHALLENGE_TOPICS.map((topic) => (
              <li key={topic.id}>
                <Link to={challengePlayPath(topic.id)} className="reto-topic">
                  <span className="reto-topic__title">{topic.title}</span>
                  <span className="reto-topic__meta">{topic.subtitle}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Panel as="section" className="reto-own" aria-labelledby="reto-own-title">
            <h2 id="reto-own-title" className="reto-own__title">
              Trae tu tema
            </h2>
            {status === 'working' ? (
              <div className="reto-own__working" aria-live="polite">
                <p className="state state--proceso">La IA está armando tu reto con tus apuntes</p>
                <p className="notes__elapsed">{Math.round(elapsed / 1000)} s</p>
              </div>
            ) : (
              <form onSubmit={handleOwnTopic} className="notes__form">
                <label className="notes__field">
                  <span>Pega un párrafo de tus apuntes o de una guía. La IA arma las preguntas en unos segundos.</span>
                  <textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Por ejemplo: la definición de derivada, las reglas que viste en clase…" />
                </label>
                {error && (
                  <p role="alert" className="notes__error">
                    {error}
                  </p>
                )}
                <button type="submit" className="btn-secondary" disabled={notes.trim().length < MIN_NOTES_CHARS}>
                  Armar mi reto
                </button>
              </form>
            )}
          </Panel>
        </div>

        <Panel as="aside" featured className="reto-home__board" aria-label="Top del día">
          <h2 className="label">Top del día</h2>
          <Leaderboard entries={top} />
          <Link to={CHALLENGE_BOARD_PATH} className="reto-home__board-link">
            Abrir el ranking en pantalla completa
          </Link>
        </Panel>
      </div>
    </section>
  )
}

export default ChallengeHomePage
