import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../storage/memoryStorage.js'
import { courseFromDraft } from './routeFromAi.js'
import { createRouteStore } from './routeStore.js'

const course = (id) =>
  courseFromDraft(
    { title: id, modules: [{ title: 'M', lessons: [{ title: 'L', theory: [], exercises: [{ type: 'open', prompt: 'p', modelAnswer: 'r' }] }] }] },
    { id },
  )

test('saves, lists newest first, replaces by id and removes', () => {
  const store = createRouteStore(createMemoryStorage())
  store.save({ course: course('ruta-a'), examDate: '2026-11-03', createdAt: '2026-10-27T10:00:00Z', source: 'ia' })
  store.save({ course: course('ruta-b'), examDate: '2026-11-03', createdAt: '2026-10-27T11:00:00Z', source: 'ejemplo' })
  assert.deepEqual(store.list().map((route) => route.course.id), ['ruta-b', 'ruta-a'])

  store.save({ course: course('ruta-a'), examDate: '2026-11-10', createdAt: '2026-10-27T12:00:00Z', source: 'ia' })
  assert.equal(store.list().length, 2)
  assert.equal(store.get('ruta-a').examDate, '2026-11-10')

  store.remove('ruta-a')
  assert.equal(store.get('ruta-a'), null)
})

test('ignores corrupt storage and rejects invalid routes', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.routes', '{nope')
  const store = createRouteStore(storage)
  assert.deepEqual(store.list(), [])
  assert.throws(() => store.save({ course: course('ruta-a'), examDate: 'mañana', createdAt: 'x' }), TypeError)
})
