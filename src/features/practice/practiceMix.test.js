import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildPractice } from './practiceMix.js'

const exercise = (id, from) => ({ id, from })
const COURSE = {
  modules: [
    { id: 'm1', lessons: [{ id: 'a', exercises: [exercise('a1'), exercise('a2')] }, { id: 'b', exercises: [exercise('b1')] }], reviewExercises: [exercise('r1', 'a')] },
    { id: 'm2', lessons: [{ id: 'c', exercises: [exercise('c1'), exercise('c2')] }] },
  ],
}

test('only draws from the chosen lessons and takes turns between lessons', () => {
  const picked = buildPractice(COURSE, ['a', 'b'], 2, () => 0.5).map((item) => item.id)

  assert.equal(picked.length, 2)
  assert.ok(picked.every((id) => ['a1', 'a2', 'r1', 'b1'].includes(id)))
  assert.ok(picked.includes('b1'))
})

test('stops at the available exercises', () => {
  assert.equal(buildPractice(COURSE, ['a', 'b', 'c'], 30).length, 6)
  assert.equal(buildPractice(COURSE, [], 10).length, 0)
})
