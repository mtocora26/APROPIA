import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routeStore } from '../../app/courseCatalog.js'
import { exercisesByLesson, findChallengeTopic } from '../../content/challenges/index.js'
import { isExplanation, pickQuestions, POINTS, scoreAnswer, summarize, timeLimitFor } from '../../core/challenge/challenge.js'
import { normalizeAlias, ALIAS_MAX_LENGTH } from '../../core/challenge/leaderboard.js'
import { todayIso } from '../../core/routes/studyPlan.js'
import { STATE_LABELS } from '../course/courseMap.js'
import { ANSWER_COMPONENTS } from '../exercises/types/answerComponents.js'
import ExercisePrompt from '../exercises/types/ExercisePrompt.jsx'
import { checkAnswer, correctAnswerText, prepareExercise } from '../exercises/types/exerciseLogic.js'
import { routePlanPath } from '../routes/paths.js'
import Icon from '../../ui/Icon.jsx'
import Panel from '../../ui/Panel.jsx'
import ExplanationAnswer from './ExplanationAnswer.jsx'
import Leaderboard from './Leaderboard.jsx'
import { leaderboard } from './leaderboardStore.js'
import { CHALLENGE_PATH, OWN_TOPIC_ID } from './paths.js'
import QuestionTimer from './QuestionTimer.jsx'
import '../exercises/ExerciseContainer.css'
import '../exercises/types/exerciseTypes.css'
import './challenge.css'

// After saving, the booth goes back to the start screen for the next visitor.
const KIOSK_RESET_MS = 45_000

function ChallengePlayPage() {
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const [round, setRound] = useState(0)

  const ownRoute = topicId === OWN_TOPIC_ID ? routeStore.get(searchParams.get('ruta') ?? '') : null
  const topic = ownRoute
    ? { id: OWN_TOPIC_ID, title: ownRoute.course.title, course: () => ownRoute.course }
    : findChallengeTopic(topicId)

  if (!topic) {
    return (
      <p>
        No encontramos este reto. <Link to={CHALLENGE_PATH}>Elige otro tema</Link>
      </p>
    )
  }

  // A new key remounts the round: new questions, clock and score.
  return <ChallengeRound key={`${topicId}-${round}`} topic={topic} ownRoute={ownRoute} onReplay={() => setRound((n) => n + 1)} />
}

function ChallengeRound({ topic, ownRoute, onReplay }) {
  const [course] = useState(() => topic.course())
  const context = { alphabet: course.alphabet }
  const [items] = useState(() =>
    pickQuestions(exercisesByLesson(course)).map((exercise) => prepareExercise(exercise, { alphabet: course.alphabet })),
  )
  const [phase, setPhase] = useState('ready') // ready | question | feedback | done
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [startedAt, setStartedAt] = useState(0)

  const item = items[index]
  const limitMs = item ? timeLimitFor(item) : null
  const last = answers.at(-1)

  function startQuestion(nextIndex) {
    setIndex(nextIndex)
    setStartedAt(Date.now())
    setPhase('question')
  }

  function record({ correct, points, value = null, timedOut = false }) {
    setAnswers((list) => [...list, { itemId: item.id, correct, points, value, timedOut }])
    setPhase('feedback')
  }

  function handleAnswer(value) {
    if (phase !== 'question') return
    if (isExplanation(item)) {
      const verdict = value?.verdict ?? (value?.selfRating === 'ok' ? 'ok' : 'miss')
      const correct = verdict === 'ok'
      const points = correct ? POINTS.explanation : verdict === 'partial' ? POINTS.partialExplanation : 0
      record({ correct, points, value: { ...value, verdict } })
      return
    }
    const correct = checkAnswer(value, item, context)
    const combo = correct ? streakBefore(answers) + 1 : 0
    const points = scoreAnswer({ correct, elapsedMs: Date.now() - startedAt, limitMs, combo })
    record({ correct, points, value })
  }

  function handleTimeout() {
    if (phase === 'question') record({ correct: false, points: 0, timedOut: true })
  }

  function handleNext() {
    if (index + 1 < items.length) startQuestion(index + 1)
    else setPhase('done')
  }

  if (items.length === 0) {
    return (
      <p>
        Este tema no tiene preguntas para el reto. <Link to={CHALLENGE_PATH}>Elige otro</Link>
      </p>
    )
  }

  if (phase === 'ready') {
    return (
      <section className="reto-play reto-ready">
        <Link to={CHALLENGE_PATH} className="app-back">
          <Icon name="back" size={16} /> Elegir otro tema
        </Link>
        <p className="label">Reto APROPIA</p>
        <h1>{topic.title}</h1>
        <ul className="reto-ready__rules">
          <li>{items.length} preguntas contra el reloj.</li>
          <li>Responder rápido da más puntos. Acertar seguido, todavía más.</li>
          {items.some(isExplanation) && <li>La última es para explicar con tus palabras: la IA te dice qué te faltó.</li>}
        </ul>
        <button type="button" className="btn-primary reto-ready__start" onClick={() => startQuestion(0)} autoFocus>
          Empezar el reto
        </button>
      </section>
    )
  }

  if (phase === 'done') {
    return <ChallengeResult topic={topic} ownRoute={ownRoute} answers={answers} onReplay={onReplay} />
  }

  const Answer = isExplanation(item) ? ExplanationAnswer : ANSWER_COMPONENTS[item.type]
  const score = answers.reduce((sum, answer) => sum + answer.points, 0)
  const streak = streakBefore(answers)

  return (
    <section className="reto-play">
      <header className="reto-play__header">
        <span className="label">
          Pregunta {index + 1} de {items.length}
        </span>
        <span className="reto-play__score">
          {streak >= 2 && <span className="reto-play__streak">Racha ×{streak}</span>}
          <span className="label">Puntos</span> {score}
        </span>
      </header>

      {limitMs ? (
        <QuestionTimer key={`timer-${item.id}`} limitMs={limitMs} startedAt={startedAt} running={phase === 'question'} onExpire={handleTimeout} />
      ) : (
        <p className="reto-play__untimed">Sin reloj: tómate el tiempo de explicarlo bien.</p>
      )}

      <Panel featured className="exercise__prompt">
        <ExercisePrompt exercise={item} />
      </Panel>

      <div key={`answer-${item.id}`} className="exercise__answer">
        <Answer exercise={item} onAnswer={handleAnswer} disabled={phase !== 'question'} language={course.language} theory={[]} />
      </div>

      {phase === 'feedback' && last && (
        <div className={`exercise__feedback exercise__feedback--${last.correct ? 'correct' : 'incorrect'}`} role="status">
          <p className="exercise__feedback-title">
            {last.timedOut ? 'Se acabó el tiempo' : feedbackTitle(item, last)}
            {last.points > 0 && <span className="reto-play__gain"> +{last.points}</span>}
          </p>
          {isExplanation(item) && last.value?.feedback && <p className="reto-play__ai">{last.value.feedback}</p>}
          {!isExplanation(item) && !last.correct && (
            <p className="exercise-feedback__answer">
              Respuesta: <strong>{correctAnswerText(item, context)}</strong>
            </p>
          )}
          {item.explanation && !isExplanation(item) && <p className="exercise-feedback__explanation">{item.explanation}</p>}
          <button type="button" onClick={handleNext} autoFocus>
            {index + 1 < items.length ? 'Siguiente' : 'Ver mi puntaje'}
          </button>
        </div>
      )}
    </section>
  )
}

