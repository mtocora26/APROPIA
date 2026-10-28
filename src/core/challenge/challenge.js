/**
 * Reto APROPIA: a short timed round for the fair booth. Pure rules, no React:
 * which questions to ask, how long each one gets and how many points an
 * answer is worth.
 */

export const QUESTION_COUNT = 5

// Types that work against the clock. Code, dialogues and spelling take too long
// for a two-minute round.
const QUICK_TYPES = new Set(['choice', 'typed', 'match', 'reorder'])

const TIME_LIMIT_MS = Object.freeze({
  choice: 20_000,
  typed: 30_000,
  reorder: 35_000,
  match: 40_000,
})

export const POINTS = Object.freeze({
  correct: 100,
  maxSpeedBonus: 50,
  comboStep: 20,
  explanation: 150,
  // "Va por buen camino": half the points, but it does not count as right.
  partialExplanation: 75,
})

export function isQuickExercise(exercise) {
  return QUICK_TYPES.has(exercise.type)
}

export function isExplanation(exercise) {
  return exercise.type === 'open' && !exercise.code
}

/** Milliseconds a question gets, or null when it is not timed (the explanation). */
export function timeLimitFor(exercise) {
  return TIME_LIMIT_MS[exercise.type] ?? null
}

/**
 * Picks the round: quick questions first and, when the topic has one, a final
 * "explica con tus palabras". Lessons are sampled evenly so one long lesson
 * does not take over the round.
 *
 * @param {object[][]} lessons exercises grouped by lesson
 * @returns {object[]} up to QUESTION_COUNT exercises
 */
export function pickQuestions(lessons, { count = QUESTION_COUNT, random = Math.random } = {}) {
  const quick = interleave(lessons.map((exercises) => shuffle(exercises.filter(isQuickExercise), random)))
  const explanations = shuffle(lessons.flat().filter(isExplanation), random)

  const wantsExplanation = explanations.length > 0 && count > 1
  const picked = quick.slice(0, wantsExplanation ? count - 1 : count)
  if (wantsExplanation) picked.push(explanations[0])
  return picked
}

/**
 * @param {object} answer
 * @param {boolean} answer.correct
 * @param {number | null} answer.elapsedMs  null for untimed questions
 * @param {number | null} answer.limitMs
 * @param {number} answer.combo  correct answers in a row, including this one
 * @param {boolean} [answer.explanation]
 */
export function scoreAnswer({ correct, elapsedMs, limitMs, combo, explanation = false }) {
  if (!correct) return 0
  if (explanation) return POINTS.explanation

  const remaining = limitMs ? Math.max(0, 1 - elapsedMs / limitMs) : 0
  const speed = Math.round(POINTS.maxSpeedBonus * remaining)
  const streak = Math.max(0, combo - 1) * POINTS.comboStep
  return POINTS.correct + speed + streak
}

/** All right is "dominio", 60 % or more "proceso", less "refuerzo" (same words as the course map). */
export function summarize(answers) {
  const correct = answers.filter((answer) => answer.correct).length
  const ratio = answers.length > 0 ? correct / answers.length : 0
  let mastery = 'refuerzo'
  if (ratio === 1) mastery = 'dominio'
  else if (ratio >= 0.6) mastery = 'proceso'

  return {
    score: answers.reduce((sum, answer) => sum + answer.points, 0),
    correct,
    total: answers.length,
    mastery,
  }
}

function interleave(groups) {
  const result = []
  const longest = Math.max(0, ...groups.map((group) => group.length))
  for (let i = 0; i < longest; i += 1) {
    for (const group of groups) if (i < group.length) result.push(group[i])
  }
  return result
}

function shuffle(list, random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const NUMBER_WORDS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce']

/**
 * Typed answers in the Reto are forgiving: against the clock, «aceleracion»
 * and «aceleración», or «3» and «tres», are the same answer. (Lessons keep
 * accents strict: in Italian «è» and «e» are different words.)
 */
export function normalizeChallengeText(value) {
  const text = String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[.,;:!?¡¿"'«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const number = NUMBER_WORDS.indexOf(text)
  return number === -1 ? text : String(number)
}

export function isTypedAnswerRight(value, exercise) {
  const answer = normalizeChallengeText(value)
  return answer !== '' && [exercise.answer, ...(exercise.alternatives ?? [])].some((accepted) => normalizeChallengeText(accepted) === answer)
}
