import assert from 'node:assert/strict'
import test from 'node:test'
import { createBackup, restoreBackup } from './backup.js'
import { createMemoryStorage } from './memoryStorage.js'

test('backs up only tukola entries', () => {
  const storage = createMemoryStorage()
  storage.setItem('tukola.progress', '{"a":1}')
  storage.setItem('tukola.students', '{"b":2}')
  storage.setItem('other.app', '{"c":3}')

  const backup = JSON.parse(createBackup(storage, '2026-10-20T00:00:00.000Z'))

  assert.deepEqual(backup.data, {
    'tukola.progress': '{"a":1}',
    'tukola.students': '{"b":2}',
  })
})

test('restores a backup replacing existing tukola data and keeping the rest', () => {
  const source = createMemoryStorage()
  source.setItem('tukola.progress', '{"a":1}')
  const text = createBackup(source)

  const target = createMemoryStorage()
  target.setItem('tukola.progress.old', '{"x":1}')
  target.setItem('other.app', 'keep')

  assert.equal(restoreBackup(target, text), 1)
  assert.equal(target.getItem('tukola.progress'), '{"a":1}')
  assert.equal(target.getItem('tukola.progress.old'), null)
  assert.equal(target.getItem('other.app'), 'keep')
})

test('an invalid backup changes nothing', () => {
  const storage = createMemoryStorage()
  storage.setItem('tukola.progress', '{"a":1}')
  const bad = [
    'not json',
    '{"app":"otra","version":1,"data":{}}',
    '{"app":"tukola","version":1,"data":{"evil.key":"{}"}}',
    '{"app":"tukola","version":1,"data":{"tukola.progress":"{broken"}}',
    '{"app":"tukola","version":1,"data":{"tukola.progress":5}}',
  ]

  for (const text of bad) {
    assert.throws(() => restoreBackup(storage, text), TypeError)
  }
  assert.equal(storage.getItem('tukola.progress'), '{"a":1}')
})
