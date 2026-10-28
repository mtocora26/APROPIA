import { Link } from 'react-router-dom'
import { getCourse } from '../../content/courses/index.js'
import { DECKS } from '../../content/decks/index.js'
import { findLesson } from '../../domain/course.js'
import { getDueItems } from '../../core/fsrs/fsrs.js'
import { buildRecap } from '../../core/sessions/tutoringSession.js'
import { lessonPath } from '../lessons/paths.js'
import { useStudents } from '../students/studentContext.js'
import { formatSessionDate } from './formatDate.js'
import { useTutoringData } from './useTutoringData.js'
import './tutoring.css'

const HISTORY_SIZE = 5

/** Start-of-class screen: what we saw last time, what to reinforce, what is due. */
function RecapPage() {
  const { activeStudent } = useStudents()
  const { data, error } = useTutoringData()

  if (error) return <p role="alert">No se pudo leer el avance: {error.message}</p>
  if (!data) return <p>Cargando recap…</p>

  const now = new Date()
  const decksDue = DECKS.map((deck) => ({
    deck,
    dueCount: getDueItems(
      deck.cards.map((card) => card.id),
      data.cardsByDeck[deck.id],
      now,
    ).filter((item) => !item.isNew).length,
  }))
  const recap = buildRecap({
    sessions: data.sessions,
    progressByCourse: data.progressByCourse,
    decksDue,
  })
  const history = data.sessions.slice(-HISTORY_SIZE - 1, -1).reverse()

  return (
    <section className="tutoring">
      <h1>Recap de {activeStudent.name}</h1>

      <p className="tutoring__actions">
        <Link to="/practica" className="tutoring__primary">
          Práctica de inglés: repasa lo estudiado
        </Link>{' '}
        <Link to="/ingles/estudiado">Marcar lo estudiado</Link>
      </p>

      <h2>Última tutoría</h2>
      {recap.lastSession ? (
        <>
          <p>
            <strong>{formatSessionDate(recap.lastSession.date)}</strong>
          </p>
          {recap.lastSession.topics.length > 0 && (
            <ul>
              {recap.lastSession.topics.map((topic) => (
                <li key={`${topic.kind}:${topic.id}`}>{topic.title}</li>
              ))}
            </ul>
          )}
          {recap.lastSession.note && <p className="tutoring__note">{recap.lastSession.note}</p>}
        </>
      ) : (
        <p>Aún no hay tutorías registradas para {activeStudent.name}.</p>
      )}

      {recap.lessons.length > 0 && (
        <>
          <h2>Para reforzar</h2>
          <p>Lecciones de la última tutoría, de la más débil a la más fuerte.</p>
          <ul className="tutoring__list">
            {recap.lessons.map(({ topic, bestScore }) => {
              const course = getCourse(topic.courseId)
              const exists = course && findLesson(course, topic.id)
              return (
                <li key={`${topic.courseId}:${topic.id}`} className="tutoring__item">
                  <span>{topic.title}</span>
                  <span className="tutoring__score">
                    {bestScore === null ? 'sin practicar' : `mejor: ${bestScore}%`}
                  </span>
                  {exists && <Link to={lessonPath(topic.courseId, topic.id)}>Practicar</Link>}
                </li>
              )
            })}
          </ul>
        </>
      )}

      {recap.decks.length > 0 && (
        <>
          <h2>Tarjetas por repasar</h2>
          <ul className="tutoring__list">
            {recap.decks.map(({ deck, dueCount }) => (
              <li key={deck.id} className="tutoring__item">
                <span>{deck.title}</span>
                <span className="tutoring__score">{dueCount} vencidas</span>
                <Link to={`/flashcards/${deck.id}`}>Repasar</Link>
              </li>
            ))}
            {recap.decks.some(({ deck }) => deck.id.startsWith('verbs-')) && (
              <li className="tutoring__item">
                <span>Verbos: práctica mixta (12 tarjetas, todos los modos)</span>
                <Link to="/flashcards/verbos-mixto">Repasar mezclado</Link>
              </li>
            )}
          </ul>
        </>
      )}

      <p className="tutoring__actions">
        <Link to="/tutoria" className="tutoring__primary">
          Terminar tutoría de hoy
        </Link>
      </p>

      {history.length > 0 && (
        <>
          <h2>Tutorías anteriores</h2>
          <ul className="tutoring__list">
            {history.map((session) => (
              <li key={session.id} className="tutoring__item">
                <span>{formatSessionDate(session.date)}</span>
                <span className="tutoring__score">
                  {session.topics.map((topic) => topic.title).join(', ') || session.note}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default RecapPage
