import { VERB_DECKS } from './verbDecks.js'

// Registro de mazos: agregar un mazo = agregar su archivo y listarlo aquí.
export const DECKS = Object.freeze([...VERB_DECKS])

export function getDeck(deckId) {
  return DECKS.find((deck) => deck.id === deckId) ?? null
}
