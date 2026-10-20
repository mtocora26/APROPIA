import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../storage/memoryStorage.js'
import { SessionRepository, SessionStorageError } from './SessionRepository.js'

const KEY = 'tukola.sessions.ana'
const session = (id, date, createdAt = `${date}T10:00:00.000Z`) => ({
  id,
  date,
  createdAt,
  topics: [{ kind: 'deck', id: 'verbs', title: 'Verbos' }],
  note: '',
})

test('starts empty and keeps sessions ordered by date', async () => {
  const storage = createMemoryStorage()
  const repository = new SessionRepository({ storage, storageKey: KEY })
  assert.deepEqual(await repository.list(), [])

  await repository.add(session('b', '2026-10-20'))
  await repository.add(session('a', '2026-10-13'))

  const reloaded = new SessionRepository({ storage, storageKey: KEY })
  assert.deepEqual((await reloaded.list()).map((item) => item.id), ['a', 'b'])
})

test('students do not share sessions', async () => {
  const storage = createMemoryStorage()
  await new SessionRepository({ storage, storageKey: 'tukola.sessions.ana' }).add(
    session('a', '2026-10-13'),
  )

  assert.deepEqual(
    await new SessionRepository({ storage, storageKey: 'tukola.sessions.luis' }).list(),
    [],
  )
})

test('rejects invalid sessions and corrupt storage without overwriting', async () => {
  const storage = createMemoryStorage()
  const repository = new SessionRepository({ storage, storageKey: KEY })

  await assert.rejects(repository.add({ id: 'x' }), TypeError)

  storage.setItem(KEY, '{broken')
  await assert.rejects(repository.list(), SessionStorageError)
  await assert.rejects(repository.add(session('a', '2026-10-13')), SessionStorageError)
  assert.equal(storage.getItem(KEY), '{broken')
})
