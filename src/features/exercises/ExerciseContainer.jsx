import { NEXT_STEPS } from '../../core/session/studySession.js'
import { EXERCISE_STATES } from '../../hooks/useExercise.js'
import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'
import './ExerciseContainer.css'

/**
 * Generic shell for any exercise that follows the `useExercise` contract
 * (`{ state, answer, next, start, stats }`). It owns the shared flow — progress,
 * combo, feedback, review of mistakes and the final summary — while each exercise type only
 * provides how an item is shown and how it is answered.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {{ state: object, answer: Function, next: Function, start: Function, stats: object }} props.exercise
 * @param {(item: unknown) => React.ReactNode} props.renderPrompt
 * @param {(args: { item: unknown, onAnswer: Function, disabled: boolean }) => React.ReactNode} props.renderAnswer
 * @param {(args: { item: unknown, answer: unknown, result: string }) => React.ReactNode} [props.renderFeedback]
 *   Extra, type-specific feedback (e.g. the expected answer).
 * @param {() => void} [props.onRestart]
 * @param {React.ReactNode | ((args: { onRestart?: Function }) => React.ReactNode)} [props.children]
 *   Extra content for the summary screen. A function takes over the actions (including restart).
 */
function ExerciseContainer({
  title,
  exercise,
  renderPrompt,
  renderAnswer,
  renderFeedback,
  onRestart,
  children,
}) {
  const { state, answer, next, start, stats } = exercise

  if (state.status === EXERCISE_STATES.IDLE) {
    return (
      <section className="exercise">
        <h1 className="page-title">{title}</h1>
        <button type="button" onClick={start} autoFocus>
          Empezar
        </button>
      </section>
    )
  }

  if (state.status === EXERCISE_STATES.DONE) {
    return (
      <section className="exercise">
        <h1 className="page-title">{title}</h1>
        <ExerciseSummary stats={stats} onRestart={onRestart}>
          {children}
        </ExerciseSummary>
      </section>
    )
  }

  const answered = state.result !== null
  const reviewing = state.status === EXERCISE_STATES.REVIEWING

  return (
    <section className="exercise">
      <header className="exercise__header">
        <h1 className="page-title">{title}</h1>
        {reviewing && (
          <p className="exercise__phase">Repaso: corrige tus errores</p>
        )}
        <ExerciseProgress
          current={state.position + 1}
          total={state.queueLength}
          combo={stats.combo}
        />
      </header>

      <Panel featured className="exercise__prompt">{renderPrompt(state.currentItem)}</Panel>

      {/* `key` resets the answer UI on every step, even if an item repeats. */}
      <div key={state.step} className="exercise__answer">
        {renderAnswer({
          item: state.currentItem,
          onAnswer: answer,
          disabled: answered,
        })}
      </div>

      {answered && (
        <div
          className={`exercise__feedback exercise__feedback--${state.result}`}
          role="status"
        >
          <p className="exercise__feedback-title">
            {state.result === 'correct' ? 'Correcto' : 'Reforzar'}
          </p>
          {renderFeedback?.({
            item: state.currentItem,
            answer: state.answer,
            result: state.result,
          })}
          <button type="button" onClick={next} autoFocus>
            {NEXT_LABELS[state.nextStep]}
          </button>
        </div>
      )}
    </section>
  )
}

const NEXT_LABELS = {
  [NEXT_STEPS.ITEM]: 'Siguiente',
  [NEXT_STEPS.REVIEW]: 'Repasar errores',
  [NEXT_STEPS.DONE]: 'Ver resultado',
}

const MIN_COMBO_SHOWN = 2

function ExerciseProgress({ current, total, combo }) {
  return (
    <div className="exercise__progress">
      <span>
        {current} / {total}
      </span>
      <Meter value={current - 1} max={total} label={`Progreso: ${current - 1} de ${total}`} />
      {combo >= MIN_COMBO_SHOWN && (
        <span key={combo} className="exercise__combo" aria-label={`Combo de ${combo}`}>
          Combo {combo}
        </span>
      )}
    </div>
  )
}

function ExerciseSummary({ stats, onRestart, children }) {
  return (
    <div className="exercise__summary">
      <p className="exercise__score">{stats.accuracy}%</p>
      <p>
        {stats.correct} correctas de {stats.answered}
      </p>
      {typeof children === 'function' ? (
        children({ onRestart })
      ) : (
        <>
          {children}
          {onRestart && (
            <button type="button" className="button--secondary" onClick={onRestart} autoFocus>
              Repetir
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ExerciseContainer
