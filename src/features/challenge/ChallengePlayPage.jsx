import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findChallengeTopic } from '../../content/challenges/index.js'
import { isExplanation, isTypedAnswerRight, pickQuestions, POINTS, scoreAnswer, summarize, timeLimitFor } from '../../core/challenge/challenge.js'
import { normalizeAlias, ALIAS_MAX_LENGTH } from '../../core/challenge/leaderboard.js'
import { todayIso } from '../../core/routes/studyPlan.js'
import { STATE_LABELS } from '../course/courseMap.js'
import { ANSWER_COMPONENTS } from '../exercises/types/answerComponents.js'
import ExercisePrompt from '../exercises/types/ExercisePrompt.jsx'
import { checkAnswer, correctAnswerText, prepareExercise } from '../exercises/types/exerciseLogic.js'
import Icon from '../../ui/Icon.jsx'
import Panel from '../../ui/Panel.jsx'
import ExplanationAnswer from './ExplanationAnswer.jsx'
import Leaderboard from './Leaderboard.jsx'
import { leaderboard } from './leaderboardStore.js'
import { loadOwnChallenge } from './ownChallenge.js'
import { CHALLENGE_PATH, OWN_TOPIC_ID } from './paths.js'
import QuestionTimer from './QuestionTimer.jsx'
import { useCountUp } from './useCountUp.js'
import '../exercises/ExerciseContainer.css'
import '../exercises/types/exerciseTypes.css'
import './challenge.css'

// After saving, the booth goes back to the start screen for the next visitor.
const KIOSK_RESET_MS = 45_000

function ChallengePlayPage() {
  const { topicId } = useParams()
  const [round, setRound] = useState(0)

  // The own round comes from «Trae tu tema» (sessionStorage); the rest from the banks.
  const own = topicId === OWN_TOPIC_ID ? loadOwnChallenge() : null
  const topic = own ? { id: OWN_TOPIC_ID, title: own.title, language: 'es', questions: own.questions } : findChallengeTopic(topicId)

  if (!topic) {
    return (
      <p>
        No encontramos este reto. <Link to={CHALLENGE_PATH}>Elige otro tema</Link>
      </p>
    )
  }

  // A new key remounts the round: new questions, clock and score.
  return <ChallengeRound key={`${topicId}-${round}`} topic={topic} onReplay={() => setRound((n) => n + 1)} />
}

function ChallengeRound({ topic, onReplay }) {
  const context = {}
  const [items] = useState(() => pickQuestions([topic.questions]).map((exercise) => prepareExercise(exercise)))
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
    const correct = item.type === 'typed' ? isTypedAnswerRight(value, item) : checkAnswer(value, item, context)
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
    return <ChallengeResult topic={topic} answers={answers} onReplay={onReplay} />
  }

  const Answer = isExplanation(item) ? ExplanationAnswer : ANSWER_COMPONENTS[item.type]
  const streak = streakBefore(answers)

  return (
    <section className="reto-play exercise">
      <header className="reto-play__header">
        <RoundProgress total={items.length} index={index} answers={answers} />
        <Score answers={answers} streak={streak} />
      </header>

      {limitMs ? (
        <QuestionTimer key={`timer-${item.id}`} limitMs={limitMs} startedAt={startedAt} running={phase === 'question'} onExpire={handleTimeout} />
      ) : (
        <p className="reto-play__untimed">Sin reloj: tómate el tiempo de explicarlo bien.</p>
      )}

      {/* `key` replays the entrance on every new question. */}
      <Panel key={`prompt-${item.id}`} featured className="exercise__prompt reto-play__prompt">
        <ExercisePrompt exercise={item} />
      </Panel>

      <div key={`answer-${item.id}`} className="exercise__answer">
        <Answer exercise={item} onAnswer={handleAnswer} disabled={phase !== 'question'} language={topic.language} theory={[]} />
      </div>

      {phase === 'feedback' && last && (
        <div className={`exercise__feedback exercise__feedback--${last.correct ? 'correct' : 'incorrect'}`} role="status">
          <p className="exercise__feedback-title">
            {last.timedOut ? 'Se acabó el tiempo' : feedbackTitle(item, last)}
            {last.points > 0 && <span className="reto-play__gain"> +{last.points}</span>}
          </p>
          {isExplanation(item) && <ExplanationReview review={last.value} modelAnswer={item.modelAnswer} />}
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

function ChallengeResult({ topic, answers, onReplay }) {
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
      <h1 className="reto-result__score">
        <ResultScore value={summary.score} />
        <span className="reto-result__unit">puntos</span>
      </h1>
      <p className="reto-result__line">
        {summary.correct} de {summary.total} bien en {topic.title} ·{' '}
        <span className={`state state--${summary.mastery}`}>{STATE_LABELS[summary.mastery]}</span>
      </p>

      {saved ? (
        <p className="reto-result__rank" role="status">
          {saved.rank === 1 ? 'Vas de primero hoy.' : `Quedaste en el puesto ${saved.rank} de hoy.`}
        </p>
      ) : (
        <form className="reto-result__form" onSubmit={handleSave}>
          <label className="reto-result__field">
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
        <h2 className="reto-home__heading">Top del día</h2>
        <Leaderboard entries={board} highlightId={saved?.entry.id} />
      </Panel>

      <div className="reto-result__actions">
        {/* Before saving, saving is the one primary action. */}
        <Link to={CHALLENGE_PATH} className={saved ? 'btn-primary' : 'btn-secondary'}>
          Siguiente jugador
        </Link>
        <button type="button" className="btn-secondary" onClick={onReplay}>
          Jugar otra vez
        </button>
      </div>
    </section>
  )
}

/** One block per question: done right (Dominio), to reinforce, current, pending. */
function RoundProgress({ total, index, answers }) {
  return (
    <div className="reto-progress">
      <ol className="reto-progress__blocks" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const answer = answers[i]
          let state = 'pending'
          if (answer) state = answer.correct ? 'dominio' : 'refuerzo'
          else if (i === index) state = 'current'
          return <li key={i} className={`reto-progress__block reto-progress__block--${state}`} />
        })}
      </ol>
      <span className="reto-progress__text">
        Pregunta {index + 1} de {total}
      </span>
    </div>
  )
}

function Score({ answers, streak }) {
  const total = answers.reduce((sum, answer) => sum + answer.points, 0)
  const shown = useCountUp(total)
  return (
    <p className="reto-score">
      {streak >= 2 && <span className="reto-score__streak">Racha ×{streak}</span>}
      <span className="reto-score__value">{shown}</span>
      <span className="reto-score__unit">puntos</span>
    </p>
  )
}

function ResultScore({ value }) {
  return <>{useCountUp(value, { duration: 900, from: 0 })}</>
}

/**
 * What the AI found right, what is missing, and then a possible answer: the
 * student wrote theirs first, so seeing one now is the payoff, not a shortcut.
 */
function ExplanationReview({ review, modelAnswer }) {
  return (
    <dl className="reto-review">
      {review?.good && (
        <div className="reto-review__row reto-review__row--good">
          <dt>Lo que hiciste bien</dt>
          <dd>{review.good}</dd>
        </div>
      )}
      {review?.missing && (
        <div className="reto-review__row reto-review__row--missing">
          <dt>Te falta</dt>
          <dd>{review.missing}</dd>
        </div>
      )}
      <div className="reto-review__row reto-review__row--model">
        <dt>Una respuesta posible</dt>
        <dd>{modelAnswer}</dd>
      </div>
    </dl>
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
