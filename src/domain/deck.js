/**
 * Flashcard deck model, language-independent:
 *
 *   Deck { id, title, description, language, frontLabel, backLabel, cards: Card[], packs?: Pack[] }
 *   Card { id, front, back, hint? }
 *   Pack { id, title, group, cardIds }  (a subset of the deck to practise on its own)
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

  for (const pack of deck.packs ?? []) {
    if (typeof pack?.id !== 'string' || typeof pack.title !== 'string' || !Array.isArray(pack.cardIds) || pack.cardIds.length === 0) {
      throw new TypeError(`${where}: paquete inválido (${pack?.id})`)
    }
    const unknown = pack.cardIds.find((cardId) => !ids.has(cardId))
    if (unknown !== undefined) {
      throw new TypeError(`${where}: el paquete "${pack.id}" usa una tarjeta que no existe (${unknown})`)
    }
  }

  return deck
}

/** Deck restricted to one pack, or the whole deck if `packId` is unknown. */
export function deckPack(deck, packId) {
  const pack = deck.packs?.find((item) => item.id === packId)
  if (!pack) return { deck, pack: null }

  const ids = new Set(pack.cardIds)
  return { deck: { ...deck, cards: deck.cards.filter((card) => ids.has(card.id)) }, pack }
}
