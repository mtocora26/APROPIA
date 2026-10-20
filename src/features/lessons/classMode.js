import { correctAnswerText } from '../exercises/types/exerciseLogic.js'

/**
 * Slides for projecting a lesson in class: one per theory block, then one per
 * exercise (answered out loud, with the answer revealed on demand).
 *
 * @returns {({ kind: 'theory', block: object } | { kind: 'exercise', exercise: object })[]}
 */
export function buildClassSlides(lesson) {
  return [
    ...lesson.theory.map((block) => ({ kind: 'theory', block })),
    ...lesson.exercises.map((exercise) => ({ kind: 'exercise', exercise })),
  ]
}

/** What the tutor reveals for an exercise, or null if there is nothing to show. */
export function revealedAnswer(exercise, context) {
  return exercise.type === 'open' ? exercise.modelAnswer : correctAnswerText(exercise, context)
}

/** Items the class can see before the answer (options, tokens, left side of pairs). */
export function exerciseMaterial(exercise) {
  switch (exercise.type) {
    case 'choice':
      return exercise.options
    case 'reorder':
      return exercise.tokens
    case 'match':
      return exercise.pairs.map(([left]) => left)
    case 'open':
      return exercise.hints ?? []
    default:
      return []
  }
}

/** Next slide index, kept inside the deck. */
export function moveSlide(index, step, total) {
  return Math.min(total - 1, Math.max(0, index + step))
}
