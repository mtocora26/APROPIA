import { ENGLISH_TENSES } from './english-tenses/index.js'
import { ITALIAN_A1 } from './italian-a1/index.js'

// Registro de cursos: agregar un curso = agregar su carpeta y listarlo aquí.
export const COURSES = Object.freeze([ITALIAN_A1, ENGLISH_TENSES])

export function getCourse(courseId) {
  return COURSES.find((course) => course.id === courseId) ?? null
}
