import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../storage/memoryStorage.js'
import { StudentRepository, StudentStorageError } from './StudentRepository.js'
import { DEFAULT_STUDENT_ID } from './studentModel.js'

const NOW = '2026-10-20T10:00:00.000Z'

function createRepository(storage = createMemoryStorage()) {
  let counter = 0
  const repository = new StudentRepository({
    storage,
    now: () => NOW,
    generateId: () => `s${(counter += 1)}`,
  })
  return { repository, storage }
}

test('starts with the default student, without writing anything', () => {
  const { repository, storage } = createRepository()

  assert.deepEqual(
    repository.list().map((student) => student.id),
    [DEFAULT_STUDENT_ID],
  )
  assert.equal(repository.getActive().id, DEFAULT_STUDENT_ID)
  assert.equal(storage.length, 0)
})

test('adds a student, makes them active and persists the change', () => {
  const { repository, storage } = createRepository()

  const student = repository.add('  Ana ')

  assert.deepEqual(student, { id: 's1', name: 'Ana', createdAt: NOW })
  assert.equal(repository.getActive().id, 's1')
  assert.equal(createRepository(storage).repository.getActive().name, 'Ana')
})

test('rejects duplicated names, ignoring case', () => {
  const { repository } = createRepository()
  repository.add('Ana')

  assert.throws(() => repository.add('ana'), /Ya existe/)
  assert.throws(() => repository.rename(DEFAULT_STUDENT_ID, 'ANA'), /Ya existe/)
})

test('renames a student, keeping their id', () => {
  const { repository } = createRepository()
  const { id } = repository.add('Ana')

  repository.rename(id, 'Ana María')

  assert.equal(repository.list().find((student) => student.id === id).name, 'Ana María')
  assert.throws(() => repository.rename('nadie', 'X'), TypeError)
})

test('switches the active student and rejects unknown ones', () => {
  const { repository } = createRepository()
  repository.add('Ana')

  repository.setActive(DEFAULT_STUDENT_ID)

  assert.equal(repository.getActive().id, DEFAULT_STUDENT_ID)
  assert.throws(() => repository.setActive('nadie'), TypeError)
})

test('removing a student deletes their progress and moves the active one', () => {
  const { repository, storage } = createRepository()
  const { id } = repository.add('Ana')
  storage.setItem(`apropia.progress.${id}`, '{}')
  storage.setItem(`apropia.cards.${id}`, '{}')
  storage.setItem(`apropia.sessions.${id}`, '{}')
  storage.setItem('apropia.progress', '{"keep":true}')

  repository.remove(id)

  assert.equal(storage.getItem(`apropia.progress.${id}`), null)
  assert.equal(storage.getItem(`apropia.cards.${id}`), null)
  assert.equal(storage.getItem(`apropia.sessions.${id}`), null)
  assert.equal(storage.getItem('apropia.progress'), '{"keep":true}')
  assert.equal(repository.getActive().id, DEFAULT_STUDENT_ID)
  assert.equal(repository.list().length, 1)
})

test('the last student cannot be removed', () => {
  const { repository } = createRepository()

  assert.throws(() => repository.remove(DEFAULT_STUDENT_ID), /al menos un estudiante/)
})

test('reports corrupt stored data without overwriting it', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.students', '{not json')
  const { repository } = createRepository(storage)

  assert.throws(() => repository.list(), StudentStorageError)
  assert.throws(() => repository.add('Ana'), StudentStorageError)
  assert.equal(storage.getItem('apropia.students'), '{not json')
})
