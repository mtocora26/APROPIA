import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../storage/memoryStorage.js'
import { FlashcardRepository, FlashcardStorageError } from './FlashcardRepository.js'

const KEY = 'apropia.cards.ana'

test('returns no cards for a deck never studied', async () => {
  const repository = new FlashcardRepository({ storage: createMemoryStorage(), storageKey: KEY })

  assert.deepEqual(await repository.getCards('verbs'), {})
})

test('persists cards per deck across instances', async () => {
  const storage = createMemoryStorage()
  await new FlashcardRepository({ storage, storageKey: KEY }).saveCard('verbs', 'go', { reps: 1 })
  await new FlashcardRepository({ storage, storageKey: KEY }).saveCard('verbs', 'do', { reps: 2 })
  await new FlashcardRepository({ storage, storageKey: KEY }).saveCard('other', 'go', { reps: 9 })

  const reloaded = new FlashcardRepository({ storage, storageKey: KEY })

  assert.deepEqual(await reloaded.getCards('verbs'), { go: { reps: 1 }, do: { reps: 2 } })
  assert.deepEqual(await reloaded.getCards('other'), { go: { reps: 9 } })
})

test('students with different keys do not share cards', async () => {
  const storage = createMemoryStorage()
  const ana = new FlashcardRepository({ storage, storageKey: 'apropia.cards.ana' })
  const luis = new FlashcardRepository({ storage, storageKey: 'apropia.cards.luis' })

  await ana.saveCard('verbs', 'go', { reps: 1 })

  assert.deepEqual(await luis.getCards('verbs'), {})
})

test('reports corrupt or unknown data without overwriting it', async () => {
  const storage = createMemoryStorage()
  const repository = new FlashcardRepository({ storage, storageKey: KEY })

  storage.setItem(KEY, '{broken')
  await assert.rejects(repository.getCards('verbs'), FlashcardStorageError)
  await assert.rejects(repository.saveCard('verbs', 'go', {}), FlashcardStorageError)
  assert.equal(storage.getItem(KEY), '{broken')

  storage.setItem(KEY, '{"version":99,"decks":{}}')
  await assert.rejects(repository.getCards('verbs'), FlashcardStorageError)
})
