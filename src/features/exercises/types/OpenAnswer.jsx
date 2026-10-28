import { useState } from 'react'

/**
 * Open answer, judged by the student (or the tutor): write or say it, compare
 * with the model answer, then say whether it worked.
 */
function OpenAnswer({ exercise, onAnswer, disabled }) {
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const codeLanguage = exercise.codeLanguage ?? 'PSeInt'

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
        {exercise.code ? `Tu solución en ${codeLanguage} (puedes pegarla aquí para compararla)` : 'Tu respuesta (escríbela o dila en voz alta)'}
        <textarea
          rows={exercise.code ? 12 : 3}
          className={exercise.code ? 'open-answer__code' : undefined}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={disabled || revealed}
        />
      </label>

      {exercise.code && <p>Este campo no ejecuta ni guarda el borrador. Conserva tu archivo en {codeLanguage}.</p>}

      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)}>
          Ver respuesta modelo
        </button>
      ) : (
        <>
          <div className="open-answer__model">
            Modelo:
            {exercise.code
              ? <pre><code>{exercise.modelAnswer}</code></pre>
              : <strong> {exercise.modelAnswer}</strong>}
          </div>
          {exercise.code && <p>Ejecuta y prueba tu solución en {codeLanguage} antes de evaluar cómo te fue.</p>}
          <div className="open-answer__rating" role="group" aria-label="¿Cómo te fue?">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAnswer({ selfRating: 'ok', text })}
            >
              Lo logré
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAnswer({ selfRating: 'miss', text })}
            >
              Me faltó
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default OpenAnswer
