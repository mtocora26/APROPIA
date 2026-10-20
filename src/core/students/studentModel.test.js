import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DEFAULT_STUDENT_ID,
  createDefaultStudentsData,
  normalizeStudentName,
  cardsStorageKey,
  progressStorageKey,
  studentStorageKeys,
  validateStudentsData,
} from './studentModel.js'

test('the default student keeps the historical progress key', () => {
  assert.equal(progressStorageKey(DEFAULT_STUDENT_ID), 'tukola.progress')
})

test('other students get their own progress key', () => {
  assert.equal(progressStorageKey('ab12'), 'tukola.progress.ab12')
  assert.notEqual(progressStorageKey('ab12'), progressStorageKey('cd34'))
})

test('normalizes names and rejects empty or too long ones', () => {
  assert.equal(normalizeStudentName('  Ana   María '), 'Ana María')
  assert.throws(() => normalizeStudentName('   '), TypeError)
  assert.throws(() => normalizeStudentName(null), TypeError)
  assert.throws(() => normalizeStudentName('x'.repeat(41)), TypeError)
})

test('validates the students document', () => {
  const data = createDefaultStudentsData('2026-10-20T00:00:00.000Z')

  assert.equal(validateStudentsData(data), data)
  assert.throws(() => validateStudentsData({ ...data, version: 2 }), TypeError)
  assert.throws(() => validateStudentsData({ ...data, students: [] }), TypeError)
  assert.throws(() => validateStudentsData({ ...data, activeId: 'nadie' }), TypeError)
  assert.throws(
    () => validateStudentsData({ ...data, students: [data.students[0], data.students[0]] }),
    TypeError,
  )
})

test('cards follow the same key rule as progress', () => {
  assert.equal(cardsStorageKey(DEFAULT_STUDENT_ID), 'tukola.cards')
  assert.equal(cardsStorageKey('ab12'), 'tukola.cards.ab12')
  assert.deepEqual(studentStorageKeys('ab12'), [
    'tukola.progress.ab12',
    'tukola.cards.ab12',
    'tukola.sessions.ab12',
  ])
})
