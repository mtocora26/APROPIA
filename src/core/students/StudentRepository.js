import {
  STUDENTS_STORAGE_KEY,
  STUDENTS_VERSION,
  createDefaultStudentsData,
  createStudent,
  normalizeStudentName,
  studentStorageKeys,
  validateStudentsData,
} from './studentModel.js'

export class StudentStorageError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'StudentStorageError'
  }
}

/**
 * Students of the tutoring sessions and which one is active.
 *
 * Unlike `ProgressRepository` it is synchronous: the list is tiny, the app
 * needs it before its first render, and it has no remote implementation planned
 * (see ADR-0006).
 */
export class StudentRepository {
  constructor({
    storage = globalThis.localStorage,
    storageKey = STUDENTS_STORAGE_KEY,
    now = () => new Date().toISOString(),
    generateId = () => crypto.randomUUID().slice(0, 8),
  } = {}) {
    this.storage = storage
    this.storageKey = storageKey
    this.now = now
    this.generateId = generateId
  }

  list() {
    return this.#read().students
  }

  getActive() {
    const { students, activeId } = this.#read()
    return students.find((student) => student.id === activeId)
  }

  setActive(id) {
    const data = this.#read()
    if (!data.students.some((student) => student.id === id)) {
      throw new TypeError('El estudiante no existe')
    }
    this.#write({ ...data, activeId: id })
  }

  /** Adds a student and makes them the active one. */
  add(name) {
    const data = this.#read()
    const student = createStudent({
      id: this.#newId(data.students),
      name: this.#uniqueName(data.students, name),
      createdAt: this.now(),
    })
    this.#write({
      ...data,
      students: [...data.students, student],
      activeId: student.id,
    })
    return student
  }

  rename(id, name) {
    const data = this.#read()
    if (!data.students.some((student) => student.id === id)) {
      throw new TypeError('El estudiante no existe')
    }
    const others = data.students.filter((student) => student.id !== id)
    const clean = this.#uniqueName(others, name)
    this.#write({
      ...data,
      students: data.students.map((student) =>
        student.id === id ? { ...student, name: clean } : student,
      ),
    })
  }

  /** Removes a student and all their stored data. The last one cannot be removed. */
  remove(id) {
    const data = this.#read()
    if (!data.students.some((student) => student.id === id)) {
      throw new TypeError('El estudiante no existe')
    }
    if (data.students.length === 1) {
      throw new TypeError('Debe quedar al menos un estudiante')
    }

    const students = data.students.filter((student) => student.id !== id)
    const activeId = data.activeId === id ? students[0].id : data.activeId
    this.#write({ ...data, students, activeId })

    try {
      for (const key of studentStorageKeys(id)) this.storage.removeItem(key)
    } catch (error) {
      throw new StudentStorageError('No se pudo borrar el progreso del estudiante', {
        cause: error,
      })
    }
  }

  #newId(students) {
    for (;;) {
      const id = this.generateId()
      if (!students.some((student) => student.id === id)) return id
    }
  }

  #uniqueName(students, name) {
    const clean = normalizeStudentName(name)
    const taken = students.some(
      (student) => student.name.toLowerCase() === clean.toLowerCase(),
    )
    if (taken) throw new TypeError('Ya existe un estudiante con ese nombre')
    return clean
  }

  #read() {
    let serialized
    try {
      serialized = this.storage.getItem(this.storageKey)
    } catch (error) {
      throw new StudentStorageError('No se pudo leer la lista de estudiantes', {
        cause: error,
      })
    }

    if (serialized === null) return createDefaultStudentsData(this.now())

    try {
      return validateStudentsData(JSON.parse(serialized))
    } catch (error) {
      throw new StudentStorageError('La lista de estudiantes guardada no es válida', {
        cause: error,
      })
    }
  }

  #write(data) {
    try {
      this.storage.setItem(
        this.storageKey,
        JSON.stringify({ ...data, version: STUDENTS_VERSION }),
      )
    } catch (error) {
      throw new StudentStorageError('No se pudo guardar la lista de estudiantes', {
        cause: error,
      })
    }
  }
}
