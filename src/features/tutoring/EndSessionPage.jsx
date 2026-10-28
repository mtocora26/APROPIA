import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COURSES } from '../../content/courses/index.js'
import { DECKS } from '../../content/decks/index.js'
import { localDateKey } from '../../core/gamification/playerStats.js'
import {
  createSession,
  deckTopic,
  lessonTopic,
  suggestTopics,
  topicKey,
} from '../../core/sessions/tutoringSession.js'
import { useSessionRepository, useStudents } from '../students/studentContext.js'
import { useTutoringData } from './useTutoringData.js'
import './tutoring.css'

/** Registers what was covered today; topics practiced today come pre-checked. */
function EndSessionPage() {
  const { data, error } = useTutoringData()

  if (error) return <p role="alert">No se pudo leer el avance: {error.message}</p>
  if (!data) return <p>Cargando…</p>

  return <EndSessionForm data={data} />
}

function EndSessionForm({ data }) {
  const { activeStudent } = useStudents()
  const sessionRepository = useSessionRepository()
  const navigate = useNavigate()
  const [today] = useState(() => localDateKey(new Date()))
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [checked, setChecked] = useState(
    () =>
      new Set(
        suggestTopics({
          courses: COURSES,
          decks: DECKS,
          progressByCourse: data.progressByCourse,
          cardsByDeck: data.cardsByDeck,
          today,
        }).map(topicKey),
      ),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const groups = [
    ...COURSES.flatMap((course) =>
      course.modules.map((module) => ({
        key: `${course.id}:${module.id}`,
        title: `${course.title} · ${module.title}`,
        topics: module.lessons.map((lesson) => lessonTopic(course, lesson)),
      })),
    ),
    { key: 'decks', title: 'Flashcards', topics: DECKS.map(deckTopic) },
  ]
  const topicsByKey = new Map(groups.flatMap((group) => group.topics).map((t) => [topicKey(t), t]))

  function toggle(key) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    setMessage(null)
    try {
      const session = createSession({
        id: crypto.randomUUID().slice(0, 8),
        date,
        createdAt: new Date().toISOString(),
        topics: [...checked].map((key) => topicsByKey.get(key)),
        note,
      })
      await sessionRepository.add(session)
      navigate('/recap')
    } catch (error) {
      setMessage(error.message)
      setSaving(false)
    }
  }

  return (
    <section className="tutoring">
      <h1>Terminar tutoría</h1>
      <p>
        ¿Qué viste hoy con <strong>{activeStudent.name}</strong>? Lo practicado hoy ya viene marcado.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="tutoring__field">
          Fecha
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </label>

        {groups.map((group) => (
          <fieldset key={group.key} className="tutoring__group">
            <legend>{group.title}</legend>
            {group.topics.map((topic) => {
              const key = topicKey(topic)
              return (
                <label key={key} className="tutoring__check">
                  <input type="checkbox" checked={checked.has(key)} onChange={() => toggle(key)} />
                  {topic.title}
                </label>
              )
            })}
          </fieldset>
        ))}

        <label className="tutoring__field">
          Nota (qué costó, tarea, qué repasar la próxima)
          <textarea
            rows={4}
            maxLength={1000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>

        {message && (
          <p role="alert" className="tutoring__error">
            {message}
          </p>
        )}

        <p className="tutoring__actions">
          <button type="submit" disabled={saving} className="tutoring__primary">
            Guardar tutoría
          </button>{' '}
          <Link to="/recap">Cancelar</Link>
        </p>
      </form>
    </section>
  )
}

export default EndSessionPage
