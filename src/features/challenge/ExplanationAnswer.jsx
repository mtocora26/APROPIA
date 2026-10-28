import { useState } from 'react'
import OpenAnswer from '../exercises/types/OpenAnswer.jsx'

// The booth cannot keep a visitor waiting: past this, the visitor rates
// their own answer, as in a normal lesson.
const AI_TIMEOUT_MS = 15_000
// One or two sentences: long enough to explain, short enough to judge fast.
const MAX_CHARS = 600
const MIN_CHARS = 10

/**
 * "Explica con tus palabras" with AI feedback. The AI says what is right and
 * what is missing; the page shows a possible answer only after this one is
 * sent. Answers `{ verdict, good, missing, text }`, or the self-rating of
 * `OpenAnswer` when the AI does not respond.
 */
function ExplanationAnswer({ exercise, onAnswer, disabled }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('writing') // writing | checking | sent | fallback
  const [showHint, setShowHint] = useState(false)
  const hint = exercise.hints?.[0]
  const ready = text.trim().length >= MIN_CHARS

  async function send() {
    if (!ready || status !== 'writing') return
    setStatus('checking')
    try {
      const response = await fetch('/api/evaluar-explicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: exercise.prompt, modelAnswer: exercise.modelAnswer, answer: text }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.verdict) throw new Error(data.error ?? 'sin respuesta')
      setStatus('sent')
      onAnswer({ verdict: data.verdict, good: data.good, missing: data.missing, text })
    } catch {
      setStatus('fallback')
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      send()
    }
  }

  if (status === 'fallback') {
    return (
      <div className="reto-explain">
        <p className="reto-explain__note">La IA no respondió a tiempo. Compara tú con la respuesta modelo.</p>
        <OpenAnswer exercise={exercise} onAnswer={onAnswer} disabled={disabled} />
      </div>
    )
  }

  const locked = disabled || status !== 'writing'

  return (
    <form
      className="reto-explain"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <label className="reto-explain__label" htmlFor="reto-explain-text">
        Escríbelo con tus palabras, en una o dos frases
      </label>
      <textarea
        id="reto-explain-text"
        rows={4}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={locked}
        maxLength={MAX_CHARS}
        placeholder="Puedes empezar con «Porque…» o «Significa que…»"
        aria-describedby="reto-explain-help"
        autoFocus
      />
      <div className="reto-explain__meta" id="reto-explain-help">
        {hint && !locked && (
          showHint ? (
            <p className="reto-explain__hint">
              <span className="label">Pista</span> {hint}
            </p>
          ) : (
            <button type="button" className="reto-explain__hint-toggle" onClick={() => setShowHint(true)}>
              Ver una pista
            </button>
          )
        )}
        <span className="reto-explain__count">
          {text.length} / {MAX_CHARS}
        </span>
      </div>

      <div className="reto-explain__actions">
        <button type="submit" className="btn-primary" disabled={locked || !ready}>
          {{ checking: 'La IA está leyendo…', sent: 'Explicación enviada' }[status] ?? 'Enviar explicación'}
        </button>
        {status === 'writing' && <span className="reto-explain__shortcut">Ctrl + Enter para enviar</span>}
      </div>
    </form>
  )
}

export default ExplanationAnswer
