export const STUDIED_VERSION = 1

export class StudiedStorageError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'StudiedStorageError'
  }
}

/** The lessons a student has been marked as having studied: `{ version, lessons: string[] }`. */
export class StudiedRepository {
  constructor({ storage = globalThis.localStorage, storageKey }) {
    this.storage = storage
    this.storageKey = storageKey
  }

  async list() {
    let serialized
    try {
      serialized = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new StudiedStorageError('No se pudo leer lo estudiado', { cause: error })
    }

    if (serialized === null) return []

    try {
      const data = JSON.parse(serialized)
      if (data?.version !== STUDIED_VERSION || !Array.isArray(data.lessons)) throw new TypeError('formato desconocido')
      return data.lessons.filter((id) => typeof id === 'string')
    } catch (error) {
      throw new StudiedStorageError('Lo estudiado guardado no es válido', { cause: error })
    }
  }

  async save(lessonIds) {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify({ version: STUDIED_VERSION, lessons: [...new Set(lessonIds)] }))
    } catch (error) {
      throw new StudiedStorageError('No se pudo guardar lo estudiado', { cause: error })
    }
  }
}
