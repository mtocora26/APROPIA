import { ENGLISH_TENSES } from './english-tenses/index.js'
import { ITALIAN_A1 } from './italian-a1/index.js'
import { PSEINT_FUNDAMENTOS } from './pseint-fundamentos/index.js'
import { PYTHON_BUCLES } from './python-bucles/index.js'
import { WINFORMS_CSHARP } from './winforms-csharp/index.js'

// Registro de cursos: agregar un curso = agregar su carpeta y listarlo aquí.
export const COURSES = Object.freeze([ITALIAN_A1, ENGLISH_TENSES, PSEINT_FUNDAMENTOS, PYTHON_BUCLES, WINFORMS_CSHARP])

export function getCourse(courseId) {
  return COURSES.find((course) => course.id === courseId) ?? null
}