function ChallengeResult({ topic, ownRoute, answers, onReplay }) {
  const navigate = useNavigate()
  const summary = summarize(answers)
  const day = todayIso()
  const [alias, setAlias] = useState('')
  const [saved, setSaved] = useState(null) // { entry, rank }
  const [board, setBoard] = useState(() => leaderboard.top(day, 10))

  useEffect(() => {
    if (!saved) return undefined
    const timer = setTimeout(() => navigate(CHALLENGE_PATH), KIOSK_RESET_MS)
    return () => clearTimeout(timer)
  }, [saved, navigate])

  function handleSave(event) {
    event.preventDefault()
    if (!normalizeAlias(alias)) return
    const result = leaderboard.add({ alias, score: summary.score, correct: summary.correct, total: summary.total, topic: topic.title, day })
    setSaved(result)
    setBoard(leaderboard.top(day, 10))
  }

  return (
    <section className="reto-play reto-result">
      <p className="label">Reto · {topic.title}</p>
      <p className="reto-result__score">
        {summary.score}
        <span className="label">puntos</span>
      </p>
      <p className="reto-result__line">
        {summary.correct} de {summary.total} bien · <span className={`state state--${summary.mastery}`}>{STATE_LABELS[summary.mastery]}</span>
      </p>

      {saved ? (
        <p className="reto-result__rank" role="status">
          {saved.rank === 1 ? 'Vas de primero hoy.' : `Quedaste en el puesto ${saved.rank} de hoy.`}
        </p>
      ) : (
        <form className="reto-result__form" onSubmit={handleSave}>
          <label className="notes__field">
            <span className="label">Tu alias para el ranking</span>
            <input
              type="text"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              maxLength={ALIAS_MAX_LENGTH}
              autoComplete="off"
              autoFocus
              placeholder="Ej.: Ana de Sistemas"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={!normalizeAlias(alias)}>
            Guardar en el ranking
          </button>
        </form>
      )}

      <Panel as="section" className="reto-result__board">
        <h2 className="label">Top del día</h2>
        <Leaderboard entries={board} highlightId={saved?.entry.id} />
      </Panel>

      <div className="reto-result__actions">
        <Link to={CHALLENGE_PATH} className="btn-primary">
          Siguiente jugador
        </Link>
        <button type="button" className="btn-secondary" onClick={onReplay}>
          Jugar otra vez
        </button>
        {ownRoute && (
          <Link to={routePlanPath(ownRoute.course.id)} className="btn-secondary">
            Ver tu ruta completa
          </Link>
        )}
      </div>
    </section>
  )
}

function feedbackTitle(item, answer) {
  if (isExplanation(item)) {
    if (answer.value?.verdict === 'partial') return 'Vas por buen camino'
    return answer.correct ? 'Lo explicaste' : 'Reforzar'
  }
  return answer.correct ? 'Correcto' : 'Reforzar'
}

function streakBefore(answers) {
  let streak = 0
  for (let i = answers.length - 1; i >= 0 && answers[i].correct; i -= 1) streak += 1
  return streak
}

export default ChallengePlayPage
