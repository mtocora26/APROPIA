import { ProgressRepository } from './ProgressRepository.js'
import { createEmptyProgress, validateProgress } from './progressModel.js'

const DEFAULT_STORAGE_KEY = 'apropia.progress'
const STORAGE_VERSION = 1

export class ProgressStorageError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ProgressStorageError'
  }
}

export class LocalStorageRepository extends ProgressRepository {
  constructor({
    storage = globalThis.localStorage,
    storageKey = DEFAULT_STORAGE_KEY,
    now = () => new Date().toISOString(),
  } = {}) {
    super()

    if (!isStorage(storage)) {
      throw new TypeError('A Storage-compatible object is required')
    }

    this.storage = storage
    this.storageKey = storageKey
    this.now = now
  }

  async getProgress(courseId) {
    const data = this.#readData()

    if (!Object.hasOwn(data.courses, courseId)) {
      return createEmptyProgress(courseId)
    }

    const progress = data.courses[courseId]
    return validateProgress(courseId, progress)
  }

  async saveProgress(courseId, progress) {
    const validated = validateProgress(courseId, progress)
    const savedProgress = {
      ...validated,
      updatedAt: this.now(),
    }
    const data = this.#readData()

    this.#writeData({
      version: STORAGE_VERSION,
      courses: {
        ...data.courses,
        [courseId]: savedProgress,
      },
    })

    return validateProgress(courseId, savedProgress)
  }

  async clearProgress(courseId) {
    const data = this.#readData()

    if (!Object.hasOwn(data.courses, courseId)) {
      createEmptyProgress(courseId)
      return
    }

    const courses = { ...data.courses }
    delete courses[courseId]
    this.#writeData({ version: STORAGE_VERSION, courses })
  }

  #readData() {
    let serialized

    try {
      serialized = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new ProgressStorageError('Unable to read study progress', {
        cause: error,
      })
    }

    if (serialized === null) {
      return { version: STORAGE_VERSION, courses: {} }
    }

    let data
    try {
      data = JSON.parse(serialized)
    } catch (error) {
      throw new ProgressStorageError('Stored study progress is not valid JSON', {
        cause: error,
      })
    }

    if (
      !isRecord(data) ||
      data.version !== STORAGE_VERSION ||
      !isRecord(data.courses)
    ) {
      throw new ProgressStorageError(
        `Stored study progress does not match version ${STORAGE_VERSION}`,
      )
    }

    return data
  }

  #writeData(data) {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      throw new ProgressStorageError('Unable to save study progress', {
        cause: error,
      })
    }
  }
}

function isStorage(storage) {
  return (
    storage !== null &&
    typeof storage === 'object' &&
    typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function'
  )
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
