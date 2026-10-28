import { STUDENT_CARDS_VERSION } from '../students/studentModel.js'

export class FlashcardStorageError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'FlashcardStorageError'
  }
}

/**
 * Persists one student's FSRS cards, grouped by deck:
 * `{ version, decks: { [deckId]: { [cardId]: fsrsCard } } }`.
 * Asynchronous like `ProgressRepository`, so a remote store can replace it.
 */
export class FlashcardRepository {
  constructor({ storage = globalThis.localStorage, storageKey }) {
    this.storage = storage
    this.storageKey = storageKey
  }

  /** @returns {Promise<Record<string, object>>} FSRS cards by card id (empty if none) */
  async getCards(deckId) {
    const data = this.#read()
    return Object.hasOwn(data.decks, deckId) ? data.decks[deckId] : {}
  }

  /** @returns {Promise<object>} the saved card */
  async saveCard(deckId, cardId, card) {
    const data = this.#read()
    const deck = Object.hasOwn(data.decks, deckId) ? data.decks[deckId] : {}

    this.#write({ ...data, decks: { ...data.decks, [deckId]: { ...deck, [cardId]: card } } })
    return card
  }

  #read() {
    let serialized
    try {
      serialized = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new FlashcardStorageError('No se pudieron leer las tarjetas', { cause: error })
    }

    if (serialized === null) return { version: STUDENT_CARDS_VERSION, decks: {} }

    let data
    try {
      data = JSON.parse(serialized)
    } catch (error) {
      throw new FlashcardStorageError('Las tarjetas guardadas no son JSON válido', { cause: error })
    }

    if (
      typeof data !== 'object' ||
      data === null ||
      data.version !== STUDENT_CARDS_VERSION ||
      typeof data.decks !== 'object' ||
      data.decks === null ||
      Array.isArray(data.decks)
    ) {
      throw new FlashcardStorageError('Las tarjetas guardadas tienen un formato desconocido')
    }

    return data
  }

  #write(data) {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      throw new FlashcardStorageError('No se pudieron guardar las tarjetas', { cause: error })
    }
  }
}
