export const STUDENTS_STORAGE_KEY = 'apropia.students'
export const STUDENTS_VERSION = 1
export const DEFAULT_STUDENT_ID = 'yo'
export const ADMIN_STUDENT_ID = 'admin'
export const MAX_NAME_LENGTH = 40

export const STUDENT_CARDS_VERSION = 1
export const STUDENT_SESSIONS_VERSION = 1

const PROGRESS_KEY_PREFIX = 'apropia.progress'
const CARDS_KEY_PREFIX = 'apropia.cards'
const SESSIONS_KEY_PREFIX = 'apropia.sessions'
const STUDIED_KEY_PREFIX = 'apropia.studied'

/**
 * Storage key of a student's course progress. The default student keeps the
 * key used before students existed, so its progress needs no migration.
 */
export function progressStorageKey(studentId) {
  return studentId === DEFAULT_STUDENT_ID
    ? PROGRESS_KEY_PREFIX
    : `${PROGRESS_KEY_PREFIX}.${studentId}`
}

/** Storage key of a student's flashcard schedule (same rule as progress). */
export function cardsStorageKey(studentId) {
  return studentId === DEFAULT_STUDENT_ID
    ? CARDS_KEY_PREFIX
    : `${CARDS_KEY_PREFIX}.${studentId}`
}

/** Storage key of a student's tutoring sessions log (same rule as progress). */
export function sessionsStorageKey(studentId) {
  return studentId === DEFAULT_STUDENT_ID
    ? SESSIONS_KEY_PREFIX
    : `${SESSIONS_KEY_PREFIX}.${studentId}`
}

/** Storage key of the lessons marked as studied (same rule as progress). */
export function studiedStorageKey(studentId) {
  return studentId === DEFAULT_STUDENT_ID
    ? STUDIED_KEY_PREFIX
    : `${STUDIED_KEY_PREFIX}.${studentId}`
}

/** Every storage key that holds data belonging to one student. */
export function studentStorageKeys(studentId) {
  return [
    progressStorageKey(studentId),
    cardsStorageKey(studentId),
    sessionsStorageKey(studentId),
    studiedStorageKey(studentId),
  ]
}

export function normalizeStudentName(name) {
  const clean = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : ''

  if (clean === '') throw new TypeError('El nombre del estudiante es obligatorio')
  if (clean.length > MAX_NAME_LENGTH) {
    throw new TypeError(`El nombre no puede superar ${MAX_NAME_LENGTH} caracteres`)
  }

  return clean
}

export function createStudent({ id, name, createdAt }) {
  return { id, name: normalizeStudentName(name), createdAt }
}

export function createDefaultStudentsData(now) {
  return {
    version: STUDENTS_VERSION,
    students: [
      createStudent({ id: DEFAULT_STUDENT_ID, name: 'Yo', createdAt: now }),
      createStudent({ id: ADMIN_STUDENT_ID, name: 'Tutor (admin)', createdAt: now }),
    ],
    activeId: DEFAULT_STUDENT_ID,
  }
}

/** Existing local student lists gain the tutor profile without changing their active student. */
export function withAdminStudent(data, now) {
  if (data.students.some((student) => student.id === ADMIN_STUDENT_ID)) return data
  return {
    ...data,
    students: [...data.students, createStudent({ id: ADMIN_STUDENT_ID, name: 'Tutor (admin)', createdAt: now })],
  }
}

/** Returns `data` if it is a valid students document, otherwise throws. */
export function validateStudentsData(data) {
  if (
    !isRecord(data) ||
    data.version !== STUDENTS_VERSION ||
    !Array.isArray(data.students) ||
    data.students.length === 0
  ) {
    throw new TypeError('Los datos de estudiantes no son válidos')
  }

  const ids = new Set()
  for (const student of data.students) {
    if (
      !isRecord(student) ||
      typeof student.id !== 'string' ||
      !/^[a-z0-9-]+$/.test(student.id) ||
      typeof student.name !== 'string' ||
      student.name.trim() === '' ||
      ids.has(student.id)
    ) {
      throw new TypeError('Los datos de estudiantes no son válidos')
    }
    ids.add(student.id)
  }

  if (!ids.has(data.activeId)) {
    throw new TypeError('El estudiante activo no existe')
  }

  return data
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
