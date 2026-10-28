/**
 * Estimated time to go through a lesson or module, computed from its content
 * (no tracking). Two paces: a student working alone, and a class with a tutor
 * (explaining, speaking out loud, discussing the answer).
 */
const READING_WORDS_PER_MINUTE = 140
const EXAMPLE_SECONDS = 8
const TABLE_CELL_SECONDS = 3
const TRY_SECONDS = 45

// Seconds a student needs alone per exercise type.
const EXERCISE_SECONDS = Object.freeze({
  choice: 15,
  typed: 25,
  reorder: 30,
  match: 40,
  spelling: 30,
  open: 90,
  hunt: 20,
})
const DIALOGUE_LINE_SECONDS = 20

// A class is slower: the tutor explains, and answers are said and discussed.
const CLASS_THEORY_FACTOR = 2
const CLASS_EXERCISE_FACTOR = 1.6

function wordCount(text) {
  return String(text ?? '').split(/\s+/).filter(Boolean).length
}

function theorySeconds(block) {
  switch (block.type) {
    case 'example':
      return EXAMPLE_SECONDS + (wordCount(block.text) / READING_WORDS_PER_MINUTE) * 60
    case 'scene':
      return block.items.length * EXAMPLE_SECONDS
    case 'timeline':
      return block.events.length * EXAMPLE_SECONDS
    case 'try':
      return TRY_SECONDS + (wordCount(block.ask) / READING_WORDS_PER_MINUTE) * 60
    case 'table':
      return (
        block.rows.reduce((cells, row) => cells + row.length, 0) * TABLE_CELL_SECONDS
      )
    default:
      return (wordCount(block.text) / READING_WORDS_PER_MINUTE) * 60
  }
}

function exerciseSeconds(exercise) {
  if (exercise.code || exercise.type === 'code') return (exercise.practiceMinutes ?? 8) * 60
  if (exercise.type === 'dialogue') {
    return exercise.lines.length * DIALOGUE_LINE_SECONDS
  }
  return EXERCISE_SECONDS[exercise.type] ?? EXERCISE_SECONDS.choice
}

/**
 * @param {object} lesson
 * @param {'self' | 'class'} [pace]
 * @returns {number} seconds
 */
export function lessonSeconds(lesson, pace = 'self') {
  const theory = lesson.theory.reduce((total, block) => total + theorySeconds(block), 0)
  const items = pace === 'class' ? (lesson.classExercises ?? lesson.exercises) : lesson.exercises
  const exercises = items.reduce((total, item) => {
    const seconds = exerciseSeconds(item)
    return total + (pace === 'class' && !item.code && item.type !== 'code' ? seconds * CLASS_EXERCISE_FACTOR : seconds)
  }, 0)

  return pace === 'class'
    ? theory * CLASS_THEORY_FACTOR + exercises
    : theory + exercises
}

/** Whole minutes, never below 1. */
export function lessonMinutes(lesson, pace = 'self') {
  return Math.max(1, Math.round(lessonSeconds(lesson, pace) / 60))
}

/** Whole minutes for a module, rounded to 5 once it is long enough to be a rough figure. */
export function moduleMinutes(module, pace = 'self') {
  const minutes = module.lessons.reduce((total, lesson) => total + lessonSeconds(lesson, pace), 0) / 60

  return minutes >= 20 ? Math.round(minutes / 5) * 5 : Math.max(1, Math.round(minutes))
}

/** "≈ 12 min" */
export function formatMinutes(minutes) {
  return `≈ ${minutes} min`
}
