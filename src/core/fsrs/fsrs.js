// FSRS (Free Spaced Repetition Scheduler), ported from legacy/assets/js/fsrs.js.
// Pure and deterministic: no storage, no clock (callers pass `now`), no DOM.
// Cards are plain JSON, so they can be stored per student.
// Reference: https://github.com/open-spaced-repetition/fsrs4anki

const DAY_MS = 24 * 60 * 60 * 1000

// FSRS-5 default parameters. The legacy copy had w4/w5 swapped in the initial
// difficulty, which clamped every difficulty to 1; the formulas below follow FSRS-5.
export const DEFAULT_W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
  1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
]

export const DEFAULT_DESIRED_RETENTION = 0.9

const DECAY = -0.5
const FACTOR = 19 / 81

export const State = Object.freeze({ NEW: 0, LEARNING: 1, REVIEW: 2, RELEARNING: 3 })

export const Rating = Object.freeze({ AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 })

const RATINGS = Object.values(Rating)

/** A card that was never reviewed. `due` is `now`, so new cards are due immediately. */
export function createEmptyCard(now = new Date()) {
  return {
    due: toDate(now).toISOString(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: State.NEW,
    lastReview: null,
  }
}

/** Probability of recalling a card `elapsedDays` after its last review. */
export function retrievability(elapsedDays, stability) {
  if (stability <= 0) return 0
  return Math.pow(1 + (FACTOR * elapsedDays) / stability, DECAY)
}

/** Days until a card with `stability` drops to `desiredRetention` (at least 1). */
export function nextInterval(stability, desiredRetention = DEFAULT_DESIRED_RETENTION) {
  return Math.max(
    1,
    Math.round((stability / FACTOR) * (Math.pow(desiredRetention, 1 / DECAY) - 1)),
  )
}

export function createScheduler({ w = DEFAULT_W, desiredRetention = DEFAULT_DESIRED_RETENTION } = {}) {
  const clampDifficulty = (d) => Math.min(10, Math.max(1, d))

  // D0(G) = w4 - e^(w5 (G - 1)) + 1
  const initDifficulty = (rating) =>
    clampDifficulty(w[4] - Math.exp(w[5] * (rating - 1)) + 1)

  // S0(G) = w[G - 1]
  const initStability = (rating) => Math.max(0.01, w[rating - 1])

  // Linear damping towards 10, then mean reversion towards D0(Easy).
  function nextDifficulty(d, rating) {
    const damped = d + (-w[6] * (rating - 3) * (10 - d)) / 9
    return clampDifficulty(w[7] * initDifficulty(Rating.EASY) + (1 - w[7]) * damped)
  }

  function nextRecallStability(d, s, r, rating) {
    const hardPenalty = rating === Rating.HARD ? w[15] : 1
    const easyBonus = rating === Rating.EASY ? w[16] : 1
    return (
      s *
      (1 +
        Math.exp(w[8]) *
          (11 - d) *
          Math.pow(s, -w[9]) *
          (Math.exp((1 - r) * w[10]) - 1) *
          hardPenalty *
          easyBonus)
    )
  }

  // Forgetting never raises stability.
  function nextForgetStability(d, s, r) {
    const forgotten =
      w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14])
    return Math.max(0.01, Math.min(s, forgotten))
  }

  /**
   * What each rating would do to `card`, without changing it.
   *
   * @returns {Record<number, { card: object, log: object }>} keyed by `Rating`
   */
  function repeat(card, now = new Date()) {
    const at = toDate(now)
    const elapsed = card.lastReview
      ? Math.max(0, (at - new Date(card.lastReview)) / DAY_MS)
      : 0
    const r = card.state === State.NEW ? 0 : retrievability(elapsed, card.stability)

    const results = {}
    for (const rating of RATINGS) {
      const next = { ...card, elapsedDays: elapsed, reps: card.reps + 1, lastReview: at.toISOString() }

      if (card.state === State.NEW) {
        next.difficulty = initDifficulty(rating)
        next.stability = initStability(rating)
      } else {
        next.difficulty = nextDifficulty(card.difficulty, rating)
        next.stability =
          rating === Rating.AGAIN
            ? nextForgetStability(next.difficulty, card.stability, r)
            : nextRecallStability(next.difficulty, card.stability, r, rating)
      }

      if (rating === Rating.AGAIN) {
        // Failed: stay in the learning cycle and show it again right away.
        next.state = card.state === State.NEW ? State.LEARNING : State.RELEARNING
        next.scheduledDays = 0
        next.due = at.toISOString()
        next.lapses = card.lapses + 1
      } else {
        next.state = State.REVIEW
        next.scheduledDays = nextInterval(next.stability, desiredRetention)
        next.due = new Date(at.getTime() + next.scheduledDays * DAY_MS).toISOString()
      }

      results[rating] = {
        card: next,
        log: {
          rating,
          state: card.state,
          due: card.due,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsedDays: elapsed,
          lastReview: card.lastReview,
          scheduledDays: next.scheduledDays,
          review: at.toISOString(),
        },
      }
    }

    return results
  }

  return { repeat, retrievability, nextInterval: (stability) => nextInterval(stability, desiredRetention) }
}

