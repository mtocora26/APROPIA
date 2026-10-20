import { IRREGULAR_VERBS } from './irregularVerbs.js'
import { REGULAR_VERBS } from './regularVerbs.js'

// Registro de mazos: agregar un mazo = agregar su archivo y listarlo aquí.
export const DECKS = Object.freeze([IRREGULAR_VERBS, REGULAR_VERBS])

export function getDeck(deckId) {
  return DECKS.find((deck) => deck.id === deckId) ?? null
}
