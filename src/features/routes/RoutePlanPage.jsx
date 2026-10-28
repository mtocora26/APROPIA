import { Link, useNavigate, useParams } from 'react-router-dom'
import { routeStore } from '../../app/courseCatalog.js'
import { ADMIN_STUDENT_ID } from '../../core/students/studentModel.js'
import { daysBetween, planStudyDays, todayIso } from '../../core/routes/studyPlan.js'
import { listLessons } from '../../domain/course.js'
import { useCourseProgress } from '../../hooks/useCourseProgress.js'
import { buildCourseMap, LESSON_STATUS, nodeState, STATE_LABELS } from '../course/courseMap.js'
import { formatMinutes, lessonMinutes, lessonSeconds } from '../lessons/duration.js'
import { coursePath, lessonPath } from '../lessons/paths.js'
import { useProgressRepository, useStudents } from '../students/studentContext.js'
import Icon from '../../ui/Icon.jsx'
import MarkLast from '../../ui/MarkLast.jsx'
import Panel from '../../ui/Panel.jsx'
import { NOTES_UPLOAD_PATH } from './paths.js'
import './routes.css'

const DATE_FORMAT = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

function RoutePlanPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const progressRepository = useProgressRepository()
  const { activeStudent } = useStudents()
  const route = routeStore.get(courseId)
  const { progress, error } = useCourseProgress({ repository: progressRepository, courseId })

  if (!route) {
    return (
      <p>
        No encontramos esta ruta. <Link to={NOTES_UPLOAD_PATH}>Sube tus apuntes</Link>
      </p>
    )
  }
  if (error) return <p role="alert">No se pudo cargar tu progreso: {error.message}</p>
  if (!progress) return <p>Cargando…</p>

  const { course, examDate } = route
  const today = todayIso()
  const map = buildCourseMap(course, progress, { unlockAll: activeStudent.id === ADMIN_STUDENT_ID })
  const nodes = new Map(map.modules.flatMap((module) => module.lessons).map((node) => [node.lesson.id, node]))
  const lessons = listLessons(course)
  const plan = planStudyDays({
    lessons: lessons.map((lesson) => ({ id: lesson.id, seconds: lessonSeconds(lesson) })),
    // Anchored to the day the route was made, so the plan does not shift as days pass.
    today: route.startDate && route.startDate < today ? route.startDate : today,
    examDate,
  })
  const completed = lessons.filter((lesson) => nodes.get(lesson.id)?.status === LESSON_STATUS.COMPLETED).length
  const daysLeft = daysBetween(today, examDate)

  function handleRemove() {
    routeStore.remove(course.id)
    navigate('/inicio')
  }

  return (
    <section className="route-plan">
      <Link to="/inicio" className="app-back">
        <Icon name="back" size={16} /> Volver a rutas
      </Link>
      <header className="route-plan__header">
        <p className="label">{route.source === 'ejemplo' ? 'Ruta de ejemplo' : 'Generada de tus apuntes'}</p>
        <h1>
          <MarkLast text={course.title} />
        </h1>
        {course.summary && <p className="route-plan__summary">{course.summary}</p>}
        <dl className="route-plan__stats">
          <div>
            <dt className="label">Parcial</dt>
            <dd>{daysLeft > 0 ? `en ${daysLeft} día${daysLeft === 1 ? '' : 's'}` : daysLeft === 0 ? 'hoy' : 'ya pasó'}</dd>
          </div>
          <div>
            <dt className="label">Avance</dt>
            <dd>
              {completed}/{lessons.length} lecciones
            </dd>
          </div>
          <div>
            <dt className="label">XP</dt>
            <dd>{map.totalXp}</dd>
          </div>
        </dl>
      </header>

      <ol className="route-plan__days">
        {plan.map((day) => {
          const isToday = day.date === today
          return (
            <li key={day.date}>
              <Panel as="section" featured={isToday} className={`route-day${day.date < today ? ' route-day--past' : ''}`}>
                <h2 className="route-day__date">
                  <span className="label">{isToday ? 'Hoy' : day.review ? 'Antes del parcial' : 'Día'}</span>
                  {DATE_FORMAT.format(new Date(`${day.date}T00:00:00Z`))}
                </h2>
                {day.review ? (
                  <p className="route-day__review">
                    Repaso general: vuelve a las lecciones marcadas <strong>Reforzar</strong> y a las tarjetas que se te olvidan.
                  </p>
                ) : (
                  <ul className="route-day__lessons">
                    {day.lessonIds.map((lessonId) => (
                      <PlanLesson key={lessonId} node={nodes.get(lessonId)} courseId={course.id} />
                    ))}
                  </ul>
                )}
              </Panel>
            </li>
          )
        })}
      </ol>

      <p className="route-plan__actions">
        <Link to={coursePath(course.id)}>Ver mapa del curso</Link>
        <button type="button" className="notes__link" onClick={handleRemove}>
          Quitar esta ruta
        </button>
      </p>
    </section>
  )
}

function PlanLesson({ node, courseId }) {
  if (!node) return null
  const state = nodeState(node)
  const body = (
    <>
      <span className="route-lesson__title">
        {node.lesson.review && <Icon name="trophy" size={16} />}
        {node.lesson.title}
      </span>
      <span className="route-lesson__meta">
        {formatMinutes(lessonMinutes(node.lesson))} · <span className={`state state--${state}`}>{STATE_LABELS[state]}</span>
      </span>
    </>
  )
  return (
    <li>
      {node.status === LESSON_STATUS.LOCKED ? (
        <div className="route-lesson route-lesson--locked">{body}</div>
      ) : (
        <Link to={lessonPath(courseId, node.lesson.id)} className="route-lesson">
          {body}
        </Link>
      )}
    </li>
  )
}

export default RoutePlanPage
