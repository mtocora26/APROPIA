import { Link, useParams } from 'react-router-dom'
import { ADMIN_STUDENT_ID } from '../../core/students/studentModel.js'
import { useProgressRepository, useStudents } from '../students/studentContext.js'
import { getCourse } from '../../app/courseCatalog.js'
import { useCourseProgress } from '../../hooks/useCourseProgress.js'
import { formatMinutes, moduleMinutes } from '../lessons/duration.js'
import { lessonPath } from '../lessons/paths.js'
import Icon from '../../ui/Icon.jsx'
import Meter from '../../ui/Meter.jsx'
import MarkLast from '../../ui/MarkLast.jsx'
import Panel from '../../ui/Panel.jsx'
import { buildCourseMap, LESSON_STATUS, nodeState, STATE_LABELS } from './courseMap.js'
import EnglishNav from '../english/EnglishNav.jsx'
import { ENGLISH_COURSE_ID } from '../english/useStudiedEnglish.js'
import './courseMap.css'

const MAX_STARS = 3
const MAX_PROGRESS_SEGMENTS = 10

function CoursePage() {
  const { courseId } = useParams()
  const progressRepository = useProgressRepository()
  const { activeStudent } = useStudents()
  const course = getCourse(courseId)
  const { progress, error } = useCourseProgress({
    repository: progressRepository,
    courseId,
  })

  if (!course) {
    return (
      <p>
        No encontramos este curso. <Link to="/inicio">Volver al inicio</Link>
      </p>
    )
  }

  if (error) {
    return <p role="alert">No se pudo cargar tu progreso: {error.message}</p>
  }

  if (!progress) {
    return <p>Cargando…</p>
  }

  const map = buildCourseMap(course, progress, { unlockAll: activeStudent.id === ADMIN_STUDENT_ID })

  return (
    <section className="course-map">
      {course.id === ENGLISH_COURSE_ID && <EnglishNav />}
      <Link to="/inicio" className="app-back">
        <Icon name="back" size={16} /> Volver a rutas
      </Link>
      <header className="course-map__header">
        <h1>
          <MarkLast text={course.title} />
        </h1>
        <div className="course-map__stats">
          <span className="course-map__stars">
            <span className="label">Estrellas</span> {map.stars}/{map.maxStars}
            <span aria-hidden="true">
              <Meter value={map.stars} max={map.maxStars} label={`${map.stars} de ${map.maxStars} estrellas`} />
            </span>
          </span>
          <span>
            <span className="label">XP</span> {map.totalXp}
          </span>
        </div>
      </header>

      {map.modules.map(({ module, lessons }, m) => (
        <ModulePanel
          key={module.id}
          module={module}
          lessons={lessons}
          index={m}
          currentLessonId={map.currentLessonId}
          courseId={course.id}
        />
      ))}
    </section>
  )
}

function ModulePanel({ module, lessons, index, currentLessonId, courseId }) {
  const completed = lessons.filter((node) => node.status === LESSON_STATUS.COMPLETED).length

  return (
    <Panel
      as="section"
      featured={lessons.some((node) => node.lesson.id === currentLessonId)}
      className="course-map__module"
      style={{ '--i': index }}
    >
      <header className="course-map__banner">
        <div>
          <h2>{module.title}</h2>
          <p className="course-map__duration">
            Módulo {index + 1} · {formatMinutes(moduleMinutes(module))} solo ·{' '}
            {formatMinutes(moduleMinutes(module, 'class'))} en clase
          </p>
        </div>
        <p className="course-map__progress">
          {completed} de {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
          <Meter
            value={completed}
            max={lessons.length}
            segments={Math.min(lessons.length, MAX_PROGRESS_SEGMENTS)}
            label={`${completed} de ${lessons.length} lecciones completadas`}
          />
        </p>
      </header>
      <ol className="course-map__path">
        {lessons.map((node) => (
          <li key={node.lesson.id} className="course-map__step">
            <MapNode
              node={node}
              current={node.lesson.id === currentLessonId}
              to={lessonPath(courseId, node.lesson.id)}
            />
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function MapNode({ node, current, to }) {
  const { lesson, status, stars } = node
  const state = nodeState(node)
  const classes = ['map-node', `map-node--${state}`, current && 'map-node--current']
    .filter(Boolean)
    .join(' ')
  const body = (
    <>
      <span className="map-node__title">
        {lesson.review && <Icon name="trophy" size={18} />}
        {lesson.title}
      </span>
      {status === LESSON_STATUS.COMPLETED && (
        <Meter value={stars} max={MAX_STARS} segments={MAX_STARS} label={`${stars} de ${MAX_STARS} estrellas`} />
      )}
      <span className={`state state--${state}`}>
        {STATE_LABELS[state]}
      </span>
    </>
  )

  if (status === LESSON_STATUS.LOCKED) {
    return <div className={classes}>{body}</div>
  }

  return (
    <Link to={to} className={classes} aria-current={current ? 'step' : undefined}>
      {body}
    </Link>
  )
}

export default CoursePage
