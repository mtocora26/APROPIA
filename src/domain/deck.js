/**
 * Flashcard deck model, language-independent:
 *
 *   Deck { id, title, description, language, frontLabel, backLabel, cards: Card[] }
 *   Card { id, front, back, hint? }
 *
 * Decks live in the bundle (`src/content/decks/`); only each student's review
 * schedule is persisted (see `core/flashcards`).
 */

/** Returns `deck` if valid, otherwise throws. */
export function validateDeck(deck) {
  const where = `Mazo "${deck?.id}"`

  for (const field of ['id', 'title', 'language', 'frontLabel', 'backLabel']) {
    if (typeof deck?.[field] !== 'string' || deck[field] === '') {
      throw new TypeError(`${where}: falta "${field}"`)
    }
  }
  if (!Array.isArray(deck.cards) || deck.cards.length === 0) {
    throw new TypeError(`${where}: no tiene tarjetas`)
  }

  const ids = new Set()
  for (const card of deck.cards) {
    if (typeof card?.id !== 'string' || card.id === '' || ids.has(card.id)) {
      throw new TypeError(`${where}: id de tarjeta inválido o repetido (${card?.id})`)
    }
    ids.add(card.id)

    if (typeof card.front !== 'string' || card.front === '' ||
        typeof card.back !== 'string' || card.back === '') {
      throw new TypeError(`${where}: la tarjeta "${card.id}" necesita front y back`)
    }
  }

  return deck
}
