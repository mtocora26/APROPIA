import { sampleReview } from '../../domain/course.js'

export const PRACTICE_SIZES = Object.freeze([10, 20, 30])

/**
 * Exercises of one lesson: its own plus the alternate ones the module keeps
 * for its review, so a practice does not repeat only what was already done.
 */
export function lessonExercises(module, lesson) {
  return [...lesson.exercises, ...(module.reviewExercises ?? []).filter((exercise) => exercise.from === lesson.id)]
}

/** A free practice set from the chosen lessons; nothing is read from or saved to progress. */
export function buildPractice(course, lessonIds, size, random = Math.random) {
  const groups = course.modules.flatMap((module) =>
    module.lessons.filter((lesson) => lessonIds.includes(lesson.id)).map((lesson) => lessonExercises(module, lesson)),
  )

  return sampleReview(groups, size, random)
}
