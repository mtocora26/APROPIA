import { correctAnswerText } from '../exercises/types/exerciseLogic.js'

/**
 * The whole explanation first (idea, structure, live example, trace), then
 * the exercises: nobody is asked to apply a syntax they have not seen yet.
 *
 * @returns {({ kind: 'theory', block: object } | { kind: 'exercise', exercise: object })[]}
 */
export function buildClassSlides(lesson) {
  const exercises = lesson.classExercises ?? lesson.exercises
  return [
    ...lesson.theory.map((block) => ({ kind: 'theory', block })),
    ...exercises.map((exercise) => ({ kind: 'exercise', exercise })),
  ]
}

const THEORY_STAGES = {
  text: 'Idea clave',
  syntax: 'Estructura · así se escribe',
  try: 'Ejemplo en vivo · ejecútalo y míralo paso a paso',
  code: 'Ejemplo',
  table: 'Traza · qué pasa en cada paso',
  tip: 'Ojo con esto',
  form: 'Así se ve el formulario',
  example: 'Ejemplo',
  scene: 'Mira y lee · imagina la escena',
  timeline: 'En la línea del tiempo',
}

/** Label of the current slide, so the tutor knows which stage of the lesson is on screen. */
export function slideStage(slide, { index, slides }) {
  if (slide.kind === 'theory') return THEORY_STAGES[slide.block.type] ?? 'Idea clave'
  const first = slides.findIndex((item) => item.kind === 'exercise')
  const total = slides.length - first
  return `Ahora ustedes · ejercicio ${index - first + 1} de ${total} · piensen antes de responder`
}

/** What the tutor reveals for an exercise, or null if there is nothing to show. */
export function revealedAnswer(exercise, context) {
  return exercise.type === 'open' || exercise.type === 'code' ? exercise.modelAnswer : correctAnswerText(exercise, context)
}

/** Items always visible before the answer (hints for open questions stay hidden). */
export function exerciseMaterial(exercise) {
  switch (exercise.type) {
    case 'choice':
      return exercise.options
    case 'reorder':
    case 'hunt':
      return exercise.tokens
    case 'match':
      return exercise.pairs.map(([left]) => left)
    default:
      return []
  }
}

/** Index of the first exercise slide, or -1 if the lesson has none. */
export function firstExerciseIndex(slides) {
  return slides.findIndex((slide) => slide.kind === 'exercise')
}

/** Next slide index, kept inside the deck. */
export function moveSlide(index, step, total) {
  return Math.min(total - 1, Math.max(0, index + step))
}
