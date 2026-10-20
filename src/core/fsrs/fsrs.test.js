import assert from 'node:assert/strict'
import test from 'node:test'
import {
  Rating,
  State,
  createEmptyCard,
  getDeckStats,
  getDueItems,
  isDue,
  nextInterval,
  previewIntervals,
  retrievability,
  reviewCard,
} from './fsrs.js'

const NOW = new Date('2026-10-20T10:00:00.000Z')
const DAY_MS = 24 * 60 * 60 * 1000
const daysLater = (days) => new Date(NOW.getTime() + days * DAY_MS)

test('a new card is due immediately and has no history', () => {
  const card = createEmptyCard(NOW)

  assert.equal(card.state, State.NEW)
  assert.equal(card.reps, 0)
  assert.equal(card.lastReview, null)
  assert.ok(isDue(card, NOW))
})

test('retrievability is 1 right after review and decays with time', () => {
  assert.equal(retrievability(0, 5), 1)
  assert.ok(retrievability(10, 5) < retrievability(2, 5))
  assert.equal(retrievability(3, 0), 0)
})

test('the interval for 90% retention equals the stability', () => {
  assert.equal(nextInterval(10), 10)
  assert.equal(nextInterval(0.001), 1)
})

test('first review: Again keeps the card learning and due now', () => {
  const { card } = reviewCard(createEmptyCard(NOW), Rating.AGAIN, NOW)

  assert.equal(card.state, State.LEARNING)
  assert.equal(card.scheduledDays, 0)
  assert.equal(card.due, NOW.toISOString())
  assert.equal(card.reps, 1)
})

test('first review: better ratings schedule longer intervals', () => {
  const fresh = createEmptyCard(NOW)
  const days = (rating) => reviewCard(fresh, rating, NOW).card.scheduledDays

  assert.ok(days(Rating.HARD) <= days(Rating.GOOD))
  assert.ok(days(Rating.GOOD) < days(Rating.EASY))
  assert.equal(reviewCard(fresh, Rating.GOOD, NOW).card.state, State.REVIEW)
})

test('successful reviews at the due date make intervals grow', () => {
  let card = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const intervals = [card.scheduledDays]
  for (let i = 0; i < 3; i += 1) {
    card = reviewCard(card, Rating.GOOD, new Date(card.due)).card
    intervals.push(card.scheduledDays)
  }

  assert.ok(intervals[1] > intervals[0])
  assert.ok(intervals[2] > intervals[1])
  assert.ok(intervals[3] > intervals[2])
})

test('forgetting a reviewed card is a lapse that lowers its stability', () => {
  const learned = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const later = daysLater(learned.scheduledDays)

  const { card } = reviewCard(learned, Rating.AGAIN, later)

  assert.equal(card.state, State.RELEARNING)
  assert.equal(card.lapses, 1)
  assert.ok(card.stability < learned.stability)
  assert.equal(card.due, later.toISOString())
})

test('Easy keeps difficulty lower than Hard', () => {
  const learned = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const later = daysLater(learned.scheduledDays)

  assert.ok(
    reviewCard(learned, Rating.EASY, later).card.difficulty <
      reviewCard(learned, Rating.HARD, later).card.difficulty,
  )
})

test('reviewing does not mutate the original card and is deterministic', () => {
  const card = createEmptyCard(NOW)
  const snapshot = structuredClone(card)

  const first = reviewCard(card, Rating.GOOD, NOW)
  const second = reviewCard(card, Rating.GOOD, NOW)

  assert.deepEqual(card, snapshot)
  assert.deepEqual(first, second)
})

test('rejects an unknown rating', () => {
  assert.throws(() => reviewCard(createEmptyCard(NOW), 5, NOW), RangeError)
})

test('previews the interval of each rating', () => {
  const learned = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const intervals = previewIntervals(learned, daysLater(learned.scheduledDays))

  assert.equal(intervals.again, 0)
  assert.ok(intervals.hard <= intervals.good && intervals.good <= intervals.easy)
})

test('due items: never-seen first, then the most forgotten, skipping future ones', () => {
  const old = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const recent = reviewCard(createEmptyCard(daysLater(20)), Rating.GOOD, daysLater(20)).card
  const cards = { old, recent }
  const at = daysLater(old.scheduledDays + 10)

  const due = getDueItems(['recent', 'old', 'fresh'], cards, at)

  assert.deepEqual(
    due.map((item) => item.id),
    ['fresh', 'old'],
  )
  assert.ok(due[0].isNew)
  assert.ok(due[1].overdueDays > 0)
})

test('deck stats count states, due items and average retention', () => {
  const learned = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card
  const learning = reviewCard(createEmptyCard(NOW), Rating.AGAIN, NOW).card

  const stats = getDeckStats(['a', 'b', 'c'], { a: learned, b: learning }, NOW)

  assert.equal(stats.newCount, 1)
  assert.equal(stats.reviewCount, 1)
  assert.equal(stats.learningCount, 1)
  assert.equal(stats.dueCount, 2)
  assert.equal(stats.avgRetention, 100)
})
