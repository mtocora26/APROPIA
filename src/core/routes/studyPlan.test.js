import assert from 'node:assert/strict'
import test from 'node:test'
import { addDays, daysBetween, planStudyDays } from './studyPlan.js'

const lessons = (n, seconds = 600) => Array.from({ length: n }, (_, i) => ({ id: `l${i + 1}`, seconds }))

test('days between two ISO dates', () => {
  assert.equal(daysBetween('2026-10-27', '2026-11-03'), 7)
  assert.equal(daysBetween('2026-10-27', '2026-10-27'), 0)
  assert.equal(addDays('2026-10-31', 1), '2026-11-01')
})

test('spreads lessons in order and keeps the day before the exam for review', () => {
  const plan = planStudyDays({ lessons: lessons(6), today: '2026-10-27', examDate: '2026-10-31' })
  assert.deepEqual(plan, [
    { date: '2026-10-27', lessonIds: ['l1', 'l2'], review: false },
    { date: '2026-10-28', lessonIds: ['l3', 'l4'], review: false },
    { date: '2026-10-29', lessonIds: ['l5', 'l6'], review: false },
    { date: '2026-10-30', lessonIds: [], review: true },
  ])
})

test('never uses more study days than lessons', () => {
  const plan = planStudyDays({ lessons: lessons(2), today: '2026-10-27', examDate: '2026-11-20' })
  assert.equal(plan.length, 3)
  assert.deepEqual(plan.map((day) => day.lessonIds), [['l1'], ['l2'], []])
  assert.equal(plan.at(-1).date, '2026-11-19')
})

test('every study day gets at least one lesson even with uneven times', () => {
  const uneven = [{ id: 'a', seconds: 3000 }, { id: 'b', seconds: 60 }, { id: 'c', seconds: 60 }]
  const plan = planStudyDays({ lessons: uneven, today: '2026-10-27', examDate: '2026-10-31' })
  assert.deepEqual(plan.map((day) => day.lessonIds), [['a'], ['b'], ['c'], []])
})

test('exam tomorrow or already past: everything today', () => {
  for (const examDate of ['2026-10-28', '2026-10-27', '2026-10-20']) {
    const plan = planStudyDays({ lessons: lessons(3), today: '2026-10-27', examDate })
    assert.deepEqual(plan, [{ date: '2026-10-27', lessonIds: ['l1', 'l2', 'l3'], review: false }])
  }
})