const defaultScheduler = createScheduler()

/** Applies `rating` to `card` with the default parameters. Returns `{ card, log }`. */
export function reviewCard(card, rating, now = new Date()) {
  if (!RATINGS.includes(rating)) throw new RangeError(`Calificación inválida: ${rating}`)
  return defaultScheduler.repeat(card, now)[rating]
}

/** Days until each rating would bring the card back, for the rating buttons. */
export function previewIntervals(card, now = new Date()) {
  const results = defaultScheduler.repeat(card, now)
  return {
    again: results[Rating.AGAIN].card.scheduledDays,
    hard: results[Rating.HARD].card.scheduledDays,
    good: results[Rating.GOOD].card.scheduledDays,
    easy: results[Rating.EASY].card.scheduledDays,
  }
}

/** A missing card is a never-seen one, so it counts as due. */
export function isDue(card, now = new Date()) {
  return !card || new Date(card.due) <= toDate(now)
}

/**
 * Items that need review now, from `ids` and the `cards` stored for them
 * (`{ [id]: card }`). Never-seen items come first, then the most forgotten.
 *
 * @returns {{ id: string, isNew: boolean, overdueDays: number, retrievability: number }[]}
 */
export function getDueItems(ids, cards, now = new Date()) {
  const at = toDate(now)
  const due = []

  for (const id of ids) {
    const card = cards[id]
    if (!card || card.state === State.NEW) {
      due.push({ id, isNew: true, overdueDays: Infinity, retrievability: 0 })
    } else if (isDue(card, at)) {
      due.push({
        id,
        isNew: false,
        overdueDays: (at - new Date(card.due)) / DAY_MS,
        retrievability: retrievability((at - new Date(card.lastReview)) / DAY_MS, card.stability),
      })
    }
  }

  return due.sort((a, b) => {
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
    return a.retrievability - b.retrievability
  })
}

/** Counts by state, items due now and average retention (0-100). */
export function getDeckStats(ids, cards, now = new Date()) {
  const at = toDate(now)
  let newCount = 0
  let learningCount = 0
  let reviewCount = 0
  let dueCount = 0
  let retentionSum = 0
  let retentionSamples = 0

  for (const id of ids) {
    const card = cards[id]
    if (!card || card.state === State.NEW) {
      newCount += 1
      dueCount += 1
      continue
    }

    if (card.state === State.REVIEW) reviewCount += 1
    else learningCount += 1

    if (isDue(card, at)) dueCount += 1

    if (card.lastReview && card.stability > 0) {
      retentionSum += retrievability((at - new Date(card.lastReview)) / DAY_MS, card.stability)
      retentionSamples += 1
    }
  }

  return {
    newCount,
    learningCount,
    reviewCount,
    dueCount,
    avgRetention: retentionSamples > 0 ? Math.round((retentionSum / retentionSamples) * 100) : 0,
  }
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}
