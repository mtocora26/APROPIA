import assert from 'node:assert/strict'
import test from 'node:test'
import { validateDeck } from '../../domain/deck.js'
import { DECKS, getDeck } from './index.js'

test('every registered deck is valid and has a unique id', () => {
  for (const deck of DECKS) validateDeck(deck)
  assert.equal(new Set(DECKS.map((deck) => deck.id)).size, DECKS.length)
})

test('finds a deck by id', () => {
  assert.equal(getDeck('irregular-verbs').id, 'irregular-verbs')
  assert.equal(getDeck('nope'), null)
})

test('rejects malformed decks', () => {
  const ok = { id: 'd', title: 't', language: 'en', frontLabel: 'a', backLabel: 'b' }

  assert.throws(() => validateDeck({ ...ok, cards: [] }), /no tiene tarjetas/)
  assert.throws(
    () => validateDeck({ ...ok, cards: [{ id: 'x', front: 'a', back: 'b' }, { id: 'x', front: 'c', back: 'd' }] }),
    /repetido/,
  )
  assert.throws(() => validateDeck({ ...ok, cards: [{ id: 'x', front: 'a' }] }), /front y back/)
})
