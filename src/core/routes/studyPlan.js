/**
 * Spreads a route's lessons over the days left until the exam: what to study
 * today and in which order. Pure (dates are ISO `YYYY-MM-DD` strings) so it
 * can be tested without a clock.
 *
 * With two or more days available, the day before the exam is kept for a
 * general review. Lessons keep their course order and each day gets a
 * similar amount of study time.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * @param {object} input
 * @param {{ id: string, seconds: number }[]} input.lessons  in course order
 * @param {string} input.today
 * @param {string} input.examDate
 * @returns {{ date: string, lessonIds: string[], review: boolean }[]}
 */
export function planStudyDays({ lessons, today, examDate }) {
  const daysLeft = daysBetween(today, examDate)
  if (lessons.length === 0) return []
  if (daysLeft <= 1) return [{ date: today, lessonIds: lessons.map((lesson) => lesson.id), review: false }]

  const studyDays = Math.min(daysLeft - 1, lessons.length)
  const groups = splitByTime(lessons, studyDays)

  const plan = groups.map((group, i) => ({
    date: addDays(today, i),
    lessonIds: group.map((lesson) => lesson.id),
    review: false,
  }))
  plan.push({ date: addDays(examDate, -1), lessonIds: [], review: true })
  return plan
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from, to) {
  return Math.round((toTime(to) - toTime(from)) / DAY_MS)
}

export function addDays(date, days) {
  return new Date(toTime(date) + days * DAY_MS).toISOString().slice(0, 10)
}

export function todayIso(now = new Date()) {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

// Greedy split in order: close a day once it reaches its share of the total,
// leaving at least one lesson for each remaining day.
function splitByTime(lessons, dayCount) {
  const groups = []
  let remaining = lessons.reduce((sum, lesson) => sum + lesson.seconds, 0)
  let current = []
  let currentSeconds = 0

  lessons.forEach((lesson, i) => {
    current.push(lesson)
    currentSeconds += lesson.seconds

    const daysAfter = dayCount - groups.length - 1
    const lessonsAfter = lessons.length - i - 1
    const share = remaining / (daysAfter + 1)
    const mustClose = lessonsAfter === daysAfter
    if (daysAfter > 0 && (currentSeconds >= share || mustClose)) {
      groups.push(current)
      remaining -= currentSeconds
      current = []
      currentSeconds = 0
    }
  })
  if (current.length > 0) groups.push(current)
  return groups
}

function toTime(date) {
  return Date.parse(`${date}T00:00:00Z`)
}
