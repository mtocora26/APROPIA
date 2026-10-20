import assert from 'node:assert/strict'
import test from 'node:test'
import {
  LocalStorageRepository,
  ProgressStorageError,
} from './LocalStorageRepository.js'
import { createEmptyProgress } from './progressModel.js'

const UPDATED_AT = '2026-09-23T02:45:00.000Z'

test('returns a safe empty state when a course has no progress', async () => {
  const repository = createRepository()

  assert.deepEqual(
    await repository.getProgress('italian-a1'),
    createEmptyProgress('italian-a1'),
  )
})

test('persists progress for a new repository instance', async () => {
  const storage = createMemoryStorage()
  const repository = createRepository(storage)
  const progress = exampleProgress()

  const saved = await repository.saveProgress('italian-a1', progress)
  const reloadedRepository = createRepository(storage)

  assert.equal(saved.updatedAt, UPDATED_AT)
  assert.deepEqual(
    await reloadedRepository.getProgress('italian-a1'),
    saved,
  )
})

test('keeps progress from different courses isolated', async () => {
  const repository = createRepository()

  await repository.saveProgress('italian-a1', exampleProgress())

  assert.deepEqual(
    await repository.getProgress('business-english'),
    createEmptyProgress('business-english'),
  )
})

test('replaces a course progress snapshot without affecting other courses', async () => {
  const repository = createRepository()
  const initial = exampleProgress()

  await repository.saveProgress('italian-a1', initial)
  await repository.saveProgress('business-english', {
    ...initial,
    courseId: 'business-english',
  })
  await repository.saveProgress('italian-a1', {
    ...initial,
    exercises: {
      ...initial.exercises,
      'essere-2': {
        exerciseId: 'essere-2',
        status: 'in_progress',
        score: 50,
        attempts: 1,
        updatedAt: '2026-09-23T02:44:00.000Z',
        completedAt: null,
      },
    },
  })

  const italian = await repository.getProgress('italian-a1')
  const english = await repository.getProgress('business-english')

  assert.equal(Object.keys(italian.exercises).length, 2)
  assert.equal(Object.keys(english.exercises).length, 1)
})

test('clears only the selected course', async () => {
  const repository = createRepository()

  await repository.saveProgress('italian-a1', exampleProgress())
  await repository.clearProgress('italian-a1')

  assert.deepEqual(
    await repository.getProgress('italian-a1'),
    createEmptyProgress('italian-a1'),
  )
})

test('rejects invalid progress before writing it', async () => {
  const storage = createMemoryStorage()
  const repository = createRepository(storage)

  await assert.rejects(
    repository.saveProgress('italian-a1', {
      ...exampleProgress(),
      courseId: 'another-course',
    }),
    /progress\.courseId must match courseId/,
  )
  assert.equal(storage.getItem('apropia.progress'), null)
})

test('reports corrupt stored data instead of silently deleting it', async () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.progress', '{invalid')
  const repository = createRepository(storage)

  await assert.rejects(
    repository.getProgress('italian-a1'),
    ProgressStorageError,
  )
  assert.equal(storage.getItem('apropia.progress'), '{invalid')
})

function createRepository(storage = createMemoryStorage()) {
  return new LocalStorageRepository({
    storage,
    now: () => UPDATED_AT,
  })
}

function createMemoryStorage() {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
  }
}

function exampleProgress() {
  return {
    courseId: 'italian-a1',
    exercises: {
      'essere-1': {
        exerciseId: 'essere-1',
        status: 'completed',
        score: 100,
        attempts: 1,
        updatedAt: '2026-09-23T02:43:00.000Z',
        completedAt: '2026-09-23T02:43:00.000Z',
      },
    },
    updatedAt: null,
  }
}
