import assert from 'node:assert/strict'
import test from 'node:test'
import { migrateLegacyKey, migrateLegacyStorage } from './legacyKeys.js'
import { createMemoryStorage } from './memoryStorage.js'

test('renames only the legacy prefix', () => {
  assert.equal(migrateLegacyKey('tukola.progress.ana'), 'apropia.progress.ana')
  assert.equal(migrateLegacyKey('apropia.progress'), 'apropia.progress')
  assert.equal(migrateLegacyKey('other.tukola.x'), 'other.tukola.x')
})

test('moves legacy entries, keeping their values and unrelated keys', () => {
  const storage = createMemoryStorage()
  storage.setItem('tukola.progress', '{"a":1}')
  storage.setItem('tukola.students', '{"b":2}')
  storage.setItem('other', 'keep')

  assert.equal(migrateLegacyStorage(storage), 2)
  assert.equal(storage.getItem('apropia.progress'), '{"a":1}')
  assert.equal(storage.getItem('apropia.students'), '{"b":2}')
  assert.equal(storage.getItem('tukola.progress'), null)
  assert.equal(storage.getItem('other'), 'keep')
})

test('never overwrites data that already uses the new name', () => {
  const storage = createMemoryStorage()
  storage.setItem('tukola.progress', 'old')
  storage.setItem('apropia.progress', 'new')

  migrateLegacyStorage(storage)

  assert.equal(storage.getItem('apropia.progress'), 'new')
  assert.equal(storage.getItem('tukola.progress'), null)
})

test('is a no-op once migrated', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.progress', '{}')

  assert.equal(migrateLegacyStorage(storage), 0)
})
