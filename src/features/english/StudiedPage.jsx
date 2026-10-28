import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourse } from '../../content/courses/index.js'
import EnglishNav from './EnglishNav.jsx'
import { ENGLISH_COURSE_ID, useStudiedEnglish } from './useStudiedEnglish.js'
import '../tutoring/tutoring.css'

/** Mark by hand which lessons the student has already seen; the practice and the recap use it. */
function StudiedPage() {
  const course = getCourse(ENGLISH_COURSE_ID)
  const { data, error, setManual } = useStudiedEnglish()
  const [saveError, setSaveError] = useState(null)

  if (error) return <p role="alert">No se pudo leer lo estudiado: {error.message}</p>
  if (!data) return <p>Cargando…</p>

  const change = (ids, checked) => {
    const next = new Set(data.manual)
    for (const id of ids) {
      if (checked) next.add(id)
      else next.delete(id)
    }
    setSaveError(null)
    setManual([...next]).catch(setSaveError)
  }

  return (
    <section className="tutoring">
      <EnglishNav />
      <h1>Lo estudiado</h1>
      <p>
        Marca las lecciones que ya vio. También cuentan solas las que completó en la app y las que registraste en una tutoría.
        Con esto se arma la <Link to="/practica">práctica</Link> y el recap.
      </p>
      {saveError && <p role="alert" className="tutoring__error">{saveError.message}</p>}

      {course.modules.map((module) => {
        const ids = module.lessons.map((lesson) => lesson.id)
        const allChecked = ids.every((id) => data.all.has(id))
        return (
          <fieldset key={module.id} className="tutoring__group studied__module">
            <legend>{module.title}</legend>
            <label className="tutoring__check">
              <input
                type="checkbox"
                checked={allChecked}
                disabled={ids.every((id) => data.automatic.has(id))}
                onChange={(event) => change(ids, event.target.checked)}
              />
              Todo el módulo
            </label>
            {module.lessons.map((lesson) => (
              <label key={lesson.id} className="tutoring__check">
                <input
                  type="checkbox"
                  checked={data.all.has(lesson.id)}
                  disabled={data.automatic.has(lesson.id)}
                  onChange={(event) => change([lesson.id], event.target.checked)}
                />
                {lesson.title}
                {data.automatic.has(lesson.id) && <span className="studied__auto"> · registrada</span>}
              </label>
            ))}
          </fieldset>
        )
      })}
    </section>
  )
}

export default StudiedPage
