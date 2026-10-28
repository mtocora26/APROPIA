import assert from 'node:assert/strict'
import test from 'node:test'
import { deckPack, validateDeck } from '../../domain/deck.js'
import { DECKS, getDeck } from './index.js'

test('every registered deck is valid and has a unique id', () => {
  for (const deck of DECKS) validateDeck(deck)
  assert.equal(new Set(DECKS.map((deck) => deck.id)).size, DECKS.length)
})

test('finds a deck by id', () => {
  assert.equal(getDeck('verbs-base-past').id, 'verbs-base-past')
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

test('verb decks share one verb list and every pack points to real cards', () => {
  const decks = DECKS.filter((deck) => deck.id.startsWith('verbs-'))

  assert.equal(decks.length, 4)
  for (const deck of decks) {
    assert.ok(deck.packs.length > 0, deck.id)
    assert.ok(deck.packs.some((pack) => pack.group === 'Por tema'))
    assert.ok(deck.packs.some((pack) => pack.group === 'Por patrón'))
  }
  assert.equal(getDeck('verbs-sentences').cards.length, getDeck('verbs-base-past').cards.length * 2)
})

test('deckPack narrows a deck to one pack and falls back to the whole deck', () => {
  const deck = getDeck('verbs-three-forms')
  const pack = deck.packs[0]

  assert.equal(deckPack(deck, pack.id).deck.cards.length, pack.cardIds.length)
  assert.equal(deckPack(deck, 'nope').deck, deck)
})

test('rejects packs that reference unknown cards', () => {
  const deck = { id: 'd', title: 't', language: 'en', frontLabel: 'a', backLabel: 'b', cards: [{ id: 'x', front: 'a', back: 'b' }] }

  assert.throws(() => validateDeck({ ...deck, packs: [{ id: 'p', title: 'P', group: 'g', cardIds: ['y'] }] }), /no existe/)
})
