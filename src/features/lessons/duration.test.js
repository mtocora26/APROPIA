import assert from 'node:assert/strict'
import test from 'node:test'
import { formatMinutes, lessonMinutes, lessonSeconds, moduleMinutes } from './duration.js'

const lesson = {
  theory: [
    { type: 'text', text: 'uno dos tres cuatro cinco' },
    { type: 'example', text: 'I have eaten.', translation: 'He comido.' },
    { type: 'table', columns: ['a', 'b'], rows: [['x', 'y'], ['z', 'w']] },
  ],
  exercises: [
    { id: 'e1', type: 'choice' },
    { id: 'e2', type: 'open' },
    { id: 'e3', type: 'dialogue', lines: [{}, {}, {}] },
  ],
}

test('adds theory and exercise time', () => {
  const seconds = lessonSeconds(lesson)

  // 5 words + example + 4 cells + 15 + 90 + 60
  assert.ok(seconds > 15 + 90 + 60 + 8 + 12)
  assert.ok(seconds < 15 + 90 + 60 + 8 + 12 + 10)
})

test('a class takes longer than working alone', () => {
  assert.ok(lessonSeconds(lesson, 'class') > lessonSeconds(lesson, 'self'))
})

test('lesson minutes are never below 1', () => {
  assert.equal(lessonMinutes({ theory: [], exercises: [{ type: 'choice' }] }), 1)
})

test('coding exercises reserve time to write and test in PSeInt', () => {
  assert.equal(lessonMinutes({ theory: [], exercises: [{ type: 'open', code: true }] }), 8)
  assert.equal(lessonMinutes({ theory: [], exercises: [{ type: 'open', code: true, practiceMinutes: 40 }] }), 40)
  assert.equal(lessonMinutes({ theory: [], exercises: [{ type: 'open', code: true, practiceMinutes: 40 }] }, 'class'), 40)
})

test('module minutes round to 5 once long, and sum the lessons', () => {
  const long = { lessons: Array.from({ length: 8 }, () => lesson) }

  assert.equal(moduleMinutes(long) % 5, 0)
  assert.equal(moduleMinutes({ lessons: [lesson] }), 3)
})

test('formats minutes', () => {
  assert.equal(formatMinutes(12), '≈ 12 min')
})
