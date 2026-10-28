import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../storage/memoryStorage.js'
import { createLeaderboard, normalizeAlias } from './leaderboard.js'

function clock(start = Date.parse('2026-10-28T14:00:00Z')) {
  let t = start
  return () => new Date((t += 1000))
}

test('ranks the day by score, first come first served on ties', () => {
  const board = createLeaderboard(createMemoryStorage(), clock())
  const day = '2026-10-28'
  board.add({ alias: 'Ana', score: 400, correct: 4, total: 5, topic: 'Inglés', day })
  board.add({ alias: 'Luis', score: 650, correct: 5, total: 5, topic: 'Python', day })
  const { rank } = board.add({ alias: 'Sara', score: 400, correct: 4, total: 5, topic: 'Inglés', day })
  board.add({ alias: 'Ayer', score: 999, correct: 5, total: 5, topic: 'Inglés', day: '2026-10-27' })

  assert.equal(rank, 3)
  assert.deepEqual(board.top(day).map((entry) => entry.alias), ['Luis', 'Ana', 'Sara'])
  assert.deepEqual(board.top(day, 1).map((entry) => entry.alias), ['Luis'])

  board.clearDay(day)
  assert.deepEqual(board.top(day), [])
  assert.equal(board.top('2026-10-27').length, 1)
})

test('aliases are trimmed, collapsed and required', () => {
  assert.equal(normalizeAlias('  la   profe   de cálculo II  '), 'la profe de cálc')
  const board = createLeaderboard(createMemoryStorage())
  assert.throws(() => board.add({ alias: '   ', score: 1, day: '2026-10-28' }), TypeError)
})

test('corrupt storage reads as an empty board', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.reto.ranking', '{')
  assert.deepEqual(createLeaderboard(storage).top('2026-10-28'), [])
})
