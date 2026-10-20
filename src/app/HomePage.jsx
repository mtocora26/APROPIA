import { Link } from 'react-router-dom'
import { COURSES } from '../content/courses/index.js'
import { listLessons } from '../domain/course.js'
import PlayerStatsCard from '../features/gamification/PlayerStatsCard.jsx'
import { coursePath } from '../features/lessons/paths.js'

function HomePage({ stats }) {
  return (
    <section className="home">
      <h1>Tukola</h1>
      <p>Plataforma personal de idiomas: italiano y business English.</p>

      <PlayerStatsCard stats={stats} />

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

      <Link to="/flashcards" className="course-card">
        <span className="course-card__title">Flashcards</span>
        <span className="course-card__meta">Verbos y vocabulario con repaso espaciado</span>
      </Link>

      <p className="home__demo">
        <Link to="/practica/demo">Ejercicio de demostración</Link>
      </p>
    </section>
  )
}

export default HomePage
