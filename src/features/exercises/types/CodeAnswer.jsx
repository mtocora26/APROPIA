import { useState } from 'react'
import { gradeProgram } from '../../../core/pseint/grader.js'
import PseintSandbox from '../../sandbox/PseintSandbox.jsx'
import LessonTheory from '../../lessons/LessonTheory.jsx'

// Tras tantos intentos fallidos se sugiere repasar el tema en vez de seguir adivinando.
const SUGGEST_THEORY_AFTER = 2

/**
 * Ejercicio de código: el estudiante escribe PSeInt, lo ejecuta aquí mismo y
 * «Comprobar» lo califica con las pruebas del ejercicio. Las pistas salen de
 * a una, y «Ver el tema» muestra la teoría de la lección sin salir del ejercicio.
 */
function CodeAnswer({ exercise, onAnswer, disabled, theory = [] }) {
  const [code, setCode] = useState(exercise.starter ?? '')
  const [grade, setGrade] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [hintsShown, setHintsShown] = useState(0)
  const [topicOpen, setTopicOpen] = useState(false)
  const hints = exercise.hints ?? []
  const topicBlocks = (exercise.theory ?? theory.map((_, i) => i)).map((i) => theory[i]).filter(Boolean)
  const failedAttempts = grade && !grade.passed ? attempts : 0

  function check() {
    const result = gradeProgram(code, exercise.tests)
    setGrade(result)
    setAttempts((value) => value + 1)
    if (result.passed) onAnswer({ passed: true, code, hintsUsed: hintsShown, attempts: attempts + 1 })
  }

  return (
    <div className="code-answer">
      <PseintSandbox code={code} onCodeChange={setCode} rows={exercise.rows ?? 14}>
        <button type="button" className="sandbox__btn sandbox__btn--primary" onClick={check} disabled={disabled || code.trim() === ''}>
          Comprobar
        </button>
      </PseintSandbox>

      {grade && (
        <section className="code-answer__results" aria-label="Resultado de las pruebas">
          <h3 className="sandbox__title">
            {grade.passed ? 'Todas las pruebas pasaron' : `${grade.results.filter((r) => r.passed).length} de ${grade.results.length} pruebas pasaron`}
          </h3>
          <ul>
            {grade.results.map((result, index) => (
              <li key={index} className={result.passed ? 'code-answer__test code-answer__test--ok' : 'code-answer__test code-answer__test--fail'}>
                <strong>{result.passed ? 'Pasa' : 'Falla'}</strong> · {result.name}
                {result.reason && <span> — {result.reason}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!disabled && (
        <div className="code-answer__help">
          {hints.slice(0, hintsShown).map((hint, index) => (
            <p key={hint} className="code-answer__hint"><strong>Pista {index + 1}:</strong> {hint}</p>
          ))}
          <div className="code-answer__actions">
            {hintsShown < hints.length && (
              <button type="button" className="sandbox__btn" onClick={() => setHintsShown((value) => value + 1)}>
                {hintsShown === 0 ? 'Necesito una pista' : 'Otra pista'}
              </button>
            )}
            {topicBlocks.length > 0 && (
              <button type="button" className="sandbox__btn" aria-expanded={topicOpen} onClick={() => setTopicOpen((value) => !value)}>
                {topicOpen ? 'Ocultar el tema' : 'Ver el tema'}
              </button>
            )}
            <button type="button" className="sandbox__btn" onClick={() => onAnswer({ passed: false, gaveUp: true, code })}>
              Ver la solución
            </button>
          </div>
          {failedAttempts >= SUGGEST_THEORY_AFTER && !topicOpen && topicBlocks.length > 0 && (
            <p className="code-answer__nudge">Van {failedAttempts} intentos sin acertar. Repasa el tema y vuelve a probar.</p>
          )}
          {topicOpen && (
            <div className="code-answer__topic">
              <LessonTheory blocks={topicBlocks} lang="es-CO" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CodeAnswer
