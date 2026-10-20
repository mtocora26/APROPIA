import { useState } from 'react'

/**
 * Open answer, judged by the student (or the tutor): write or say it, compare
 * with the model answer, then say whether it worked.
 */
function OpenAnswer({ exercise, onAnswer, disabled }) {
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="open-answer">
      {exercise.hints?.length > 0 && (
        <details className="open-answer__hints">
          <summary>Pistas</summary>
          <ul>
            {exercise.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </details>
      )}

      <label className="open-answer__label">
        Tu respuesta (escríbela o dila en voz alta)
        <textarea
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={disabled || revealed}
        />
      </label>

      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)}>
          Ver respuesta modelo
        </button>
      ) : (
        <>
          <p className="open-answer__model">
            Modelo: <strong>{exercise.modelAnswer}</strong>
          </p>
          <div className="open-answer__rating" role="group" aria-label="¿Cómo te fue?">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAnswer({ selfRating: 'ok', text })}
            >
              ✅ Lo logré
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAnswer({ selfRating: 'miss', text })}
            >
              🔁 Me faltó
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default OpenAnswer
