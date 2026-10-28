import assert from 'node:assert/strict'
import test from 'node:test'
import { buildClassSlides, exerciseMaterial, firstExerciseIndex, moveSlide, revealedAnswer, slideStage } from './classMode.js'

const lesson = {
  theory: [{ type: 'text', text: 'a' }, { type: 'tip', text: 'b' }],
  exercises: [
    { id: 'e1', type: 'choice', options: ['x', 'y'], answer: 'y' },
    { id: 'e2', type: 'open', modelAnswer: 'I have eaten.', hints: ['eat'] },
  ],
}

test('slides show all the theory first and the exercises after', () => {
  const slides = buildClassSlides(lesson)

  assert.deepEqual(slides.map((slide) => slide.kind), ['theory', 'theory', 'exercise', 'exercise'])
  assert.equal(slides[2].exercise.id, 'e1')
})

test('each slide says which stage of the lesson it is', () => {
  const slides = buildClassSlides({ ...lesson, theory: [{ type: 'syntax' }, { type: 'try' }] })
  const stage = (index) => slideStage(slides[index], { index, slides })

  assert.match(stage(0), /Estructura/)
  assert.match(stage(1), /Ejemplo en vivo/)
  assert.match(stage(2), /ejercicio 1 de 2/)
  assert.match(stage(3), /ejercicio 2 de 2/)
})

test('lessons without theory still work and every exercise gets its slide', () => {
  const extra = buildClassSlides({ ...lesson, exercises: [...lesson.exercises, { id: 'e3' }] })
  assert.deepEqual(extra.map(({ kind }) => kind), ['theory', 'theory', 'exercise', 'exercise', 'exercise'])
  assert.equal(buildClassSlides({ theory: [], exercises: lesson.exercises }).length, 2)
})

test('class-specific exercises replace solo exercises only in the projected slides', () => {
  const slides = buildClassSlides({ ...lesson, classExercises: [{ id: 'group', type: 'choice' }] })
  assert.deepEqual(slides.filter((slide) => slide.kind === 'exercise').map((slide) => slide.exercise.id), ['group'])
  assert.equal(lesson.exercises.length, 2)
})

test('reveals the answer of each exercise type', () => {
  assert.equal(revealedAnswer(lesson.exercises[0], {}), 'y')
  assert.equal(revealedAnswer(lesson.exercises[1], {}), 'I have eaten.')
})

test('shows what the class needs before the answer', () => {
  assert.deepEqual(exerciseMaterial(lesson.exercises[0]), ['x', 'y'])
  assert.deepEqual(exerciseMaterial(lesson.exercises[1]), [])
  assert.deepEqual(exerciseMaterial({ type: 'typed', answer: 'z' }), [])
})

test('moving between slides stays inside the deck', () => {
  assert.equal(moveSlide(0, -1, 4), 0)
  assert.equal(moveSlide(1, 1, 4), 2)
  assert.equal(moveSlide(3, 1, 4), 3)
})

test('finds the first exercise slide so the tutor can skip the theory', () => {
  assert.equal(firstExerciseIndex(buildClassSlides(lesson)), 2)
  assert.equal(firstExerciseIndex(buildClassSlides({ theory: lesson.theory, exercises: [] })), -1)
})
