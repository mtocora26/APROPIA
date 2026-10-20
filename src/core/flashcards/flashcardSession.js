import { Rating, getDueItems } from '../fsrs/fsrs.js'

export const DEFAULT_SESSION_SIZE = 15

/**
 * Cards to review now for `deck`: never-seen first, then the most forgotten.
 *
 * @param {object} deck
 * @param {Record<string, object>} cards FSRS cards by card id
 * @returns {string[]} card ids, at most `limit`
 */
export function buildReviewQueue(deck, cards, now, limit = DEFAULT_SESSION_SIZE) {
  return getDueItems(
    deck.cards.map((card) => card.id),
    cards,
    now,
  )
    .slice(0, limit)
    .map((item) => item.id)
}

export function startSession(queue) {
  return { queue, reviewed: 0, forgotten: 0 }
}

export function isSessionDone(session) {
  return session.queue.length === 0
}

/**
 * Rates the card at the head of the queue. A forgotten card goes to the back
 * of the queue and must be answered again before the session ends.
 */
export function answerSession(session, rating) {
  if (isSessionDone(session)) return session

  const [head, ...rest] = session.queue
  const forgot = rating === Rating.AGAIN

  return {
    queue: forgot ? [...rest, head] : rest,
    reviewed: session.reviewed + 1,
    forgotten: session.forgotten + (forgot ? 1 : 0),
  }
}

/** Short label for a review interval in days, e.g. "ya", "3 d", "2 meses". */
export function formatInterval(days) {
  if (days <= 0) return 'ya'
  if (days < 30) return `${days} d`
  if (days < 365) return `${Math.round(days / 30)} meses`
  return `${Math.round((days / 365) * 10) / 10} años`
}
