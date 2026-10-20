import { createContext, useContext } from 'react'

export const StudentContext = createContext(null)

function useStudentContext() {
  const value = useContext(StudentContext)
  if (value === null) throw new Error('Falta <StudentProvider> sobre este componente')
  return value
}

/** The active student's `ProgressRepository` (stable while the student is the same). */
export function useProgressRepository() {
  return useStudentContext().progressRepository
}

/** The active student's `FlashcardRepository` (stable while the student is the same). */
export function useFlashcardRepository() {
  return useStudentContext().flashcardRepository
}

/** The active student's `SessionRepository` (stable while the student is the same). */
export function useSessionRepository() {
  return useStudentContext().sessionRepository
}

/** `{ students, activeStudent, switchStudent, addStudent, renameStudent, removeStudent }` */
export function useStudents() {
  return useStudentContext()
}
