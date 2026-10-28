import assert from 'node:assert/strict'
import { test } from 'node:test'
import { studiedLessons } from './studiedLessons.js'

test('joins manual marks, tutoring topics and completed lessons of the course', () => {
  const result = studiedLessons({
    courseId: 'en',
    manual: ['m1'],
    sessions: [{ topics: [{ kind: 'lesson', courseId: 'en', id: 's1' }, { kind: 'lesson', courseId: 'it', id: 'x' }, { kind: 'deck', id: 'd' }] }],
    progress: { exercises: { p1: { status: 'completed' }, p2: { status: 'started' } } },
  })

  assert.deepEqual([...result.all].sort(), ['m1', 'p1', 's1'])
  assert.deepEqual([...result.manual], ['m1'])
})
