import { useState } from 'react'
import OpenAnswer from '../exercises/types/OpenAnswer.jsx'

// The booth cannot keep a visitor waiting: past this, the visitor rates
// their own answer, as in a normal lesson.
const AI_TIMEOUT_MS = 15_000

/**
 * "Explica con tus palabras" with AI feedback. The AI says what is missing
 * without handing over the model answer. Answers `{ verdict, feedback, text }`,
 * or the self-rating of `OpenAnswer` when the AI does not respond.
 */
function ExplanationAnswer({ exercise, onAnswer, disabled }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('writing') // writing | checking | fallback

  async function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim()) return
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
      onAnswer({ verdict: data.verdict, feedback: data.feedback, text })
    } catch {
      setStatus('fallback')
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

  return (
    <form className="reto-explain" onSubmit={handleSubmit}>
      <label className="open-answer__label">
        Tu explicación (la IA te dice qué falta, sin darte la respuesta)
        <textarea
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={disabled || status === 'checking'}
          maxLength={1200}
          autoFocus
        />
      </label>
      <button type="submit" className="btn-primary" disabled={disabled || status === 'checking' || !text.trim()}>
        {status === 'checking' ? 'La IA está leyendo…' : 'Enviar explicación'}
      </button>
    </form>
  )
}

export default ExplanationAnswer
