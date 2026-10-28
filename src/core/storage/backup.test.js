import assert from 'node:assert/strict'
import test from 'node:test'
import { createBackup, restoreBackup } from './backup.js'
import { createMemoryStorage } from './memoryStorage.js'

test('backs up only apropia entries', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.progress', '{"a":1}')
  storage.setItem('apropia.students', '{"b":2}')
  storage.setItem('other.app', '{"c":3}')

  const backup = JSON.parse(createBackup(storage, '2026-10-20T00:00:00.000Z'))

  assert.deepEqual(backup.data, {
    'apropia.progress': '{"a":1}',
    'apropia.students': '{"b":2}',
  })
})

test('restores a backup replacing existing apropia data and keeping the rest', () => {
  const source = createMemoryStorage()
  source.setItem('apropia.progress', '{"a":1}')
  const text = createBackup(source)

  const target = createMemoryStorage()
  target.setItem('apropia.progress.old', '{"x":1}')
  target.setItem('other.app', 'keep')

  assert.equal(restoreBackup(target, text), 1)
  assert.equal(target.getItem('apropia.progress'), '{"a":1}')
  assert.equal(target.getItem('apropia.progress.old'), null)
  assert.equal(target.getItem('other.app'), 'keep')
})

test('an invalid backup changes nothing', () => {
  const storage = createMemoryStorage()
  storage.setItem('apropia.progress', '{"a":1}')
  const bad = [
    'not json',
    '{"app":"otra","version":1,"data":{}}',
    '{"app":"apropia","version":1,"data":{"evil.key":"{}"}}',
    '{"app":"apropia","version":1,"data":{"apropia.progress":"{broken"}}',
    '{"app":"apropia","version":1,"data":{"apropia.progress":5}}',
  ]

  for (const text of bad) {
    assert.throws(() => restoreBackup(storage, text), TypeError)
  }
  assert.equal(storage.getItem('apropia.progress'), '{"a":1}')
})

test('restores a backup made under the old Tukola name', () => {
  const storage = createMemoryStorage()
  const old = JSON.stringify({
    app: 'tukola',
    version: 1,
    data: { 'tukola.progress': '{"a":1}', 'tukola.students': '{"b":2}' },
  })

  assert.equal(restoreBackup(storage, old), 2)
  assert.equal(storage.getItem('apropia.progress'), '{"a":1}')
  assert.equal(storage.getItem('apropia.students'), '{"b":2}')
})
