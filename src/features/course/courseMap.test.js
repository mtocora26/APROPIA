import assert from 'node:assert/strict'
import test from 'node:test'
import { createEmptyProgress } from '../../core/storage/progressModel.js'
import { buildCourseMap, findMapNode, LESSON_STATUS, nodeState } from './courseMap.js'

const exercise = (id) => ({ id, type: 'choice', prompt: '?', options: ['a', 'b'], answer: 'a' })
const lesson = (id) => ({ id, title: id, theory: [], exercises: [exercise(`${id}-e1`)] })

const course = {
  id: 'c',
  title: 'C',
  language: 'it',
  level: 'A1',
  modules: [
    { id: 'm1', title: 'M1', lessons: [lesson('l1'), lesson('l2')] },
    { id: 'm2', title: 'M2', lessons: [lesson('l3')] },
  ],
}

function record(id, fields) {
  return {
    exerciseId: id,
    status: 'completed',
    score: 50,
    attempts: 1,
    updatedAt: '2026-10-04T10:00:00.000Z',
    completedAt: '2026-10-04T10:00:00.000Z',
    ...fields,
  }
}

function progressWith(records) {
  return { ...createEmptyProgress('c'), exercises: records }
}

const statuses = (map) =>
  map.modules.flatMap(({ lessons }) => lessons.map((node) => [node.lesson.id, node.status]))

test('without progress only the first lesson is available', () => {
  const map = buildCourseMap(course, createEmptyProgress('c'))

  assert.deepEqual(statuses(map), [
    ['l1', LESSON_STATUS.AVAILABLE],
    ['l2', LESSON_STATUS.LOCKED],
    ['m1-repaso', LESSON_STATUS.LOCKED],
    ['l3', LESSON_STATUS.LOCKED],
  ])
  assert.equal(map.currentLessonId, 'l1')
  assert.equal(map.stars, 0)
  assert.equal(map.maxStars, 12)
})

test('tutor sees every lesson without changing the student unlock sequence', () => {
  const progress = createEmptyProgress('c')
  const tutor = buildCourseMap(course, progress, { unlockAll: true })

  assert.ok(statuses(tutor).every(([, status]) => status === LESSON_STATUS.AVAILABLE))
  assert.equal(tutor.currentLessonId, 'l1')
  assert.equal(findMapNode(buildCourseMap(course, progress), 'l3').status, LESSON_STATUS.LOCKED)
})

test('completing a lesson unlocks the next one, across modules', () => {
  const map = buildCourseMap(
    course,
    progressWith({
      l1: record('l1', { bestScore: 95, xp: 100 }),
      l2: record('l2', { bestScore: 70, xp: 60 }),
      'm1-repaso': record('m1-repaso', { score: 40 }),
    }),
  )

  assert.deepEqual(statuses(map), [
    ['l1', LESSON_STATUS.COMPLETED],
    ['l2', LESSON_STATUS.COMPLETED],
    ['m1-repaso', LESSON_STATUS.COMPLETED],
    ['l3', LESSON_STATUS.AVAILABLE],
  ])
  assert.equal(map.currentLessonId, 'l3')
  assert.equal(map.stars, 3 + 2 + 1)
  assert.equal(map.totalXp, 160)
})

test('stars use the best score, falling back to score for old records', () => {
  const map = buildCourseMap(
    course,
    progressWith({ l1: record('l1', { score: 92 }) }),
  )

  assert.equal(findMapNode(map, 'l1').stars, 3)
  assert.equal(findMapNode(map, 'l1').bestScore, 92)
  assert.equal(findMapNode(map, 'nope'), null)
})

test('when everything is completed there is no current lesson', () => {
  const all = Object.fromEntries(
    ['l1', 'l2', 'm1-repaso', 'l3'].map((id) => [id, record(id, { bestScore: 100 })]),
  )
  const map = buildCourseMap(course, progressWith(all))

  assert.equal(map.currentLessonId, null)
  assert.equal(map.stars, map.maxStars)
})

test('nodeState names the learning state of each node', () => {
  assert.equal(nodeState({ status: LESSON_STATUS.COMPLETED, stars: 3 }), 'dominio')
  assert.equal(nodeState({ status: LESSON_STATUS.COMPLETED, stars: 2 }), 'refuerzo')
  assert.equal(nodeState({ status: LESSON_STATUS.AVAILABLE, stars: 0 }), 'proceso')
  assert.equal(nodeState({ status: LESSON_STATUS.LOCKED, stars: 0 }), 'pendiente')
})
