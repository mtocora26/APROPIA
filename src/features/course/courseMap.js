import { starsForAccuracy } from '../../core/gamification/scoring.js'
import { moduleLessons } from '../../domain/course.js'

export const LESSON_STATUS = Object.freeze({
  LOCKED: 'locked',
  AVAILABLE: 'available',
  COMPLETED: 'completed',
})

const MAX_STARS_PER_LESSON = 3

/**
 * Joins course content with the user's progress. Lessons unlock in order:
 * the first one is always available and each next one unlocks when the
 * previous is completed (finishing a lesson gives at least 1 star).
 *
 * @param {object} course see domain/course.js
 * @param {{ exercises: Record<string, object> }} progress see core/storage
 * @param {{ unlockAll?: boolean }} options tutor profile may visit any lesson
 */
export function buildCourseMap(course, progress, { unlockAll = false } = {}) {
  let previousCompleted = true
  let currentLessonId = null

  const modules = course.modules.map((module) => ({
    module,
    lessons: moduleLessons(module).map((lesson) => {
      const record = progress.exercises[lesson.id]
      const completed = record?.status === 'completed'
      const bestScore = completed ? (record.bestScore ?? record.score ?? 0) : null

      let status = LESSON_STATUS.LOCKED
      if (completed) status = LESSON_STATUS.COMPLETED
      else if (previousCompleted || unlockAll) status = LESSON_STATUS.AVAILABLE

      if (status === LESSON_STATUS.AVAILABLE && currentLessonId === null) {
        currentLessonId = lesson.id
      }
      previousCompleted = completed

      return {
        lesson,
        status,
        stars: completed ? starsForAccuracy(bestScore) : 0,
        bestScore,
        xp: record?.xp ?? 0,
      }
    }),
  }))

  const nodes = modules.flatMap((item) => item.lessons)

  return {
    modules,
    currentLessonId,
    totalXp: nodes.reduce((sum, node) => sum + node.xp, 0),
    stars: nodes.reduce((sum, node) => sum + node.stars, 0),
    maxStars: nodes.length * MAX_STARS_PER_LESSON,
  }
}

export function findMapNode(map, lessonId) {
  for (const { lessons } of map.modules) {
    const node = lessons.find((item) => item.lesson.id === lessonId)
    if (node) return node
  }
  return null
}

/** Learning state of a node: «Dominio» (3 stars), «Reforzar» (done, fewer stars), «En proceso» (open), «Pendiente» (locked). */
export function nodeState({ status, stars }) {
  if (status === LESSON_STATUS.COMPLETED) return stars >= MAX_STARS_PER_LESSON ? 'dominio' : 'refuerzo'
  if (status === LESSON_STATUS.AVAILABLE) return 'proceso'
  return 'pendiente'
}

export const STATE_LABELS = Object.freeze({
  dominio: 'Dominio',
  refuerzo: 'Reforzar',
  proceso: 'En proceso',
  pendiente: 'Bloqueada',
})
