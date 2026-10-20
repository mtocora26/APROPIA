import { LocalStorageRepository } from '../core/storage/LocalStorageRepository.js'
import { FlashcardRepository } from '../core/flashcards/FlashcardRepository.js'
import { StudentRepository } from '../core/students/StudentRepository.js'
import { cardsStorageKey, progressStorageKey } from '../core/students/studentModel.js'

/**
 * Composition root for persistence: the only place that decides which
 * implementations the app uses. Each student has their own progress store
 * (ADR-0006); a future `FirebaseRepository` would replace
 * `createProgressRepository` without touching any consumer.
 */
export const studentRepository = new StudentRepository()

export function createProgressRepository(studentId) {
  return new LocalStorageRepository({ storageKey: progressStorageKey(studentId) })
}

export function createFlashcardRepository(studentId) {
  return new FlashcardRepository({ storageKey: cardsStorageKey(studentId) })
}
