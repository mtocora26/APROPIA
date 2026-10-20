import assert from 'node:assert/strict'
import test from 'node:test'
import { Rating, createEmptyCard, reviewCard } from '../fsrs/fsrs.js'
import {
  answerSession,
  buildReviewQueue,
  formatInterval,
  isSessionDone,
  startSession,
} from './flashcardSession.js'

const NOW = new Date('2026-10-20T10:00:00.000Z')
const DECK = { cards: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] }

test('queues never-seen cards and skips ones scheduled for later', () => {
  const learned = reviewCard(createEmptyCard(NOW), Rating.GOOD, NOW).card

  assert.deepEqual(buildReviewQueue(DECK, { a: learned }, NOW), ['b', 'c', 'd'])
})

test('limits the size of the queue', () => {
  assert.deepEqual(buildReviewQueue(DECK, {}, NOW, 2), ['a', 'b'])
})

test('answering removes the card and counts it', () => {
  const session = answerSession(startSession(['a', 'b']), Rating.GOOD)

  assert.deepEqual(session, { queue: ['b'], reviewed: 1, forgotten: 0 })
})

test('a forgotten card returns to the back of the queue', () => {
  const session = answerSession(startSession(['a', 'b']), Rating.AGAIN)

  assert.deepEqual(session, { queue: ['b', 'a'], reviewed: 1, forgotten: 1 })
})

test('the session ends once every card was answered without forgetting', () => {
  let session = startSession(['a'])
  session = answerSession(session, Rating.AGAIN)
  assert.equal(isSessionDone(session), false)

  session = answerSession(session, Rating.EASY)

  assert.equal(isSessionDone(session), true)
  assert.equal(answerSession(session, Rating.GOOD), session)
})

test('formats intervals for the rating buttons', () => {
  assert.equal(formatInterval(0), 'ya')
  assert.equal(formatInterval(3), '3 d')
  assert.equal(formatInterval(65), '2 meses')
  assert.equal(formatInterval(540), '1.5 años')
})
