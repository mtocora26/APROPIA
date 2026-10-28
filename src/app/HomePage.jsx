import { Link } from 'react-router-dom'
import { COURSES } from '../content/courses/index.js'
import { listLessons } from '../domain/course.js'
import PlayerStatsCard from '../features/gamification/PlayerStatsCard.jsx'
import { coursePath } from '../features/lessons/paths.js'
import { NOTES_UPLOAD_PATH, routePlanPath } from '../features/routes/paths.js'
import '../features/routes/routes.css'
import { routeStore } from './courseCatalog.js'

const EXAM_DATE = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', timeZone: 'UTC' })

function HomePage({ stats }) {
  const routes = routeStore.list()

  return (
    <section className="home">
      <h1>APROPIA</h1>
      <p>
        Plataforma de aprendizaje <span className="mark">personalizado</span>.
      </p>

      <PlayerStatsCard stats={stats} />

      <Link to="/reto" className="course-card">
        <span className="course-card__title">Reto APROPIA</span>
        <span className="course-card__meta">5 preguntas contra el reloj y ranking del día</span>
      </Link>

      <Link to={NOTES_UPLOAD_PATH} className="course-card course-card--cta">
        <span className="course-card__title">Sube tus apuntes</span>
        <span className="course-card__meta">Tu material se convierte en una ruta con fecha hasta el parcial</span>
      </Link>

      {routes.length > 0 && (
        <ul className="home__courses" aria-label="Tus rutas">
          {routes.map(({ course, examDate }) => (
            <li key={course.id}>
              <Link to={routePlanPath(course.id)} className="course-card">
                <span className="course-card__title">{course.title}</span>
                <span className="course-card__meta">
                  Parcial el {EXAM_DATE.format(new Date(`${examDate}T00:00:00Z`))} · {listLessons(course).length} lecciones
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/recap" className="course-card">
        <span className="course-card__title">Recap de inicio de clase</span>
        <span className="course-card__meta">Lo visto la última vez, qué reforzar y tarjetas vencidas</span>
      </Link>

      <ul className="home__courses">
        {COURSES.map((course) => (
          <li key={course.id}>
            <Link to={coursePath(course.id)} className="course-card">
              <span className="course-card__title">{course.title}</span>
              <span className="course-card__meta">
                {course.modules.length} módulo(s) · {listLessons(course).length} lecciones
              </span>
            </Link>
          </li>
        ))}
      </ul>


      <p className="home__demo">
        <Link to="/practica/demo">Ejercicio de demostración</Link>
      </p>
    </section>
  )
}

export default HomePage
