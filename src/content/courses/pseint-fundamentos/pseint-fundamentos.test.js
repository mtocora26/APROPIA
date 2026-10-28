import assert from 'node:assert/strict'
import test from 'node:test'
import { gradeProgram } from '../../../core/pseint/grader.js'
import { PSEINT_FUNDAMENTOS } from './index.js'

const lessons = PSEINT_FUNDAMENTOS.modules.flatMap((module) => module.lessons)
const codeExercises = lessons.flatMap((lesson) =>
  [...(lesson.classExercises ?? []), ...lesson.exercises]
    .filter((exercise) => exercise.type === 'code')
    .map((exercise) => ({ lesson, exercise })),
)

test('el curso tiene ejercicios de código en cada tema', () => {
  assert.ok(codeExercises.length >= 14)
  for (const lesson of lessons) {
    assert.ok(lesson.exercises.some((exercise) => exercise.type === 'code'), `${lesson.id} sin código`)
  }
})

for (const { exercise } of codeExercises) {
  test(`${exercise.id}: la solución modelo pasa todas sus pruebas`, () => {
    const grade = gradeProgram(exercise.modelAnswer, exercise.tests)
    const failed = grade.results.filter((result) => !result.passed).map((result) => `${result.name}: ${result.reason}`)
    assert.deepEqual(failed, [])
  })

  test(`${exercise.id}: el código inicial no pasa sin trabajo del estudiante`, () => {
    assert.equal(gradeProgram(exercise.starter ?? '', exercise.tests).passed, false)
  })
}

test('los bloques de teoría que referencian los ejercicios existen', () => {
  for (const { lesson, exercise } of codeExercises) {
    for (const index of exercise.theory ?? []) {
      assert.ok(lesson.theory[index], `${exercise.id} apunta a theory[${index}] que no existe`)
    }
  }
})

test('cada ejemplo ejecutable de la teoría corre sin errores con sus datos de prueba', async () => {
  const { runProgram } = await import('../../../core/pseint/index.js')
  const examples = lessons.flatMap((lesson) => lesson.theory.filter((block) => block.type === 'try').map((block) => ({ lesson, block })))
  assert.ok(examples.length >= 8)
  for (const { lesson, block } of examples) {
    const run = runProgram(block.code, { inputs: block.datos ?? [] })
    assert.equal(run.error, null, `${lesson.id}: ${run.error?.message}`)
  }
})
