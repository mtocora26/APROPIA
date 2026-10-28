import { validateCourse } from '../../domain/course.js'

/**
 * Turns the draft the model returns (see `server/generarRuta.js`) into a
 * Course the app already knows how to show. The model never picks ids: they
 * are derived here so they are unique and stable. Exercises that break the
 * content rules are dropped instead of failing the whole route, because a
 * route with one exercise less is still useful in front of the student.
 */

export const ROUTE_ID_PREFIX = 'ruta-'

/**
 * @param {object} draft  { title, summary, modules: [{ title, lessons: [...] }] }
 * @param {object} options
 * @param {string} options.id  course id, must start with ROUTE_ID_PREFIX
 * @returns {object} a valid Course plus `summary` and `generated: true`
 * @throws {TypeError} when nothing usable is left
 */
export function courseFromDraft(draft, { id }) {
  if (!id.startsWith(ROUTE_ID_PREFIX)) throw new TypeError(`route id must start with "${ROUTE_ID_PREFIX}"`)

  const modules = (draft?.modules ?? [])
    .map((module, m) => {
      const moduleId = `${id}-m${m + 1}`
      const lessons = (module.lessons ?? [])
        .map((lesson, l) => toLesson(lesson, `${moduleId}-l${l + 1}`))
        .filter(Boolean)
      return lessons.length > 0 ? { id: moduleId, title: cleanTitle(module.title) || `Módulo ${m + 1}`, lessons } : null
    })
    .filter(Boolean)

  if (modules.length === 0) throw new TypeError('the draft has no usable lessons')

  return validateCourse({
    id,
    title: cleanTitle(draft.title) || 'Mi ruta de estudio',
    summary: clean(draft.summary),
    language: 'es',
    level: 'Ruta personal',
    generated: true,
    modules,
  })
}

function toLesson(lesson, lessonId) {
  const exercises = (lesson.exercises ?? [])
    .map((exercise, e) => toExercise(exercise, `${lessonId}-e${e + 1}`))
    .filter(Boolean)
  if (exercises.length === 0) return null

  const theory = (lesson.theory ?? [])
    .filter((block) => clean(block.text))
    .map((block) => ({ type: block.kind === 'tip' ? 'tip' : 'text', text: clean(block.text) }))

  return { id: lessonId, title: cleanTitle(lesson.title) || 'Lección', theory, exercises }
}

function toExercise(exercise, id) {
  const prompt = clean(exercise.prompt)
  if (!prompt) return null
  const base = { id, type: exercise.type, prompt }
  const explanation = clean(exercise.explanation)
  if (explanation) base.explanation = explanation

  switch (exercise.type) {
    case 'choice': {
      const options = unique((exercise.options ?? []).map(clean).filter(Boolean))
      const answer = clean(exercise.answer)
      if (options.length < 2 || !options.includes(answer)) return null
      return { ...base, options, answer }
    }
    case 'match': {
      const pairs = (exercise.pairs ?? [])
        .map((pair) => [clean(pair.left), clean(pair.right)])
        .filter(([left, right]) => left && right)
      const lefts = pairs.map(([left]) => left)
      const rights = pairs.map(([, right]) => right)
      if (pairs.length < 2 || unique(lefts).length !== lefts.length || unique(rights).length !== rights.length) return null
      return { ...base, pairs }
    }
    case 'typed': {
      const answer = clean(exercise.answer)
      if (!answer) return null
      const sentence = clean(exercise.sentence)
      const alternatives = unique((exercise.alternatives ?? []).map(clean).filter((item) => item && item !== answer))
      return {
        ...base,
        ...(sentence && { sentence }),
        answer,
        ...(alternatives.length > 0 && { alternatives }),
      }
    }
    case 'open': {
      const modelAnswer = clean(exercise.modelAnswer)
      if (!modelAnswer) return null
      const hints = (exercise.hints ?? []).map(clean).filter(Boolean)
      return { ...base, modelAnswer, ...(hints.length > 0 && { hints }) }
    }
    default:
      return null
  }
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// The app already numbers modules; models tend to repeat it ("Módulo 1: …").
const TITLE_PREFIX = /^(m[óo]dulo|lecci[óo]n|unidad|tema)\s*\d+\s*[:.\-–—]\s*|^ruta de estudio\s*[:\-–—]\s*/i

function cleanTitle(value) {
  return clean(value).replace(TITLE_PREFIX, '')
}

function unique(list) {
  return [...new Set(list)]
}
