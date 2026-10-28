import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CHALLENGE_TOPICS } from '../../content/challenges/index.js'
import { SAMPLE_NOTES } from '../../content/challenges/sampleNotes.js'
import { todayIso } from '../../core/routes/studyPlan.js'
import Icon from '../../ui/Icon.jsx'
import Panel from '../../ui/Panel.jsx'
import Leaderboard from './Leaderboard.jsx'
import { leaderboard } from './leaderboardStore.js'
import { saveOwnChallenge } from './ownChallenge.js'
import { CHALLENGE_BOARD_PATH, challengePlayPath, OWN_TOPIC_ID } from './paths.js'
import '../routes/routes.css'
import './challenge.css'

const OWN_TOPIC_TIMEOUT_MS = 45_000
const MIN_TOPIC_CHARS = 3
const MIN_NOTES_CHARS = 80
const MAX_TOPIC_CHARS = 80

function ChallengeHomePage() {
  const navigate = useNavigate()
  const [top] = useState(() => leaderboard.top(todayIso(), 5))
  const [ownTopic, setOwnTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
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

  const canBuild = ownTopic.trim().length >= MIN_TOPIC_CHARS || notes.trim().length >= MIN_NOTES_CHARS

  async function handleOwnTopic(event) {
    event.preventDefault()
    if (!canBuild) return
    const controller = new AbortController()
    abortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), OWN_TOPIC_TIMEOUT_MS)
    setStatus('working')
    setElapsed(0)
    setError('')

    try {
      const response = await fetch('/api/generar-reto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: ownTopic, notes: showNotes ? notes : '' }),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.questions) throw new Error(data.error ?? 'No pudimos armar tu reto.')

      saveOwnChallenge({ title: data.title, questions: data.questions })
      navigate(challengePlayPath(OWN_TOPIC_ID))
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
        <h1>
          5 preguntas. <span className="mark">Contra el reloj.</span>
        </h1>
        <p>Elige un tema, responde rápido y entra al ranking del día. La última pregunta te pide explicarlo con tus palabras, y la IA te dice qué te faltó.</p>
      </header>

      <div className="reto-home__layout">
        <div className="reto-home__main">
          <h2 className="reto-home__heading">Elige tu reto</h2>
          <ul className="reto-topics">
            {CHALLENGE_TOPICS.map((topic, i) => (
              <li key={topic.id} style={{ '--i': i }}>
                <Link to={challengePlayPath(topic.id)} className="reto-topic">
                  <span className="reto-topic__title">{topic.title}</span>
                  <span className="reto-topic__meta">{topic.subtitle}</span>
                  <span className="reto-topic__go">
                    5 preguntas · 2 min
                    <Icon name="forward" size={20} />
                  </span>
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
                <p className="state state--proceso">La IA está escribiendo tus 5 preguntas</p>
                <p className="notes__elapsed">{Math.round(elapsed / 1000)} s</p>
              </div>
            ) : (
              <form onSubmit={handleOwnTopic} className="notes__form">
                <label className="notes__field">
                  <span>Escribe lo que estás estudiando y la IA arma tus 5 preguntas en unos segundos.</span>
                  <input
                    type="text"
                    className="reto-own__topic"
                    value={ownTopic}
                    onChange={(event) => setOwnTopic(event.target.value)}
                    maxLength={MAX_TOPIC_CHARS}
                    placeholder="Ej.: leyes de Newton, la Revolución francesa, verbos en inglés"
                    autoComplete="off"
                  />
                </label>
                {showNotes ? (
                  <div className="reto-own__notes">
                    <label className="notes__field">
                      <span>Tus apuntes (opcional): la IA pregunta solo sobre lo que pegues.</span>
                      <textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={4000} placeholder="Pega un párrafo de tu guía o tus notas." />
                    </label>
                    <p className="reto-own__tip">
                      Funciona mejor con 3 a 6 frases que tengan definiciones, reglas o datos concretos. Mira un ejemplo:
                    </p>
                    <div className="reto-own__samples">
                      {SAMPLE_NOTES.map((sample) => (
                        <button
                          key={sample.topic}
                          type="button"
                          className="reto-own__sample"
                          onClick={() => {
                            setOwnTopic(sample.topic)
                            setNotes(sample.notes)
                          }}
                        >
                          {sample.topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button type="button" className="notes__link reto-own__more" onClick={() => setShowNotes(true)}>
                    Pegar un párrafo de mis apuntes
                  </button>
                )}
                {error && (
                  <p role="alert" className="notes__error">
                    {error}
                  </p>
                )}
                <button type="submit" className="btn-secondary" disabled={!canBuild}>
                  Armar mi reto
                </button>
              </form>
            )}
          </Panel>
        </div>

        <Panel as="aside" featured className="reto-home__board" aria-label="Top del día">
          <h2 className="reto-home__heading">Top del día</h2>
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
