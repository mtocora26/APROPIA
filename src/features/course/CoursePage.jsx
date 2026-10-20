import { Link, useParams } from 'react-router-dom'
import { useProgressRepository } from '../students/studentContext.js'
import { getCourse } from '../../content/courses/index.js'
import { useCourseProgress } from '../../hooks/useCourseProgress.js'
import { lessonPath } from '../lessons/paths.js'
import { buildCourseMap, LESSON_STATUS } from './courseMap.js'
import './courseMap.css'

// Horizontal offsets that draw the zigzag path.
const PATH_OFFSETS = ['0px', '48px', '72px', '48px', '0px', '-48px', '-72px', '-48px']
const MAX_STARS = 3

function CoursePage() {
  const { courseId } = useParams()
  const progressRepository = useProgressRepository()
  const course = getCourse(courseId)
  const { progress, error } = useCourseProgress({
    repository: progressRepository,
    courseId,
  })

  if (!course) {
    return (
      <p>
        No encontramos este curso. <Link to="/">Volver al inicio</Link>
      </p>
    )
  }

  if (error) {
    return <p role="alert">No se pudo cargar tu progreso: {error.message}</p>
  }

  if (!progress) {
    return <p>Cargando…</p>
  }

  const map = buildCourseMap(course, progress)

  return (
    <section className="course-map">
      <header className="course-map__header">
        <h1>{course.title}</h1>
        <p className="course-map__stats">
          <span aria-label={`${map.stars} de ${map.maxStars} estrellas`}>
            <span className="course-map__star" aria-hidden="true">★</span> {map.stars}/
            {map.maxStars}
          </span>
          <span>⚡ {map.totalXp} XP</span>
        </p>
      </header>

      {map.modules.map(({ module, lessons }, m) => (
        <section key={module.id} className="course-map__module">
          <h2 className="course-map__banner">
            <span>Módulo {m + 1}</span>
            {module.title}
          </h2>
          <ol className="course-map__path">
            {lessons.map((node, i) => (
              <li
                key={node.lesson.id}
                className="course-map__step"
                style={{ '--offset': PATH_OFFSETS[i % PATH_OFFSETS.length] }}
              >
                <MapNode
                  node={node}
                  number={i + 1}
                  current={node.lesson.id === map.currentLessonId}
                  to={lessonPath(course.id, node.lesson.id)}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </section>
  )
}

function MapNode({ node, number, current, to }) {
  const { lesson, status, stars } = node
  const icon = nodeIcon(node, number)
  const classes = [
    'map-node',
    `map-node--${status}`,
    current && 'map-node--current',
    lesson.review && 'map-node--review',
  ]
    .filter(Boolean)
    .join(' ')

  if (status === LESSON_STATUS.LOCKED) {
    return (
      <div className={classes} aria-label={`${lesson.title}, bloqueada`}>
        <span className="map-node__circle" aria-hidden="true">
          🔒
        </span>
        <span className="map-node__title">{lesson.title}</span>
      </div>
    )
  }

  return (
    <Link
      to={to}
      className={classes}
      aria-current={current ? 'step' : undefined}
    >
      {current && <span className="map-node__bubble">Empezar</span>}
      <span className="map-node__circle" aria-hidden="true">
        {icon}
      </span>
      <span className="map-node__title">{lesson.title}</span>
      {status === LESSON_STATUS.COMPLETED && (
        <span
          className="map-node__stars"
          aria-label={`${stars} de ${MAX_STARS} estrellas`}
        >
          {Array.from({ length: MAX_STARS }, (_, i) => (
            <span key={i} className={i < stars ? 'map-node__star--on' : undefined}>
              ★
            </span>
          ))}
        </span>
      )}
    </Link>
  )
}

function nodeIcon(node, number) {
  if (node.lesson.review) return '🏆'
  if (node.status === LESSON_STATUS.COMPLETED) return '✓'
  return number
}

export default CoursePage
