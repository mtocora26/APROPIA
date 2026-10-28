import { Link } from 'react-router-dom'
import Icon from '../../ui/Icon.jsx'
import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'
import { SAVE_STATUSES } from '../../hooks/useExerciseProgress.js'

const MAX_STARS = 3

/** «Dominio» when the lesson went through at 3 stars; otherwise there is something to reinforce. */
function reading({ stars, stats, lessonTitle }) {
  if (stars >= MAX_STARS) {
    return {
      kind: 'dominio',
      word: 'Dominio',
      text: 'Todo a la primera. Esta lección ya la entiendes.',
    }
  }

  return {
    kind: 'refuerzo',
    word: 'Reforzar',
    text: `Fallaste ${stats.incorrect} a la primera. Repasa «${lessonTitle}» y vuelve a intentarlo.`,
  }
}

function LessonResult({ stars, stats, lessonTitle, xp, progress, nextLessonPath, mapPath, onRestart }) {
  // Wait for the save: the next lesson unlocks from the stored progress.
  const saved = progress.saveStatus === SAVE_STATUSES.SAVED
  const { kind, word, text } = reading({ stars, stats, lessonTitle })
  const next = nextLessonPath && saved

  return (
    <div className="lesson-result">
      <Panel featured className="lesson-result__reading">
        <p className={`state state--${kind} lesson-result__word`}>{word}</p>
        <p className="lesson-result__text">{text}</p>
        <Meter value={stars} max={MAX_STARS} segments={MAX_STARS} label={`${stars} de ${MAX_STARS} estrellas`} />
      </Panel>

      <SaveNote {...progress} xp={xp.total} />

      <div className="lesson-result__actions">
        {next ? (
          <Link to={nextLessonPath} className="btn-primary" autoFocus>
            Siguiente lección <Icon name="forward" size={16} />
          </Link>
        ) : (
          <Link to={mapPath} className="btn-primary" autoFocus>
            Volver al mapa
          </Link>
        )}
        {next && (
          <Link to={mapPath} className="btn-secondary">
            Volver al mapa
          </Link>
        )}
        {onRestart && (
          <button type="button" className="btn-secondary button--secondary" onClick={onRestart}>
            Repetir
          </button>
        )}
      </div>
    </div>
  )
}

function SaveNote({ record, saveStatus, xp }) {
  if (saveStatus === SAVE_STATUSES.ERROR) {
    return <p role="alert">No se pudo guardar el progreso.</p>
  }

  if (saveStatus !== SAVE_STATUSES.SAVED) {
    return <p className="lesson-result__note">Guardando progreso…</p>
  }

  return (
    <p className="lesson-result__note">
      +{xp} XP · Mejor resultado: {record.bestScore}%
    </p>
  )
}

export default LessonResult
