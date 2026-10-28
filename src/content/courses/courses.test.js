import assert from 'node:assert/strict'
import test from 'node:test'
import { validateCourse } from '../../domain/course.js'
import { COURSES } from './index.js'
import { PSEINT_FUNDAMENTOS } from './pseint-fundamentos/index.js'
import { PYTHON_BUCLES } from './python-bucles/index.js'

for (const course of COURSES) {
  test(`course "${course.id}" matches the content model`, () => {
    assert.doesNotThrow(() => validateCourse(course))
  })
}

test('course ids are unique', () => {
  const ids = COURSES.map((course) => course.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('PSeInt follows the guides and keeps the coding challenge before the final check', () => {
  assert.deepEqual(PSEINT_FUNDAMENTOS.modules.map((module) => module.id), [
    'pseint-base', 'pseint-condicional', 'pseint-validacion', 'pseint-mientras',
    'pseint-repetir', 'pseint-para', 'pseint-parcial',
  ])
  const final = PSEINT_FUNDAMENTOS.modules.at(-1).lessons[0].exercises
  assert.equal(final[0].type, 'code')
  assert.equal(final[0].practiceMinutes, 40)
  assert.equal(final.length, 5)
  assert.ok(final.slice(1).every((item) => item.type === 'choice'))
  // Todas las lecciones, salvo la práctica final, traen 3 ejercicios propios para el modo clase.
  assert.ok(PSEINT_FUNDAMENTOS.modules.slice(0, -1).every(({ lessons }) => lessons.every((lesson) =>
    lesson.classExercises?.length === 3 &&
    lesson.classExercises.every((item) => !lesson.exercises.some(({ id }) => id === item.id)),
  )))
})

test('Python loops has a classroom path with distinct, individual exercises', () => {
  assert.deepEqual(PYTHON_BUCLES.modules.map(({ id }) => id), [
    'py-base', 'py-for-range', 'py-for-listas', 'py-patrones',
    'py-while', 'py-entradas', 'py-control', 'py-reto',
  ])
  for (const module of PYTHON_BUCLES.modules) {
    const lesson = module.lessons[0]
    assert.equal(lesson.theory.length, 3)
    assert.equal(lesson.classExercises.length, 3)
    assert.ok(lesson.classExercises.every((exercise) =>
      exercise.classInstruction && !/parejas/i.test(exercise.classInstruction),
    ))
    assert.ok(lesson.classExercises.every((exercise) =>
      !lesson.exercises.some((item) => item.id === exercise.id),
    ))
  }
  const final = PYTHON_BUCLES.modules.at(-1).lessons[0].exercises
  assert.equal(final[0].codeLanguage, 'Python')
  assert.ok(final.slice(1).every(({ type }) => type === 'choice'))
})
