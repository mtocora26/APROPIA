import { localDateKey } from '../gamification/playerStats.js'

export const MAX_NOTE_LENGTH = 1000

/**
 * A tutoring session is what was covered with one student on one day:
 *
 *   Session { id, date: "YYYY-MM-DD", createdAt, topics: Topic[], note }
 *   Topic   { kind: "lesson", courseId, id, title } | { kind: "deck", id, title }
 *
 * Titles are copied into the session so the history survives content changes.
 */

export function lessonTopic(course, lesson) {
  return { kind: 'lesson', courseId: course.id, id: lesson.id, title: lesson.title }
}

export function deckTopic(deck) {
  return { kind: 'deck', id: deck.id, title: deck.title }
}

export function topicKey(topic) {
  return topic.kind === 'lesson' ? `lesson:${topic.courseId}:${topic.id}` : `deck:${topic.id}`
}

/** Builds a valid session or throws. Repeated topics are dropped. */
export function createSession({ id, date, createdAt, topics = [], note = '' }) {
  const cleanNote = typeof note === 'string' ? note.trim() : ''
  if (cleanNote.length > MAX_NOTE_LENGTH) {
    throw new TypeError(`La nota no puede superar ${MAX_NOTE_LENGTH} caracteres`)
  }

  const unique = [...new Map(topics.map((topic) => [topicKey(topic), topic])).values()]
  if (unique.length === 0 && cleanNote === '') {
    throw new TypeError('Agrega al menos un tema o una nota')
  }

  return validateSession({ id, date, createdAt, topics: unique, note: cleanNote })
}

/** Returns `session` if valid, otherwise throws. */
export function validateSession(session) {
  const invalid = () => new TypeError('La sesión guardada no es válida')

  if (
    typeof session !== 'object' ||
    session === null ||
    typeof session.id !== 'string' ||
    session.id === '' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(session.date) ||
    typeof session.createdAt !== 'string' ||
    typeof session.note !== 'string' ||
    !Array.isArray(session.topics)
  ) {
    throw invalid()
  }

  for (const topic of session.topics) {
    const ok =
      typeof topic === 'object' &&
      topic !== null &&
      typeof topic.id === 'string' &&
      typeof topic.title === 'string' &&
      (topic.kind === 'deck' ||
        (topic.kind === 'lesson' && typeof topic.courseId === 'string'))
    if (!ok) throw invalid()
  }

  return session
}

/**
 * Topics the student practiced on `today`, to pre-fill the end-of-class form.
 *
 * @param {object} data
 * @param {object[]} data.courses
 * @param {object[]} data.decks
 * @param {Record<string, object>} data.progressByCourse progress by course id
 * @param {Record<string, Record<string, object>>} data.cardsByDeck FSRS cards by deck id
 * @param {string} data.today local "YYYY-MM-DD"
 */
export function suggestTopics({ courses, decks, progressByCourse, cardsByDeck, today }) {
  const topics = []

  for (const course of courses) {
    const records = progressByCourse[course.id]?.exercises ?? {}
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const record = records[lesson.id]
        if (record?.updatedAt && localDateKey(new Date(record.updatedAt)) === today) {
          topics.push(lessonTopic(course, lesson))
        }
      }
    }
  }

  for (const deck of decks) {
    const cards = Object.values(cardsByDeck[deck.id] ?? {})
    if (cards.some((card) => card.lastReview && localDateKey(new Date(card.lastReview)) === today)) {
      topics.push(deckTopic(deck))
    }
  }

  return topics
}

/**
 * What to show at the start of a class: the last session, its lessons from the
 * weakest to the strongest (no attempt first), and decks with cards due.
 *
 * @returns {{
 *   lastSession: object | null,
 *   lessons: { topic: object, bestScore: number | null }[],
 *   decks: { deck: object, dueCount: number }[],
 * }}
 */
export function buildRecap({ sessions, progressByCourse, decksDue }) {
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null

  const lessons = (lastSession?.topics ?? [])
    .filter((topic) => topic.kind === 'lesson')
    .map((topic) => {
      const record = progressByCourse[topic.courseId]?.exercises?.[topic.id]
      return { topic, bestScore: record ? (record.bestScore ?? record.score ?? null) : null }
    })
    .sort((a, b) => (a.bestScore ?? -1) - (b.bestScore ?? -1))

  return { lastSession, lessons, decks: decksDue.filter((item) => item.dueCount > 0) }
}
