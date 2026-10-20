import { STUDENT_SESSIONS_VERSION } from '../students/studentModel.js'
import { validateSession } from './tutoringSession.js'

export class SessionStorageError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'SessionStorageError'
  }
}

/**
 * One student's tutoring sessions, oldest first:
 * `{ version, sessions: Session[] }`. Asynchronous like `ProgressRepository`.
 */
export class SessionRepository {
  constructor({ storage = globalThis.localStorage, storageKey }) {
    this.storage = storage
    this.storageKey = storageKey
  }

  /** @returns {Promise<object[]>} sessions ordered by date, then by creation */
  async list() {
    return this.#read().sessions
  }

  async add(session) {
    validateSession(session)
    const data = this.#read()
    const sessions = [...data.sessions, session].sort(
      (a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt),
    )

    this.#write({ ...data, sessions })
    return session
  }

  #read() {
    let serialized
    try {
      serialized = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new SessionStorageError('No se pudieron leer las tutorías', { cause: error })
    }

    if (serialized === null) return { version: STUDENT_SESSIONS_VERSION, sessions: [] }

    try {
      const data = JSON.parse(serialized)
      if (data?.version !== STUDENT_SESSIONS_VERSION || !Array.isArray(data.sessions)) {
        throw new TypeError('formato desconocido')
      }
      data.sessions.forEach(validateSession)
      return data
    } catch (error) {
      throw new SessionStorageError('Las tutorías guardadas no son válidas', { cause: error })
    }
  }

  #write(data) {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      throw new SessionStorageError('No se pudo guardar la tutoría', { cause: error })
    }
  }
}
