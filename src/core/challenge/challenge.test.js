import assert from 'node:assert/strict'
import test from 'node:test'
import { pickQuestions, POINTS, scoreAnswer, summarize, timeLimitFor } from './challenge.js'

const ex = (id, type, extra = {}) => ({ id, type, prompt: id, ...extra })
const noShuffle = () => 0.999

test('picks quick questions across lessons and ends with an explanation', () => {
  const lessons = [
    [ex('a1', 'choice'), ex('a2', 'typed'), ex('a3', 'open'), ex('a4', 'dialogue')],
    [ex('b1', 'match'), ex('b2', 'choice'), ex('b3', 'open', { code: true })],
  ]
  const round = pickQuestions(lessons, { random: noShuffle })
  assert.equal(round.length, 5)
  assert.deepEqual(round.slice(0, 4).map((item) => item.id).sort(), ['a1', 'a2', 'b1', 'b2'])
  assert.equal(round.at(-1).id, 'a3')
  assert.ok(!round.some((item) => item.id === 'a4' || item.id === 'b3'))
})

test('without explanations the round is all quick questions', () => {
  const lessons = [[ex('a', 'choice'), ex('b', 'choice'), ex('c', 'typed'), ex('d', 'reorder'), ex('e', 'match'), ex('f', 'choice')]]
  const round = pickQuestions(lessons)
  assert.equal(round.length, 5)
  assert.ok(round.every((item) => item.type !== 'open'))
})

test('short topics give a shorter round', () => {
  assert.equal(pickQuestions([[ex('a', 'choice'), ex('b', 'open')]]).length, 2)
})

test('time limits per type; explanations are untimed', () => {
  assert.equal(timeLimitFor(ex('a', 'choice')), 20_000)
  assert.equal(timeLimitFor(ex('a', 'match')), 40_000)
  assert.equal(timeLimitFor(ex('a', 'open')), null)
})

test('points reward speed and streaks', () => {
  assert.equal(scoreAnswer({ correct: false, elapsedMs: 0, limitMs: 20_000, combo: 0 }), 0)
  assert.equal(scoreAnswer({ correct: true, elapsedMs: 0, limitMs: 20_000, combo: 1 }), POINTS.correct + POINTS.maxSpeedBonus)
  assert.equal(scoreAnswer({ correct: true, elapsedMs: 20_000, limitMs: 20_000, combo: 1 }), POINTS.correct)
  assert.equal(scoreAnswer({ correct: true, elapsedMs: 10_000, limitMs: 20_000, combo: 3 }), 100 + 25 + 40)
  assert.equal(scoreAnswer({ correct: true, elapsedMs: null, limitMs: null, combo: 5, explanation: true }), POINTS.explanation)
})

test('summary uses the course-map words', () => {
  const answers = (n, of) => Array.from({ length: of }, (_, i) => ({ correct: i < n, points: i < n ? 100 : 0 }))
  assert.deepEqual(summarize(answers(5, 5)), { score: 500, correct: 5, total: 5, mastery: 'dominio' })
  assert.equal(summarize(answers(3, 5)).mastery, 'proceso')
  assert.equal(summarize(answers(2, 5)).mastery, 'refuerzo')
})
